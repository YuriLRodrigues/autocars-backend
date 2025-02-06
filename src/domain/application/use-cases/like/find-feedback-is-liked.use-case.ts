import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';

import { FeedbackRepository } from '../../repositories/feedback.repository';
import { LikeFeedbackRepository } from '../../repositories/like-feedback.reposiotry';
import { UserRepository } from '../../repositories/user.repository';

type Input = {
  feedbackId: UniqueEntityId;
  userId?: UniqueEntityId;
};

type Output = Either<ResourceNotFoundError, boolean>;

@Injectable()
export class FindFeedbackIsLikedUseCase {
  constructor(
    private readonly likeFeedbackRepository: LikeFeedbackRepository,
    private readonly userRepository: UserRepository,
    private readonly feedbackRepository: FeedbackRepository,
  ) {}

  async execute({ feedbackId, userId }: Input): Promise<Output> {
    if (!userId) return right(false);

    const { isNone: userNotFound } = await this.userRepository.findById({ id: userId });

    if (userNotFound()) {
      return left(new ResourceNotFoundError());
    }

    const { isNone: feedbackNotFound } = await this.feedbackRepository.findById({ feedbackId });

    if (feedbackNotFound()) {
      return left(new ResourceNotFoundError());
    }

    const { isSome: alreadyLiked } = await this.likeFeedbackRepository.findById({ feedbackId, userId });

    if (alreadyLiked()) {
      return right(true);
    }

    return right(false);
  }
}
