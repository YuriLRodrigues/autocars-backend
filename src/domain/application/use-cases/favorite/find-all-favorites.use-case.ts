import { Injectable } from '@nestjs/common';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { Either, right } from '@root/core/logic/Either';
import { FavoriteAdminDetails } from '@root/domain/enterprise/value-object/favorite-admin-details';

import { FavoriteRepository } from '../../repositories/favorite.repository';

type Input = {
  page: number;
  limit: number;
};

type Output = Either<Error, PaginatedResult<FavoriteAdminDetails[]>>;

@Injectable()
export class FindAllFavoritesUseCase {
  constructor(private readonly favoriteRepository: FavoriteRepository) {}

  async execute({ page, limit }: Input): Promise<Output> {
    const { value: favorites } = await this.favoriteRepository.findAll({
      page,
      limit,
    });

    return right(favorites);
  }
}
