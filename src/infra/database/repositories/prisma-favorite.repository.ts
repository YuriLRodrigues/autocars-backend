import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { AsyncMaybe, Maybe } from '@root/core/logic/Maybe';
import {
  CreateProps,
  FavoriteRepository,
  DeleteProps,
  FindAllByUserIdProps,
  FindAllProps,
  FindByUserIdProps,
  FindTotalCountByAdvertisementProps,
} from '@root/domain/application/repositories/favorite.repository';
import { Capacity, Doors, Fuel, GearBox, SoldStatus } from '@root/domain/enterprise/entities/advertisement.entity';
import { FavoriteEntity } from '@root/domain/enterprise/entities/favorite.entity';
import { FavoriteAdminDetails } from '@root/domain/enterprise/value-object/favorite-admin-details';
import { FavoriteDetails } from '@root/domain/enterprise/value-object/favorite-details';

import { FavoriteMappers } from '../mappers/favorite.mappers';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaFavoriteRepository implements FavoriteRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ favorite }: CreateProps): AsyncMaybe<FavoriteEntity> {
    const raw = FavoriteMappers.toPersistence(favorite);

    await this.prismaService.favorite.create({
      data: raw,
    });

    return Maybe.some(favorite);
  }

  async findAll({ limit, page }: FindAllProps): AsyncMaybe<PaginatedResult<FavoriteAdminDetails[]>> {
    const totalCountAdsDistinct = await this.prismaService.favorite.groupBy({
      by: ['advertisementId'],
      _count: {
        advertisementId: true,
      },
    });

    const favorites = await this.prismaService.favorite.findMany({
      skip: (page - 1) * limit,
      take: limit,
      distinct: ['advertisementId'],
      include: {
        advertisement: {
          select: {
            id: true,
            price: true,
            thumbnailUrl: true,
            title: true,
            soldStatus: true,
            images: {
              select: {
                blurHash: true,
              },
            },
          },
        },
        user: {
          select: {
            avatar: true,
            id: true,
            name: true,
          },
        },
      },
    });

    const mappedFavorites = favorites.map((fav) =>
      FavoriteAdminDetails.create({
        advertisement: {
          id: new UniqueEntityId(fav.advertisement.id),
          price: fav.advertisement.price,
          thumbnailUrl: fav.advertisement.thumbnailUrl,
          blurHash: fav.advertisement.images[0].blurHash,
          title: fav.advertisement.title,
          status: SoldStatus[fav.advertisement.soldStatus],
        },
        user: {
          avatar: fav.user.avatar,
          id: new UniqueEntityId(fav.user.id),
          name: fav.user.name,
        },
        id: new UniqueEntityId(fav.id),
        favoritesCount: totalCountAdsDistinct.find((t) => t.advertisementId === fav.advertisementId)?._count
          .advertisementId,
        createdAt: fav.createdAt,
      }),
    );

    return Maybe.some({
      data: mappedFavorites,
      meta: {
        page,
        perPage: limit,
        totalPages: Math.ceil(totalCountAdsDistinct.length / limit),
        totalCount: totalCountAdsDistinct.length,
      },
    });
  }

  async findAllByUserId({ limit, page, userId }: FindAllByUserIdProps): AsyncMaybe<PaginatedResult<FavoriteDetails[]>> {
    const [favorites, count] = await this.prismaService.$transaction([
      this.prismaService.favorite.findMany({
        where: {
          userId: userId.toValue(),
        },
        skip: (page - 1) * limit,
        take: limit,

        select: {
          id: true,
          advertisement: {
            select: {
              doors: true,
              gearBox: true,
              fuel: true,
              km: true,
              capacity: true,
              title: true,
              price: true,
              thumbnailUrl: true,
              id: true,
              soldStatus: true,
              images: {
                select: {
                  blurHash: true,
                },
              },
            },
          },
        },
      }),
      this.prismaService.favorite.count({
        where: {
          userId: userId.toValue(),
        },
      }),
    ]);

    const mappedFavorites = favorites.map((fav) =>
      FavoriteDetails.create({
        id: new UniqueEntityId(fav.id),
        advertisement: {
          id: new UniqueEntityId(fav.advertisement.id),
          price: fav.advertisement.price,
          thumbnailUrl: fav.advertisement.thumbnailUrl,
          blurHash: fav.advertisement.images[0].blurHash,
          title: fav.advertisement.title,
          doors: Doors[fav.advertisement.doors],
          capacity: Capacity[fav.advertisement.capacity],
          fuel: Fuel[fav.advertisement.fuel],
          gearBox: GearBox[fav.advertisement.gearBox],
          km: fav.advertisement.km,
          soldStatus: SoldStatus[fav.advertisement.soldStatus],
        },
      }),
    );

    return Maybe.some({
      data: mappedFavorites,
      meta: {
        page: page,
        perPage: limit,
        totalPages: Math.ceil(count / limit),
        totalCount: count,
      },
    });
  }

  async findByUserId({ advertisementId, userId }: FindByUserIdProps): AsyncMaybe<FavoriteEntity> {
    const favorite = await this.prismaService.favorite.findFirst({
      where: {
        advertisementId: advertisementId.toValue(),
        userId: userId.toValue(),
      },
    });

    if (!favorite) {
      return Maybe.none();
    }

    return Maybe.some(FavoriteMappers.toDomain(favorite));
  }

  async findDistinctCount(): AsyncMaybe<number> {
    const totalCountFavoriteAdsDistinct = await this.prismaService.favorite.groupBy({
      by: ['advertisementId'],
      _count: {
        advertisementId: true,
      },
    });

    return Maybe.some(totalCountFavoriteAdsDistinct.length);
  }

  async findTotalCount(): AsyncMaybe<number> {
    const totalCountFavoriteAds = await this.prismaService.favorite.count();

    return Maybe.some(totalCountFavoriteAds);
  }

  async findTotalCountByAdvertisement({ advertisementId }: FindTotalCountByAdvertisementProps): AsyncMaybe<number> {
    const totalCountFavoriteAds = await this.prismaService.favorite.count({
      where: {
        advertisementId: advertisementId.toValue(),
      },
    });

    return Maybe.some(totalCountFavoriteAds);
  }

  async delete({ userId, favoriteId }: DeleteProps): AsyncMaybe<void> {
    await this.prismaService.favorite.delete({
      where: {
        id: favoriteId.toValue(),
        userId: userId.toValue(),
      },
    });

    return Maybe.none();
  }
}
