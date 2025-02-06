import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceAlreadyExistsError } from '@root/core/errors/resource-already-exists-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';

import { Encrypter } from '../../cryptography/encrypter';
import { UserRepository } from '../../repositories/user.repository';

type Output = Either<ResourceNotFoundError | ResourceAlreadyExistsError | NotAllowedError, string>;

type Input = {
  id: UniqueEntityId;
  username?: string;
  avatar?: string;
  email?: string;
  name?: string;
  role?: UserRoles;
};

@Injectable()
export class UpdateOwnUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encrypter: Encrypter,
  ) {}

  async execute({ username, avatar, email, name, id, role }: Input): Promise<Output> {
    const { value: user, isNone: userNotFound } = await this.userRepository.findById({ id });

    if (userNotFound()) {
      return left(new ResourceNotFoundError());
    }

    if (username) {
      const { isSome: usernameAlreadyExists } = await this.userRepository.findByUsername({ username });

      if (usernameAlreadyExists() && username !== user.username) return left(new ResourceAlreadyExistsError());
    }

    if (email) {
      const { isSome: emailAlreadyExists } = await this.userRepository.findByEmail({ email });

      if (emailAlreadyExists() && email !== user.email) return left(new ResourceAlreadyExistsError());
    }

    if (role === UserRoles.Manager) return left(new NotAllowedError());

    if (role && !user.roles.includes(role)) {
      user.roles = [role];
    }

    user.editInfo({
      avatar,
      name,
      username,
      email,
    });

    await this.userRepository.save({ user: user });

    const newToken = await this.encrypter.encrypt({
      sub: user.id.toValue(),
      roles: user.roles,
      avatar: user.avatar,
      name: user.name,
      username: user.username,
      email: user.email,
    });

    return right(newToken);
  }
}
