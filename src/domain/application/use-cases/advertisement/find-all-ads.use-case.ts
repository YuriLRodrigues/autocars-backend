import { Injectable } from '@nestjs/common';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { Either, right } from '@root/core/logic/Either';
import { MinimalAdvertisementDetails } from '@root/domain/enterprise/value-object/minimal-advertisement-details';

import { AdvertisementRepository, FindAllAdsProps } from '../../repositories/advertisement.repository';

type Output = Either<Error, PaginatedResult<MinimalAdvertisementDetails[]>>;

type Input = {
  page: number;
  limit: number;
  search?: FindAllAdsProps['search'];
};

@Injectable()
export class FindAllAdsUseCase {
  constructor(private readonly advertisementRepository: AdvertisementRepository) {}

  async execute({ limit, page, search }: Input): Promise<Output> {
    const { value: advertisements } = await this.advertisementRepository.findAllAds({
      limit,
      page,
      search,
    });

    return right(advertisements);
  }
}
