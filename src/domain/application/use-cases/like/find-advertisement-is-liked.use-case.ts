import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';

import { AdvertisementRepository } from '../../repositories/advertisement.repository';
import { LikeAdvertisementRepository } from '../../repositories/like-advertisement.reposiotry';
import { UserRepository } from '../../repositories/user.repository';

type Input = {
  advertisementId: UniqueEntityId;
  userId?: UniqueEntityId;
};

type Output = Either<ResourceNotFoundError, boolean>;

@Injectable()
export class FindAdvertisementIsLikedUseCase {
  constructor(
    private readonly likeAdvertisementRepository: LikeAdvertisementRepository,
    private readonly userRepository: UserRepository,
    private readonly advertisementRepository: AdvertisementRepository,
  ) {}

  async execute({ advertisementId, userId }: Input): Promise<Output> {
    if (!userId) return right(false);

    const { isNone: userNotFound } = await this.userRepository.findById({ id: userId });

    if (userNotFound()) {
      return left(new ResourceNotFoundError());
    }

    const { isNone: advertisementNotFound } = await this.advertisementRepository.findAdById({ id: advertisementId });

    if (advertisementNotFound()) {
      return left(new ResourceNotFoundError());
    }

    const { isSome: alreadyLiked } = await this.likeAdvertisementRepository.findById({ advertisementId, userId });

    if (alreadyLiked()) {
      return right(true);
    }

    return right(false);
  }
}
