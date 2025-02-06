import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';

import { FeedbackRepository } from '../../repositories/feedback.repository';
import { UserRepository } from '../../repositories/user.repository';

type Input = {
  comment?: string;
  stars?: number;
  feedbackId: UniqueEntityId;
  userId: UniqueEntityId;
};

type Output = Either<ResourceNotFoundError | NotAllowedError, void>;

@Injectable()
export class UpdateFeedbackUseCase {
  constructor(
    private readonly feedbackRepository: FeedbackRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ feedbackId, userId, comment, stars }: Input): Promise<Output> {
    const { isNone: userNotExists, value: user } = await this.userRepository.findById({ id: userId });

    if (userNotExists()) {
      return left(new ResourceNotFoundError());
    }

    const { isNone: feedbackNotExists, value: feedback } = await this.feedbackRepository.findById({ feedbackId });

    if (feedbackNotExists()) {
      return left(new ResourceNotFoundError());
    }
    const isOwnerFeedback = feedback.userId.equals(user.id);

    const isAdmin = user.roles.includes(UserRoles.Manager);

    if (!isOwnerFeedback || (!isAdmin && !isOwnerFeedback)) {
      return left(new NotAllowedError());
    }

    feedback.editInfo({
      comment,
      stars,
    });

    await this.feedbackRepository.save({ feedback });

    return right(null);
  }
}
