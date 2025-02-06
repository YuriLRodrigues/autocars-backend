import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';
import { FeedbackEntity } from '@root/domain/enterprise/entities/feedback.entity';

import { AdvertisementRepository } from '../../repositories/advertisement.repository';
import { FeedbackRepository } from '../../repositories/feedback.repository';
import { UserRepository } from '../../repositories/user.repository';

type Input = {
  advertisementId: UniqueEntityId;
  userId: UniqueEntityId;
  comment: string;
  title: string;
  stars: number;
};

type Output = Either<ResourceNotFoundError, FeedbackEntity>;

@Injectable()
export class CreateFeedbackUseCase {
  constructor(
    private readonly feedbackRepository: FeedbackRepository,
    private readonly advertisementRepository: AdvertisementRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ advertisementId, userId, comment, title, stars }: Input): Promise<Output> {
    const { isNone: userNotExists } = await this.userRepository.findById({
      id: userId,
    });

    if (userNotExists()) {
      return left(new ResourceNotFoundError());
    }

    const { isNone: advertisementNotExists } = await this.advertisementRepository.findAdById({
      id: advertisementId,
    });

    if (advertisementNotExists()) {
      return left(new ResourceNotFoundError());
    }

    const feedback = FeedbackEntity.create({
      userId,
      advertisementId,
      comment,
      stars,
      title,
    });

    await this.feedbackRepository.create({
      feedback,
    });

    return right(feedback);
  }
}
