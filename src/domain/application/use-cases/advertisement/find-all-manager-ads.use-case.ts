import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { ManagerAdvertisements } from '@root/domain/enterprise/value-object/manager-advertisements';

import { AdvertisementRepository, SearchAdsProps } from '../../repositories/advertisement.repository';
import { UserRepository } from '../../repositories/user.repository';

type Output = Either<ResourceNotFoundError | NotAllowedError, PaginatedResult<ManagerAdvertisements[]>>;

type Input = {
  userId: UniqueEntityId;
  page: number;
  limit: number;
  search?: SearchAdsProps;
};

@Injectable()
export class FindAllManagerAdsUseCase {
  constructor(
    private readonly advertisementRepository: AdvertisementRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ userId, limit, page, search }: Input): Promise<Output> {
    const { isNone, value: user } = await this.userRepository.findById({ id: userId });

    if (isNone()) {
      return left(new ResourceNotFoundError());
    }

    if (!user.roles.includes(UserRoles.Manager)) {
      return left(new NotAllowedError());
    }

    const { value: advertisements } = await this.advertisementRepository.findAllManagerAds({
      limit,
      page,
      search,
    });

    return right(advertisements);
  }
}
