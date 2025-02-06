import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';
import { OwnAdvertisements } from '@root/domain/enterprise/value-object/own-advertisements';

import { AdvertisementRepository, SearchAdsProps } from '../../repositories/advertisement.repository';
import { UserRepository } from '../../repositories/user.repository';

type Output = Either<ResourceNotFoundError, PaginatedResult<OwnAdvertisements[]>>;

type Input = {
  userId: UniqueEntityId;
  page: number;
  limit: number;
  search?: SearchAdsProps;
};

@Injectable()
export class FindAllOwnAdsUseCase {
  constructor(
    private readonly advertisementRepository: AdvertisementRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ userId, limit, page, search }: Input): Promise<Output> {
    const { isNone, value: user } = await this.userRepository.findById({ id: userId });

    if (isNone()) {
      return left(new ResourceNotFoundError());
    }

    const { value: advertisements } = await this.advertisementRepository.findAllOwnAds({
      userId: user.id,
      limit,
      page,
      search,
    });

    return right(advertisements);
  }
}
