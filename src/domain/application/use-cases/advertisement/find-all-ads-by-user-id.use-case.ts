import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';
import { UserAdvertisements } from '@root/domain/enterprise/value-object/user-advertisements';

import { AdvertisementRepository } from '../../repositories/advertisement.repository';
import { UserRepository } from '../../repositories/user.repository';

type Output = Either<ResourceNotFoundError, PaginatedResult<UserAdvertisements[]>>;

type Input = {
  userId: UniqueEntityId;
  page: number;
  limit: number;
};

@Injectable()
export class FindAllAdsByUserIdUseCase {
  constructor(
    private readonly advertisementRepository: AdvertisementRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ userId, limit, page }: Input): Promise<Output> {
    const { isNone, value: user } = await this.userRepository.findById({ id: userId });

    if (isNone()) {
      return left(new ResourceNotFoundError());
    }

    const { value: advertisements } = await this.advertisementRepository.findAllAdsByUserId({
      userId: user.id,
      limit,
      page,
    });

    return right(advertisements);
  }
}
