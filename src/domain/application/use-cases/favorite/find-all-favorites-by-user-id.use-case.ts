import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';
import { FavoriteDetails } from '@root/domain/enterprise/value-object/favorite-details';

import { FavoriteRepository } from '../../repositories/favorite.repository';
import { UserRepository } from '../../repositories/user.repository';

type Input = {
  userId: UniqueEntityId;
  page: number;
  limit: number;
};

type Output = Either<Error, PaginatedResult<FavoriteDetails[]>>;

@Injectable()
export class FindAllFavoritesByUserIdUseCase {
  constructor(
    private readonly favoriteRepository: FavoriteRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ userId, page, limit }: Input): Promise<Output> {
    const { isNone: userNotFound } = await this.userRepository.findById({ id: userId });

    if (userNotFound()) return left(new ResourceNotFoundError());

    const { value: favorites } = await this.favoriteRepository.findAllByUserId({
      userId,
      page,
      limit,
    });

    return right(favorites);
  }
}
