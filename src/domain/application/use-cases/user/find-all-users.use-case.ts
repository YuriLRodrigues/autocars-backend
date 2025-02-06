import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { Either, left, right } from '@root/core/logic/Either';
import { UserEntity, UserRoles } from '@root/domain/enterprise/entities/user.entity';

import { UserRepository } from '../../repositories/user.repository';

type Input = {
  limit?: number;
  page: number;
  createdAt?: 'asc' | 'desc';
  name?: 'asc' | 'desc';
  role?: UserRoles;
  status?: 'ACTIVE' | 'INACTIVE';
  title?: string;
  id?: UniqueEntityId;
};

type Output = Either<NotAllowedError, PaginatedResult<UserEntity[]>>;

@Injectable()
export class FindAllUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ limit, page, id, createdAt, name, role, status, title }: Input): Promise<Output> {
    const { value: user } = await this.userRepository.findById({ id });

    if (!user.roles.includes(UserRoles.Manager)) left(new NotAllowedError());

    const { value: users } = await this.userRepository.findAllUsers({
      limit,
      page,
      createdAt,
      name,
      role,
      status,
      title,
    });

    return right(users);
  }
}
