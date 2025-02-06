import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';

import { FeedbackRepository } from '../../repositories/feedback.repository';
import { LikeFeedbackRepository } from '../../repositories/like-feedback.reposiotry';

type Input = {
  feedbackId: UniqueEntityId;
};

type Output = Either<ResourceNotFoundError, number>;

@Injectable()
export class FindAllFeedbackLikesUseCase {
  constructor(
    private readonly likeFeedbackRepository: LikeFeedbackRepository,
    private readonly feedbackRepository: FeedbackRepository,
  ) {}

  async execute({ feedbackId }: Input): Promise<Output> {
    const { isNone: feedbackNotExists } = await this.feedbackRepository.findById({ feedbackId });

    if (feedbackNotExists()) {
      return left(new ResourceNotFoundError());
    }

    const { value: allLikes } = await this.likeFeedbackRepository.findAllLikes({ feedbackId });

    return right(allLikes);
  }
}
