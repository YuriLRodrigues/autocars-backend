import { Like, Prisma } from '@prisma/client';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { LikeEntity } from '@root/domain/enterprise/entities/like.entity';

export class LikeFeedbackMappers {
  static toDomain(data: Like): LikeEntity {
    return LikeEntity.create(
      {
        userId: new UniqueEntityId(data.userId),
        advertisementId: new UniqueEntityId(data.advertisementId),
        feedbackId: new UniqueEntityId(data.feedbackId),
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      new UniqueEntityId(data.id),
    );
  }

  static toPersistence(data: LikeEntity): Prisma.LikeCreateInput {
    return {
      user: {
        connect: {
          id: data.userId.toValue(),
        },
      },
      advertisement: {
        connect: {
          id: data.advertisementId.toValue(),
        },
      },
      feedback: {
        connect: {
          id: data.feedbackId.toValue(),
        },
      },
      id: data.id.toValue(),
      updatedAt: data.updatedAt,
      createdAt: data.createdAt,
    };
  }
}
