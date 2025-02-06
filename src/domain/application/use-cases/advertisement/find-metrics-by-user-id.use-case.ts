import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';

import { AdvertisementRepository } from '../../repositories/advertisement.repository';
import { UserRepository } from '../../repositories/user.repository';

type Output = Either<
  ResourceNotFoundError,
  {
    activesAdvertisements: number;
    reservedAdvertisements: number;
    soldAdvertisements: number;
    totalAdvertisements: number;
  }
>;

type Input = {
  userId: UniqueEntityId;
};

@Injectable()
export class FindMetricsByUserIdUseCase {
  constructor(
    private readonly advertisementRepository: AdvertisementRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ userId }: Input): Promise<Output> {
    const { isNone: userNotFound } = await this.userRepository.findById({ id: userId });

    if (userNotFound()) return left(new ResourceNotFoundError());

    const { value: metrics } = await this.advertisementRepository.findMetricsByUserId({
      userId,
    });

    return right(metrics);
  }
}
