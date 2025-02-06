import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';

import { AdvertisementRepository } from '../../repositories/advertisement.repository';
import { UserRepository } from '../../repositories/user.repository';

type Input = {
  advertisementId: UniqueEntityId;
  userId: UniqueEntityId;
};

type Output = Either<NotAllowedError | ResourceNotFoundError, void>;

@Injectable()
export class DeleteAdUseCase {
  constructor(
    private readonly advertisementRepository: AdvertisementRepository,
    private readonly userRespository: UserRepository,
  ) {}

  async execute({ advertisementId, userId }: Input): Promise<Output> {
    const { isNone: userNotFound, value: user } = await this.userRespository.findById({ id: userId });

    if (userNotFound()) {
      return left(new ResourceNotFoundError());
    }

    const { isNone: adNotExists, value: advertisement } = await this.advertisementRepository.findAdById({
      id: advertisementId,
    });

    if (adNotExists()) {
      return left(new ResourceNotFoundError());
    }

    if (user.id !== advertisement.userId && !user.roles.includes(UserRoles.Manager)) {
      return left(new NotAllowedError());
    }

    await this.advertisementRepository.deleteAd({ advertisementId });

    return right(null);
  }
}
