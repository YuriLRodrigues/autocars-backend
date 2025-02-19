import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { AsyncMaybe, Maybe } from '@root/core/logic/Maybe';
import {
  AdvertisementRepository,
  CreateAdProps,
  DeleteAdProps,
  FindAdByIdProps,
  FindAllAdsByUserIdProps,
  FindAllAdsProps,
  FindAllManagerAdsProps,
  FindAllOwnAdsProps,
  FindAllSoldAds,
  FindMetricsByUserId,
  SaveAdProps,
} from '@root/domain/application/repositories/advertisement.repository';
import {
  AdvertisementEntity,
  Capacity,
  Doors,
  Color,
  Model,
  Fuel,
  GearBox,
  SoldStatus,
} from '@root/domain/enterprise/entities/advertisement.entity';
import { LikeEntity } from '@root/domain/enterprise/entities/like.entity';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { AdvertisementDetails } from '@root/domain/enterprise/value-object/advertisement-details';
import { ManagerAdvertisements } from '@root/domain/enterprise/value-object/manager-advertisements';
import { MinimalAdvertisementDetails } from '@root/domain/enterprise/value-object/minimal-advertisement-details';
import { OwnAdvertisements } from '@root/domain/enterprise/value-object/own-advertisements';
import { UserAdvertisements } from '@root/domain/enterprise/value-object/user-advertisements';
import dayjs from 'dayjs';

import { AdvertisementMappers } from '../mappers/advertisement.mappers';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAdvertisementRepository implements AdvertisementRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllAdsByUserId({
    page,
    limit,
    userId,
    search,
  }: FindAllAdsByUserIdProps): AsyncMaybe<PaginatedResult<UserAdvertisements[]>> {
    const [ads, count] = await this.prismaService.$transaction([
      this.prismaService.advertisement.findMany({
        where: {
          userId: userId.toValue(),
          title: search?.title || undefined,
          soldStatus: search?.soldStatus || undefined,
          price: search?.price || undefined,
          user: {
            name: search?.sellerName || undefined,
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          createdAt: true,
          id: true,
          price: true,
          soldStatus: true,
          title: true,
          salePrice: true,
          km: true,
          capacity: true,
          model: true,
          doors: true,
          fuel: true,
          gearBox: true,
          images: {
            where: {
              isThumbnail: true,
            },
            select: {
              blurHash: true,
              url: true,
            },
          },
          user: {
            select: {
              name: true,
              avatar: true,
              id: true,
            },
          },
        },
      }),
      this.prismaService.advertisement.count({
        where: { userId: userId.toValue() },
      }),
    ]);

    const selectedAds = ads.map((ad) =>
      UserAdvertisements.create({
        advertisement: {
          createdAt: ad.createdAt,
          id: new UniqueEntityId(ad.id),
          price: ad.price,
          soldStatus: SoldStatus[ad.soldStatus],
          title: ad.title,
          salePrice: ad.salePrice || null,
          km: ad.km,
          capacity: Capacity[ad.capacity],
          model: Model[ad.model],
          doors: Doors[ad.doors],
          fuel: Fuel[ad.fuel],
          gearBox: GearBox[ad.gearBox],
          blurHash: ad.images[0].blurHash,
          thumbnailUrl: ad.images[0].url,
        },
        user: {
          id: new UniqueEntityId(ad.user.id),
          profileImg: ad.user.avatar,

          username: ad.user.name,
        },
      }),
    );

    return Maybe.some({
      data: selectedAds,
      meta: { page, perPage: limit, totalCount: count, totalPages: Math.ceil(count / limit) },
    });
  }

  async findAllOwnAds({
    page,
    limit,
    userId,
    search,
  }: FindAllOwnAdsProps): AsyncMaybe<PaginatedResult<OwnAdvertisements[]>> {
    const [ads, count] = await this.prismaService.$transaction([
      this.prismaService.advertisement.findMany({
        where: {
          userId: userId.toValue(),
          title: {
            contains: search?.title ? search?.title : undefined,
            mode: 'insensitive',
          },
          soldStatus: search?.soldStatus || undefined,
          brandId: search?.brandId ? search?.brandId.toValue() : undefined,
          AND: [
            {
              OR: [
                {
                  price: search?.price
                    ? {
                        lte: search?.price,
                      }
                    : undefined,
                },
                {
                  salePrice: search?.price
                    ? {
                        lte: search?.price,
                      }
                    : undefined,
                },
              ],
            },
          ],
          createdAt: {
            gte: search?.startDate
              ? dayjs(search?.startDate)
                  .startOf('day')
                  .toDate()
              : undefined,
            lte: search?.endDate
              ? dayjs(search?.endDate)
                  .endOf('day')
                  .toDate()
              : undefined,
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          createdAt: true,
          id: true,
          price: true,
          soldStatus: true,
          title: true,
          salePrice: true,
          thumbnailUrl: true,
          images: {
            select: {
              blurHash: true,
            },
          },
          brand: {
            select: {
              name: true,
              logoUrl: true,
              id: true,
            },
          },
        },
        orderBy: { createdAt: search?.createdAt },
      }),
      this.prismaService.advertisement.count({
        where: { userId: userId.toValue() },
      }),
    ]);

    const selectedAds = ads.map((ad) =>
      OwnAdvertisements.create({
        createdAt: ad.createdAt,
        id: new UniqueEntityId(ad.id),
        price: ad.price,
        soldStatus: SoldStatus[ad.soldStatus],
        title: ad.title,
        salePrice: ad.salePrice || null,
        thumbnailUrl: ad.thumbnailUrl,
        blurHash: ad.images[0].blurHash,
        brand: {
          id: new UniqueEntityId(ad.brand.id),
          name: ad.brand.name,
          logoUrl: ad.brand.logoUrl,
        },
      }),
    );

    return Maybe.some({
      data: selectedAds,
      meta: { page, perPage: limit, totalCount: count, totalPages: Math.ceil(count / limit) },
    });
  }

  async findAllManagerAds({
    page,
    limit,
    search,
  }: FindAllManagerAdsProps): AsyncMaybe<PaginatedResult<ManagerAdvertisements[]>> {
    const [ads, count] = await this.prismaService.$transaction([
      this.prismaService.advertisement.findMany({
        where: {
          title: {
            contains: search?.title ? search?.title : undefined,
            mode: 'insensitive',
          },
          soldStatus: search?.soldStatus || undefined,
          brandId: search?.brandId ? search?.brandId.toValue() : undefined,
          AND: [
            {
              OR: [
                {
                  price: search?.price
                    ? {
                        lte: search?.price,
                      }
                    : undefined,
                },
                {
                  salePrice: search?.price
                    ? {
                        lte: search?.price,
                      }
                    : undefined,
                },
              ],
            },
          ],
          createdAt: {
            gte: search?.startDate
              ? dayjs(search?.startDate)
                  .startOf('day')
                  .toDate()
              : undefined,
            lte: search?.endDate
              ? dayjs(search?.endDate)
                  .endOf('day')
                  .toDate()
              : undefined,
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          createdAt: true,
          id: true,
          price: true,
          soldStatus: true,
          title: true,
          salePrice: true,
          thumbnailUrl: true,
          images: {
            select: {
              blurHash: true,
              isThumbnail: true,
              isAvatar: true,
            },
          },
          brand: {
            select: {
              name: true,
              logoUrl: true,
              id: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: search?.createdAt },
      }),
      this.prismaService.advertisement.count(),
    ]);

    const selectedAds = ads.map((ad) =>
      ManagerAdvertisements.create({
        createdAt: ad.createdAt,
        id: new UniqueEntityId(ad.id),
        price: ad.price,
        soldStatus: SoldStatus[ad.soldStatus],
        title: ad.title,
        salePrice: ad.salePrice || null,
        thumbnailUrl: ad.thumbnailUrl,
        blurHash: ad.images.find((img) => img.isThumbnail).blurHash,
        brand: {
          id: new UniqueEntityId(ad.brand.id),
          name: ad.brand.name,
          logoUrl: ad.brand.logoUrl,
        },
        user: {
          id: new UniqueEntityId(ad.user.id),
          name: ad.user.name,
          avatar: ad.user?.avatar ?? undefined,
          blurHash: ad.images.find((img) => img.isAvatar)?.blurHash ?? undefined,
        },
      }),
    );

    return Maybe.some({
      data: selectedAds,
      meta: { page, perPage: limit, totalCount: count, totalPages: Math.ceil(count / limit) },
    });
  }

  async findMetricsByUserId({ userId }: FindMetricsByUserId): AsyncMaybe<{
    activesAdvertisements: number;
    reservedAdvertisements: number;
    soldAdvertisements: number;
    totalAdvertisements: number;
  }> {
    const [activesAdvertisements, reservedAdvertisements, soldAdvertisements, totalAdvertisements] =
      await this.prismaService.$transaction([
        this.prismaService.advertisement.count({
          where: {
            userId: userId.toValue(),
            soldStatus: SoldStatus.Active,
          },
        }),
        this.prismaService.advertisement.count({
          where: {
            userId: userId.toValue(),
            soldStatus: SoldStatus.Reserved,
          },
        }),
        this.prismaService.advertisement.count({
          where: {
            userId: userId.toValue(),
            soldStatus: SoldStatus.Sold,
          },
        }),
        this.prismaService.advertisement.count({
          where: {
            userId: userId.toValue(),
          },
        }),
      ]);

    return Maybe.some({
      activesAdvertisements,
      reservedAdvertisements,
      soldAdvertisements,
      totalAdvertisements,
    });
  }

  async findMetrics(): AsyncMaybe<{
    activesAdvertisements: number;
    reservedAdvertisements: number;
    soldAdvertisements: number;
    totalSellers: number;
    totalManagers: number;
    totalAdvertisements: number;
  }> {
    const [
      activesAdvertisements,
      reservedAdvertisements,
      soldAdvertisements,
      totalSellers,
      totalManagers,
      totalAdvertisements,
    ] = await this.prismaService.$transaction([
      this.prismaService.advertisement.count({
        where: {
          soldStatus: SoldStatus.Active,
        },
      }),
      this.prismaService.advertisement.count({
        where: {
          soldStatus: SoldStatus.Reserved,
        },
      }),
      this.prismaService.advertisement.count({
        where: {
          soldStatus: SoldStatus.Sold,
        },
      }),
      this.prismaService.user.count({
        where: {
          roles: {
            hasSome: [UserRoles.Seller],
          },
        },
      }),
      this.prismaService.user.count({
        where: {
          roles: {
            hasSome: [UserRoles.Manager],
          },
        },
      }),
      this.prismaService.advertisement.count(),
    ]);

    return Maybe.some({
      activesAdvertisements,
      reservedAdvertisements,
      soldAdvertisements,
      totalSellers,
      totalManagers,
      totalAdvertisements,
    });
  }

  async findAllSoldAds({ referenceDate, userId, isManager }: FindAllSoldAds): AsyncMaybe<
    {
      salePrice?: number;
      price: number;
      updatedAt: Date;
    }[]
  > {
    const date = dayjs(`${dayjs().year()}-${referenceDate}-01`);
    const monthStart = date.startOf('month').toDate();
    const monthEnd = date.endOf('month').toDate();

    const soldAds = await this.prismaService.advertisement.findMany({
      where: {
        userId: !isManager ? userId.toValue() : undefined,
        soldStatus: SoldStatus.Sold,
        updatedAt: {
          gte: monthStart,
          lt: monthEnd,
        },
      },
      select: {
        updatedAt: true,
        price: true,
        salePrice: true,
      },
      orderBy: {
        updatedAt: 'asc',
      },
      take: 6,
    });

    return Maybe.some(soldAds);
  }

  async createAd({ advertisement }: CreateAdProps): AsyncMaybe<AdvertisementEntity> {
    const raw = AdvertisementMappers.toPersistence(advertisement);

    const ad = await this.prismaService.advertisement.create({
      data: raw,
    });

    const mappedAd = AdvertisementMappers.toDomain(ad);

    return Maybe.some(mappedAd);
  }

  async findAllAds({
    page,
    limit,
    search,
  }: FindAllAdsProps): AsyncMaybe<PaginatedResult<MinimalAdvertisementDetails[]>> {
    const [ads, count] = await this.prismaService.$transaction([
      this.prismaService.advertisement.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          brandId: search?.brandId ? search.brandId.toValue() : undefined,
          fuel: Fuel[search.fuel] || undefined,
          color: Color[search.color] || undefined,
          model: Model[search.model] || undefined,
          year: search.year || undefined,
          soldStatus: search.soldStatus || undefined,
          title: {
            contains: search?.title ? search?.title : undefined,
            mode: 'insensitive',
          },
          AND: [
            {
              OR: [
                {
                  price: search?.price
                    ? {
                        lte: search?.price,
                      }
                    : undefined,
                },
                {
                  salePrice: search?.price
                    ? {
                        lte: search?.price,
                      }
                    : undefined,
                },
                {
                  km: search?.km
                    ? {
                        lte: search?.km,
                      }
                    : undefined,
                },
              ],
            },
          ],
        },
        orderBy: {
          createdAt: search.createdAt || undefined,
        },
        select: {
          brand: {
            select: {
              name: true,
              logoUrl: true,
              id: true,
            },
          },
          km: true,
          price: true,
          salePrice: true,
          title: true,
          capacity: true,
          doors: true,
          fuel: true,
          gearBox: true,
          model: true,
          soldStatus: true,
          id: true,
          thumbnailUrl: true,
          images: {
            select: {
              blurHash: true,
              isThumbnail: true,
            },
          },
          likes: true,
        },
      }),
      this.prismaService.advertisement.count(),
    ]);

    const selectedAds = ads.map((ad) =>
      MinimalAdvertisementDetails.create({
        advertisementId: new UniqueEntityId(ad.id),
        title: ad.title,
        price: ad.price,
        salePrice: ad.salePrice,
        km: ad.km,
        capacity: Capacity[ad.capacity],
        doors: Doors[ad.doors],
        fuel: Fuel[ad.fuel],
        gearBox: GearBox[ad.gearBox],
        soldStatus: SoldStatus[ad.soldStatus],
        model: Model[ad.model],
        thumbnailUrl: ad.thumbnailUrl,
        blurHash: ad.images[0].blurHash,
        brand: {
          brandId: new UniqueEntityId(ad.brand.id),
          logoUrl: ad.brand.logoUrl,
          name: ad.brand.name,
        },
        likes: ad.likes.map((like) =>
          LikeEntity.create({
            userId: new UniqueEntityId(like.userId),
            feedbackId: new UniqueEntityId(like.feedbackId),
            advertisementId: new UniqueEntityId(like.advertisementId),
            createdAt: like.createdAt,
            updatedAt: like.updatedAt,
          }),
        ),
      }),
    );

    return Maybe.some({
      data: selectedAds,
      meta: {
        page: page,
        perPage: limit,
        totalPages: Math.ceil(count / limit),
        totalCount: count,
      },
    });
  }

  async findAdById({ id }: FindAdByIdProps): AsyncMaybe<AdvertisementEntity> {
    const ad = await this.prismaService.advertisement.findFirst({
      where: {
        id: id.toValue(),
      },
    });

    if (!ad) {
      return Maybe.none();
    }

    const mappedAd = AdvertisementMappers.toDomain(ad);

    return Maybe.some(mappedAd);
  }
  async findAdDetailsById({ id }: FindAdByIdProps): AsyncMaybe<AdvertisementDetails> {
    const ad = await this.prismaService.advertisement.findFirst({
      where: {
        id: id.toValue(),
      },
      select: {
        brand: {
          select: {
            name: true,
            logoUrl: true,
            id: true,
          },
        },
        km: true,
        price: true,
        title: true,
        capacity: true,
        doors: true,
        fuel: true,
        gearBox: true,
        id: true,
        thumbnailUrl: true,
        localization: true,
        phone: true,
        year: true,
        description: true,
        details: true,
        color: true,
        model: true,
        soldStatus: true,
        salePrice: true,
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            address: {
              select: {
                city: true,
                street: true,
                zipCode: true,
              },
            },
          },
        },
        images: {
          select: {
            id: true,
            url: true,
            blurHash: true,
            isThumbnail: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!ad) {
      return Maybe.none();
    }

    const mappedAd = AdvertisementDetails.create({
      title: ad.title,
      price: ad.price,
      km: ad.km,
      capacity: Capacity[ad.capacity],
      doors: Doors[ad.doors],
      fuel: Fuel[ad.fuel],
      gearBox: GearBox[ad.gearBox],
      brand: {
        brandId: new UniqueEntityId(ad.brand.id),
        logoUrl: ad.brand.logoUrl,
        name: ad.brand.name,
      },
      localization: ad.localization,
      phone: ad.phone,
      year: ad.year,
      description: ad.description,
      details: ad.details,
      color: Color[ad.color],
      model: Model[ad.model],
      soldStatus: SoldStatus[ad.soldStatus],
      salePrice: ad.salePrice,
      user: {
        id: new UniqueEntityId(ad.user.id),
        name: ad.user.name,
        avatar: ad.user.avatar,
        address: {
          city: ad.user.address.city,
          street: ad.user.address.street,
          zipCode: ad.user.address.zipCode,
        },
      },
      images: ad.images.map((img) => ({
        blurHash: img.blurHash,
        id: new UniqueEntityId(img.id),
        url: img.url,
        isThumbnail: img.isThumbnail,
      })),
      createdAt: ad.createdAt,
      updatedAt: ad.updatedAt,
    });

    return Maybe.some(mappedAd);
  }

  async deleteAd({ advertisementId }: DeleteAdProps): AsyncMaybe<void> {
    await this.prismaService.advertisement.delete({
      where: {
        id: advertisementId.toValue(),
      },
    });

    return;
  }

  async saveAd({ advertisement }: SaveAdProps): AsyncMaybe<void> {
    const raw = AdvertisementMappers.toPersistence(advertisement);

    await this.prismaService.advertisement.update({
      data: raw,
      where: {
        id: advertisement.id.toValue(),
      },
    });

    return;
  }
}
