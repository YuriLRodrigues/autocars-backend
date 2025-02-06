import { BrandEntity } from '@root/domain/enterprise/entities/brand.entity';

export class BrandViewModel {
  static toHttp(entity: BrandEntity) {
    return {
      id: entity.id.toValue(),
      name: entity.name,
      logoUrl: entity.logoUrl,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
