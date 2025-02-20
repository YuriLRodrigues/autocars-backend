import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';

import { AdvertisementRepository } from '../../repositories/advertisement.repository';
import { UserRepository } from '../../repositories/user.repository';

type Input = {
  id: UniqueEntityId;
  userId: UniqueEntityId;

  salePrice: number;
};

type Output = Either<ResourceNotFoundError | NotAllowedError, null>;

@Injectable()
export class UpdateSalePriceUseCase {
  constructor(
    private readonly advertisementRepository: AdvertisementRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ id, userId, salePrice }: Input): Promise<Output> {
    const { isNone: userNotExists, value: user } = await this.userRepository.findById({
      id: userId,
    });

    if (userNotExists()) return left(new ResourceNotFoundError());

    const { isNone: adNotFound, value: advertisement } = await this.advertisementRepository.findAdById({
      id,
    });

    if (adNotFound()) return left(new ResourceNotFoundError());

    if (
      (user.roles.includes(UserRoles.Seller) && advertisement.userId !== user.id) ||
      (!user.roles.includes(UserRoles.Manager) && advertisement.userId !== user.id)
    ) {
      return left(new NotAllowedError());
    }

    advertisement.editInfo({
      salePrice,
    });

    await this.advertisementRepository.saveAd({ advertisement });

    return right(null);
  }
}
