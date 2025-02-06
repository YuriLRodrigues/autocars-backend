import { Injectable } from '@nestjs/common';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { Either, right } from '@root/core/logic/Either';
import { BrandEntity } from '@root/domain/enterprise/entities/brand.entity';

import { BrandRepository } from '../../repositories/brand.repository';

type Output = Either<Error, PaginatedResult<BrandEntity[]>>;

type Input = {
  limit?: number;
  page?: number;
};
@Injectable()
export class FindAllBrandsUseCase {
  constructor(private readonly brandRepository: BrandRepository) {}

  async execute({ limit, page }: Input): Promise<Output> {
    const { value: brands } = await this.brandRepository.findAll({ limit, page });

    return right(brands);
  }
}
