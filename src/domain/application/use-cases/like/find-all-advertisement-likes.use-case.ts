import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';

import { AdvertisementRepository } from '../../repositories/advertisement.repository';
import { LikeAdvertisementRepository } from '../../repositories/like-advertisement.reposiotry';

type Input = {
  advertisementId: UniqueEntityId;
};

type Output = Either<ResourceNotFoundError, number>;

@Injectable()
export class FindAllAdvertisementLikesUseCase {
  constructor(
    private readonly likeAdvertisementRepository: LikeAdvertisementRepository,
    private readonly advertisementRepository: AdvertisementRepository,
  ) {}

  async execute({ advertisementId }: Input): Promise<Output> {
    const { isNone: advertisementNotExists } = await this.advertisementRepository.findAdById({ id: advertisementId });

    if (advertisementNotExists()) {
      return left(new ResourceNotFoundError());
    }

    const { value: allLikes } = await this.likeAdvertisementRepository.countLikes({ advertisementId });

    return right(allLikes);
  }
}
