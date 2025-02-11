import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';

import { AdvertisementRepository } from '../../repositories/advertisement.repository';
import { UserRepository } from '../../repositories/user.repository';

type Output = Either<ResourceNotFoundError | NotAllowedError, { salePrice?: number; price: number; updatedAt: Date }[]>;

type Input = {
  referenceDate: number;
  userId: UniqueEntityId;
  isManager: boolean;
};

@Injectable()
export class FindAllSoldsAdsUseCase {
  constructor(
    private readonly advertisementRepository: AdvertisementRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ referenceDate, userId, isManager }: Input): Promise<Output> {
    const { isNone: userNotFound, value: user } = await this.userRepository.findById({ id: userId });

    if (userNotFound()) return left(new ResourceNotFoundError());

    const userHasValidRole = user.roles.some((role) => role === UserRoles.Seller || role === UserRoles.Manager);
    const isManagerCheckFailed = Boolean(isManager) && !user.roles.includes(UserRoles.Manager);

    if (!userHasValidRole || isManagerCheckFailed) return left(new NotAllowedError());

    const { value: advertisements } = await this.advertisementRepository.findAllSoldAds({
      referenceDate,
      userId,
      isManager,
    });

    return right(advertisements);
  }
}
