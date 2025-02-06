import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { LikeEntity, LikeEntityProps } from '@root/domain/enterprise/entities/like.entity';

type Overwrides = Partial<LikeEntityProps>;

export const makeFakeLike = (data = {} as Overwrides) => {
  const userId = new UniqueEntityId();
  const advertisementId = new UniqueEntityId();
  const createdAt = faker.date.past();
  const feedbackId = new UniqueEntityId();
  const updatedAt = faker.date.recent();

  return LikeEntity.create({
    userId: data.userId || userId,
    advertisementId: data.advertisementId || advertisementId,
    createdAt: data.createdAt || createdAt,
    feedbackId: data.feedbackId || feedbackId,
    updatedAt: data.updatedAt || updatedAt,
  });
};
