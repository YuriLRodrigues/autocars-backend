import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { FavoriteEntity } from '@root/domain/enterprise/entities/favorite.entity';

type Overwrides = Partial<FavoriteEntity>;

export const makeFakeFavorite = (data = {} as Overwrides) => {
  const userId = new UniqueEntityId();
  const advertisementId = new UniqueEntityId();
  const createdAt = new Date();
  const updatedAt = new Date();

  return FavoriteEntity.create({
    advertisementId: data.advertisementId || advertisementId,
    userId: data.userId || userId,
    createdAt: data.createdAt || createdAt,
    updatedAt: data.updatedAt || updatedAt,
  });
};
