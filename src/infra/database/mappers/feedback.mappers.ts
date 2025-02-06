import { Feedback, Prisma } from '@prisma/client';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { FeedbackEntity } from '@root/domain/enterprise/entities/feedback.entity';

export class FeedbackMappers {
  static toDomain(data: Feedback): FeedbackEntity {
    return FeedbackEntity.create(
      {
        advertisementId: new UniqueEntityId(data.advertisementId),
        comment: data.comment,
        stars: data.stars,
        title: data.title,
        userId: new UniqueEntityId(data.userId),
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      },
      new UniqueEntityId(data.id),
    );
  }

  static toPersistence(data: FeedbackEntity): Prisma.FeedbackCreateInput {
    return {
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
      id: data.id.toValue(),
      title: data.title,
      comment: data.comment,
      stars: data.stars,
      updatedAt: data.updatedAt,
      createdAt: data.createdAt,
    };
  }
}
