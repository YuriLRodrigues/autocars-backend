import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';
import { LikeEntity } from '@root/domain/enterprise/entities/like.entity';

import { FeedbackRepository } from '../../repositories/feedback.repository';
import { LikeFeedbackRepository } from '../../repositories/like-feedback.reposiotry';
import { UserRepository } from '../../repositories/user.repository';

type Input = {
  userId: UniqueEntityId;
  feedbackId: UniqueEntityId;
};

type Output = Either<ResourceNotFoundError, LikeEntity | null>;

@Injectable()
export class HandleFeedbackLikeUseCase {
  constructor(
    private readonly likeFeedbackRepository: LikeFeedbackRepository,
    private readonly userRepository: UserRepository,
    private readonly feedbackRepository: FeedbackRepository,
  ) {}

  async execute({ feedbackId, userId }: Input): Promise<Output> {
    const { isNone: feedbackNotExists } = await this.feedbackRepository.findById({ feedbackId });

    if (feedbackNotExists()) {
      return left(new ResourceNotFoundError());
    }

    const { isNone: userNotFound } = await this.userRepository.findById({ id: userId });

    if (userNotFound()) {
      return left(new ResourceNotFoundError());
    }

    const { isSome: alreadyLiked, value: like } = await this.likeFeedbackRepository.findById({
      feedbackId,
      userId,
    });

    if (alreadyLiked()) {
      await this.likeFeedbackRepository.delete({ likeId: like.id });

      return right(null);
    }

    const likeEntity = LikeEntity.create({
      userId,
      feedbackId,
    });

    await this.likeFeedbackRepository.create({ like: likeEntity });

    return right(likeEntity);
  }
}
