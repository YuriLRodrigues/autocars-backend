import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';

import { UserRepository } from '../../repositories/user.repository';

type Output = Either<ResourceNotFoundError, void>;

type Input = {
  id: UniqueEntityId;
};

@Injectable()
export class DeleteOwnUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ id }: Input): Promise<Output> {
    const { isNone: userNotFound, value: userExists } = await this.userRepository.findById({ id });

    if (userNotFound()) {
      return left(new ResourceNotFoundError());
    }

    await this.userRepository.delete({ userId: userExists.id });

    return right(null);
  }
}
