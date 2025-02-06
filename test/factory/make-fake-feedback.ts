import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { FeedbackEntity, FeedbackEntityProps } from '@root/domain/enterprise/entities/feedback.entity';

type Overwrides = Partial<FeedbackEntityProps>;

export const makeFakeFeedback = (data = {} as Overwrides, id?: UniqueEntityId) => {
  const advertisementId = new UniqueEntityId();
  const comment = faker.lorem.text();
  const stars = faker.number.int({ max: 5, min: 0 });
  const userId = new UniqueEntityId();
  const title = faker.lorem.words();
  const createdAt = new Date();
  const updatedAt = new Date();

  return FeedbackEntity.create(
    {
      advertisementId: data.advertisementId || advertisementId,
      comment: data.comment || comment,
      title: data.title || title,
      stars: data.stars || stars,
      userId: data.userId || userId,
      createdAt: data.createdAt || createdAt,
      updatedAt: data.updatedAt || updatedAt,
    },
    id,
  );
};
