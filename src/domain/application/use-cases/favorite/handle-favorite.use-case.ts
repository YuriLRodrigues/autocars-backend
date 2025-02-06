import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';
import { FavoriteEntity } from '@root/domain/enterprise/entities/favorite.entity';

import { AdvertisementRepository } from '../../repositories/advertisement.repository';
import { FavoriteRepository } from '../../repositories/favorite.repository';
import { UserRepository } from '../../repositories/user.repository';

type Input = {
  advertisementId: UniqueEntityId;
  userId: UniqueEntityId;
};

type Output = Either<ResourceNotFoundError, FavoriteEntity | boolean>;

@Injectable()
export class HandleFavoriteUseCase {
  constructor(
    private readonly favoriteRepository: FavoriteRepository,
    private readonly advertisementRepository: AdvertisementRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ advertisementId, userId }: Input): Promise<Output> {
    const { isNone: userNotFound } = await this.userRepository.findById({ id: userId });

    if (userNotFound()) return left(new ResourceNotFoundError());

    const { isNone: advertisementNotFound } = await this.advertisementRepository.findAdById({ id: advertisementId });

    if (advertisementNotFound()) return left(new ResourceNotFoundError());

    const { isSome: alreadyFavorited, value: favorite } = await this.favoriteRepository.findByUserId({
      advertisementId,
      userId,
    });

    if (alreadyFavorited()) {
      await this.favoriteRepository.delete({ favoriteId: favorite.id, userId: favorite.userId });

      return right(false);
    }

    const favoriteEntity = FavoriteEntity.create({
      advertisementId,
      userId,
    });

    await this.favoriteRepository.create({ favorite: favoriteEntity });

    return right(true);
  }
}
