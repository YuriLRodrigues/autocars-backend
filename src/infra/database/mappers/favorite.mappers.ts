import { Favorite, Prisma } from '@prisma/client';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { FavoriteEntity } from '@root/domain/enterprise/entities/favorite.entity';

export class FavoriteMappers {
  static toDomain(data: Favorite): FavoriteEntity {
    return FavoriteEntity.create(
      {
        advertisementId: new UniqueEntityId(data.advertisementId),
        userId: new UniqueEntityId(data.userId),
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      new UniqueEntityId(data.id),
    );
  }

  static toPersistence(data: FavoriteEntity): Prisma.FavoriteCreateInput {
    return {
      id: data.id.toValue(),
      advertisement: {
        connect: {
          id: data.advertisementId.toValue(),
        },
      },
      user: {
        connect: {
          id: data.userId.toValue(),
        },
      },
      updatedAt: data.updatedAt,
      createdAt: data.createdAt,
    };
  }
}
