import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ImageEntity } from '@root/domain/enterprise/entities/image.entity';

type Overwrides = Partial<ImageEntity>;

export const makeFakeImage = (data = {} as Overwrides) => {
  const id = new UniqueEntityId();
  const userId = new UniqueEntityId();
  const url = faker.internet.url();
  const blurHash = faker.string.alphanumeric();
  const createdAt = faker.date.past();
  const updatedAt = faker.date.recent();

  return ImageEntity.create(
    {
      url: data.url || url,
      blurHash: data.blurHash || blurHash,
      advertisementId: data.advertisementId ?? null,
      userId: data.userId || userId,
      isThumbnail: data.isThumbnail ?? false,
      isAvatar: data.isAvatar ?? false,
      createdAt: data.createdAt || createdAt,
      updatedAt: data.updatedAt || updatedAt,
    },
    data.id || id,
  );
};
