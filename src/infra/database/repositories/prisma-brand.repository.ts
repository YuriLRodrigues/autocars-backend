import { Injectable } from '@nestjs/common';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { AsyncMaybe, Maybe } from '@root/core/logic/Maybe';
import {
  BrandRepository,
  CreateProps,
  DeleteProps,
  FindByIdProps,
  FindByNameProps,
  SaveProps,
  FindAllProps,
} from '@root/domain/application/repositories/brand.repository';
import { BrandEntity } from '@root/domain/enterprise/entities/brand.entity';

import { BrandMappers } from '../mappers/brand.mappers';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaBrandRepository implements BrandRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ brand }: CreateProps): AsyncMaybe<BrandEntity> {
    const raw = BrandMappers.toPersistence(brand);

    await this.prismaService.brand.create({
      data: raw,
    });

    return Maybe.some(brand);
  }

  async findById({ id }: FindByIdProps): AsyncMaybe<BrandEntity> {
    const brand = await this.prismaService.brand.findFirst({
      where: {
        id: id.toValue(),
      },
    });

    if (!brand) {
      return Maybe.none();
    }

    const mappedBrand = BrandMappers.toDomain(brand);

    return Maybe.some(mappedBrand);
  }

  async findByName({ name }: FindByNameProps): AsyncMaybe<BrandEntity> {
    const brand = await this.prismaService.brand.findFirst({
      where: {
        name,
      },
    });

    if (!brand) {
      return Maybe.none();
    }

    const mappedBrand = BrandMappers.toDomain(brand);

    return Maybe.some(mappedBrand);
  }

  async save({ brand }: SaveProps): AsyncMaybe<void> {
    const raw = BrandMappers.toPersistence(brand);

    await this.prismaService.brand.update({
      data: raw,
      where: {
        id: brand.id.toValue(),
      },
    });

    return;
  }

  async findAll({ limit, page }: FindAllProps): AsyncMaybe<PaginatedResult<BrandEntity[]>> {
    const [brands, count] = await this.prismaService.$transaction([
      this.prismaService.brand.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          name: 'asc',
        },
      }),
      this.prismaService.brand.count(),
    ]);

    const mappedBrands = brands.map((brand) => BrandMappers.toDomain(brand));

    return Maybe.some({
      data: mappedBrands,
      meta: {
        page,
        perPage: limit,
        totalPages: Math.ceil(count / limit),
        totalCount: count,
      },
    });
  }

  async delete({ brandId }: DeleteProps): AsyncMaybe<void> {
    await this.prismaService.brand.delete({
      where: {
        id: brandId.toValue(),
      },
    });

    return;
  }
}
