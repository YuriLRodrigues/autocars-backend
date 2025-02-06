import { Image, Prisma } from '@prisma/client';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ImageEntity } from '@root/domain/enterprise/entities/image.entity';

export class ImageMappers {
  static toDomain(data: Image): ImageEntity {
    return ImageEntity.create(
      {
        url: data.url,
        blurHash: data.blurHash,
        isThumbnail: data.isThumbnail,
        isAvatar: data.isAvatar,
        userId: new UniqueEntityId(data.userId),
        advertisementId: data.advertisementId ? new UniqueEntityId(data.advertisementId) : null,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      new UniqueEntityId(data.id),
    );
  }

  static toPersistence(data: ImageEntity): Prisma.ImageCreateInput {
    return {
      url: data.url,
      blurHash: data.blurHash,
      isThumbnail: data.isThumbnail,
      isAvatar: data.isAvatar,
      id: data.id.toValue(),
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
