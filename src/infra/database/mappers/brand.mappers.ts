import { Brand, Prisma } from '@prisma/client';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { BrandEntity } from '@root/domain/enterprise/entities/brand.entity';

export class BrandMappers {
  static toDomain(data: Brand): BrandEntity {
    return BrandEntity.create(
      {
        logoUrl: data.logoUrl,
        name: data.name,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      new UniqueEntityId(data.id),
    );
  }

  static toPersistence(data: BrandEntity): Prisma.BrandCreateInput {
    return {
      id: data.id.toValue(),
      name: data.name,
      updatedAt: data.updatedAt,
      createdAt: data.createdAt,
      logoUrl: data.logoUrl,
    };
  }
}
