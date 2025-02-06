import { ManagerAdvertisements } from '@root/domain/enterprise/value-object/manager-advertisements';

export class ManagerAdvertisementViewModel {
  static toHttp(entity: ManagerAdvertisements) {
    return {
      createdAt: entity.createdAt,
      id: entity.id.toValue(),
      title: entity.title,
      price: entity.price,
      salePrice: entity.salePrice ?? null,
      soldStatus: entity.soldStatus,
      thumbnailUrl: entity.thumbnailUrl,
      blurHash: entity.blurHash,
      brand: {
        id: entity.brand.id.toValue(),
        name: entity.brand.name,
        logoUrl: entity.brand.logoUrl,
      },
      user: {
        id: entity.user.id.toValue(),
        name: entity.user.name,
        avatar: entity.user.avatar ?? undefined,
        blurHash: entity.user.blurHash ?? undefined,
      },
    };
  }
}
