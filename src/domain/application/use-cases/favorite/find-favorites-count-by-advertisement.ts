import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';

import { AdvertisementRepository } from '../../repositories/advertisement.repository';
import { FavoriteRepository } from '../../repositories/favorite.repository';

type Input = {
  advertisementId: UniqueEntityId;
};

type Output = Either<ResourceNotFoundError, number>;

@Injectable()
export class FindFavoritesCountByAdvertisementUseCase {
  constructor(
    private readonly favoriteRepository: FavoriteRepository,
    private readonly advertisementRepository: AdvertisementRepository,
  ) {}

  async execute({ advertisementId }: Input): Promise<Output> {
    const { isNone: advertisementNotFound } = await this.advertisementRepository.findAdById({
      id: advertisementId,
    });

    if (advertisementNotFound()) return left(new ResourceNotFoundError());

    const { value: favorites } = await this.favoriteRepository.findTotalCountByAdvertisement({ advertisementId });

    return right(favorites);
  }
}
