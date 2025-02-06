import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';

import { FeedbackRepository } from '../../repositories/feedback.repository';
import { UserRepository } from '../../repositories/user.repository';

type Input = {
  userId: UniqueEntityId;
  feedbackId: UniqueEntityId;
};

type Output = Either<ResourceNotFoundError | NotAllowedError, void>;

@Injectable()
export class DeleteFeedbackUseCase {
  constructor(
    private readonly feedbackRepository: FeedbackRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ feedbackId, userId }: Input): Promise<Output> {
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

    if (isOwnerFeedback || isAdmin) {
      await this.feedbackRepository.delete({ feedbackId });

      return right(null);
    }

    return left(new NotAllowedError());
  }
}
