import { PaginatedResult } from '@root/core/dto/paginated-result';
import { AsyncMaybe, Maybe } from '@root/core/logic/Maybe';
import {
  BrandRepository,
  CreateProps,
  DeleteProps,
  FindAllProps,
  FindByIdProps,
  FindByNameProps,
  SaveProps,
} from '@root/domain/application/repositories/brand.repository';
import { BrandEntity } from '@root/domain/enterprise/entities/brand.entity';

export class InMemoryBrandRepository implements BrandRepository {
  public brands: BrandEntity[] = [];

  async create({ brand }: CreateProps): AsyncMaybe<BrandEntity> {
    this.brands.push(brand);

    return Maybe.some(brand);
  }

  async findById({ id }: FindByIdProps): AsyncMaybe<BrandEntity> {
    const brand = await this.brands.find((brand) => brand.id.equals(id));

    if (!brand) {
      return Maybe.none();
    }

    return Maybe.some(brand);
  }

  async findByName({ name }: FindByNameProps): AsyncMaybe<BrandEntity> {
    const brand = await this.brands.find((brand) => brand.name === name);

    if (!brand) {
      return Maybe.none();
    }

    return Maybe.some(brand);
  }

  async findAll({ limit, page }: FindAllProps): AsyncMaybe<PaginatedResult<BrandEntity[]>> {
    const brands = this.brands.slice((page - 1) * limit, limit * page);

    return Maybe.some({
      data: brands,
      meta: {
        page,
        perPage: limit,
        totalPages: Math.ceil(this.brands.length / limit),
        totalCount: this.brands.length,
      },
    });
  }

  async delete({ brandId }: DeleteProps): AsyncMaybe<void> {
    this.brands = this.brands.filter((brand) => !brand.id.equals(brandId));

    return;
  }

  async save({ brand }: SaveProps): AsyncMaybe<void> {
    const index = this.brands.findIndex((brand) => brand.id.equals(brand.id));

    this.brands[index] = brand;

    return;
  }
}
