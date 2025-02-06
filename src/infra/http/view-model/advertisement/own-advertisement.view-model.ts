import { OwnAdvertisements } from '@root/domain/enterprise/value-object/own-advertisements';

export class OwnAdvertisementViewModel {
  static toHttp(entity: OwnAdvertisements) {
    return {
      createdAt: entity.createdAt,
      id: entity.id.toValue(),
      title: entity.title,
      price: entity.price,
      salePrice: entity.salePrice ?? null,
      soldStatus: entity.soldStatus,
      thumbnailUrl: entity.thumbnailUrl,
      blurHash: entity.blurHash,
      brand: entity.brand,
    };
  }
}
