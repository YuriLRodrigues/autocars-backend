import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';

import { AdvertisementRepository } from '../../repositories/advertisement.repository';
import { UserRepository } from '../../repositories/user.repository';

type Output = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    activesAdvertisements: number;
    reservedAdvertisements: number;
    soldAdvertisements: number;
    totalSellers: number;
    totalManagers: number;
    totalAdvertisements: number;
  }
>;

type Input = {
  userId: UniqueEntityId;
};

@Injectable()
export class FindMetricsUseCase {
  constructor(
    private readonly advertisementRepository: AdvertisementRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ userId }: Input): Promise<Output> {
    const { isNone: userNotFound, value: user } = await this.userRepository.findById({ id: userId });

    if (userNotFound()) return left(new ResourceNotFoundError());

    if (!user.roles.includes(UserRoles.Manager)) return left(new NotAllowedError());

    const { value: metrics } = await this.advertisementRepository.findMetrics();

    return right(metrics);
  }
}
