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
  FindAdvertisementIsFavoritedProps,
} from '@root/domain/application/repositories/favorite.repository';
import {
  Capacity,
  Doors,
  Fuel,
  GearBox,
  Model,
  SoldStatus,
} from '@root/domain/enterprise/entities/advertisement.entity';
import { FavoriteEntity } from '@root/domain/enterprise/entities/favorite.entity';
import { FavoriteAdminDetails } from '@root/domain/enterprise/value-object/favorite-admin-details';
import { FavoriteDetails } from '@root/domain/enterprise/value-object/favorite-details';

import { InMemoryAdvertisementRepository } from './in-memory-advertisement-repository';
import { InMemoryImageRepository } from './in-memory-image-repository';
import { InMemoryUserRepository } from './in-memory-user-repository';

export class InMemoryFavoriteRepository implements FavoriteRepository {
  constructor(
    private readonly advertisementRespository: InMemoryAdvertisementRepository,
    private readonly userRepository: InMemoryUserRepository,
    private readonly imageRepository: InMemoryImageRepository,
  ) {}

  public favorites: FavoriteEntity[] = [];

  async create({ favorite }: CreateProps): AsyncMaybe<FavoriteEntity> {
    this.favorites.push(favorite);

    return Maybe.some(favorite);
  }

  async findAll({ limit, page }: FindAllProps): AsyncMaybe<PaginatedResult<FavoriteAdminDetails[]>> {
    const distinctFavorites = Array.from(new Map(this.favorites.map((fav) => [fav.advertisementId, fav])).values());

    const paginatedFavorites = distinctFavorites.slice((page - 1) * limit, limit * page);

    const mappedFavorites = paginatedFavorites
      .map((fav) => {
        const advertisement = this.advertisementRespository.advertisements.find((ad) => ad.id === fav.advertisementId);

        if (!advertisement) {
          return null;
        }

        const adThumbnail = this.imageRepository.images.find((image) => image.blurHash);

        if (!adThumbnail) return null;

        const user = this.userRepository.users.find((u) => u.id === fav.userId);

        if (!user) {
          return null;
        }

        const favoritesCount = this.favorites.filter((f) => f.advertisementId === advertisement.id).length;

        return FavoriteAdminDetails.create({
          advertisement: {
            id: advertisement.id,
            price: advertisement.price,
            thumbnailUrl: advertisement.thumbnailUrl,
            blurHash: adThumbnail.blurHash,
            title: advertisement.title,
            status: SoldStatus[advertisement.soldStatus],
          },
          user: {
            avatar: user.avatar,
            id: user.id,
            name: user.name,
          },
          id: fav.id,
          favoritesCount,
          createdAt: fav.createdAt,
        });
      })
      .filter(Boolean);

    return Maybe.some({
      data: mappedFavorites,
      meta: {
        page,
        perPage: limit,
        totalPages: Math.ceil(distinctFavorites.length / limit),
        totalCount: distinctFavorites.length,
      },
    });
  }

  async findAllByUserId({ limit, page, userId }: FindAllByUserIdProps): AsyncMaybe<PaginatedResult<FavoriteDetails[]>> {
    const favorites = await this.favorites.filter((fav) => fav.userId.toValue() === userId.toValue());

    const mappedFavorites = favorites.map((fav) => {
      const advertisement = this.advertisementRespository.advertisements.find(
        (ad) => ad.id.toValue() === fav.advertisementId.toValue(),
      );

      const adThumbnail = this.imageRepository.images.find((image) => image.blurHash);

      if (!adThumbnail) return null;

      return FavoriteDetails.create({
        advertisement: {
          capacity: Capacity[advertisement.capacity],
          doors: Doors[advertisement.doors],
          fuel: Fuel[advertisement.fuel],
          gearBox: GearBox[advertisement.gearBox],
          id: advertisement.id,
          km: advertisement.km,
          price: advertisement.price,
          thumbnailUrl: advertisement.thumbnailUrl,
          blurHash: adThumbnail.blurHash,
          title: advertisement.title,
          soldStatus: SoldStatus[advertisement.soldStatus],
          model: Model[advertisement.model],
        },
        id: fav.id,
      });
    });

    const paginatedFavorites = mappedFavorites.slice((page - 1) * limit, limit * page);

    return Maybe.some({
      data: paginatedFavorites,
      meta: {
        page,
        perPage: limit,
        totalPages: Math.ceil(mappedFavorites.length / limit),
        totalCount: mappedFavorites.length,
      },
    });
  }

  async findByUserId({ advertisementId, userId }: FindByUserIdProps): AsyncMaybe<FavoriteEntity> {
    const favorite = this.favorites.find(
      (fav) => fav.advertisementId.toValue() === advertisementId.toValue() && fav.userId.toValue() === userId.toValue(),
    );

    if (!favorite) return Maybe.none();

    return Maybe.some(favorite);
  }

  async findDistinctCount(): AsyncMaybe<number> {
    const distinctFavoritesCount = Array.from(
      new Map(this.favorites.map((fav) => [fav.advertisementId, fav])).values(),
    ).length;

    return Maybe.some(distinctFavoritesCount);
  }

  async findAdvertisementIsFavorited({
    advertisementId,
    userId,
  }: FindAdvertisementIsFavoritedProps): AsyncMaybe<boolean> {
    const favorite = this.favorites.find(
      (fav) => fav.advertisementId.toValue() === advertisementId.toValue() && fav.userId.toValue() === userId.toValue(),
    );

    if (!favorite) return Maybe.none();

    return Maybe.some(true);
  }

  async findTotalCount(): AsyncMaybe<number> {
    return Maybe.some(this.favorites.length);
  }

  async findTotalCountByAdvertisement({ advertisementId }: FindTotalCountByAdvertisementProps): AsyncMaybe<number> {
    return Maybe.some(this.favorites.filter((fav) => fav.advertisementId.equals(advertisementId)).length);
  }

  async delete({ userId, favoriteId }: DeleteProps): AsyncMaybe<void> {
    const favorites = await this.favorites.filter(
      (fav) => fav.id.toValue() !== favoriteId.toValue() && fav.userId.toValue() === userId.toValue(),
    );

    this.favorites = favorites;

    return;
  }
}
