import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';
import { LikeEntity } from '@root/domain/enterprise/entities/like.entity';

import { AdvertisementRepository } from '../../repositories/advertisement.repository';
import { LikeAdvertisementRepository } from '../../repositories/like-advertisement.reposiotry';
import { UserRepository } from '../../repositories/user.repository';

type Input = {
  userId: UniqueEntityId;
  advertisementId: UniqueEntityId;
};

type Output = Either<ResourceNotFoundError, LikeEntity | null>;

@Injectable()
export class HandleAdvertisementLikeUseCase {
  constructor(
    private readonly likeAdvertisementRepository: LikeAdvertisementRepository,
    private readonly userRepository: UserRepository,
    private readonly advertisementRepository: AdvertisementRepository,
  ) {}

  async execute({ advertisementId, userId }: Input): Promise<Output> {
    const { isNone: advertisementNotExists } = await this.advertisementRepository.findAdById({
      id: advertisementId,
    });

    if (advertisementNotExists()) {
      return left(new ResourceNotFoundError());
    }

    const { isNone: userNotFound } = await this.userRepository.findById({ id: userId });

    if (userNotFound()) {
      return left(new ResourceNotFoundError());
    }

    const { isSome: alreadyLiked, value: like } = await this.likeAdvertisementRepository.findById({
      advertisementId,
      userId,
    });

    if (alreadyLiked()) {
      await this.likeAdvertisementRepository.delete({ likeId: like.id });

      return right(null);
    }

    const likeEntity = LikeEntity.create({
      userId,
      advertisementId,
    });

    await this.likeAdvertisementRepository.create({ like: likeEntity });

    return right(likeEntity);
  }
}
