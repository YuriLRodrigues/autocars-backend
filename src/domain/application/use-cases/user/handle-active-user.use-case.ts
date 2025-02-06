import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';

import { UserRepository } from '../../repositories/user.repository';

type Output = Either<NotAllowedError | ResourceNotFoundError, void>;

type Input = {
  currentUserId: UniqueEntityId;
  sellerId: UniqueEntityId;
};

@Injectable()
export class HandleActiveUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ currentUserId, sellerId }: Input): Promise<Output> {
    const {
      value: { roles: userRoles },
    } = await this.userRepository.findById({
      id: currentUserId,
    });

    if (!userRoles.includes(UserRoles.Manager)) {
      return left(new NotAllowedError());
    }

    const { value: user, isNone: userNotFound } = await this.userRepository.findById({
      id: sellerId,
    });

    if (userNotFound()) {
      return left(new ResourceNotFoundError());
    }

    const userIsDisabled = user.disabled;
    user.disabled = userIsDisabled ? null : new Date();

    await this.userRepository.save({ user });

    return right(null);
  }
}
