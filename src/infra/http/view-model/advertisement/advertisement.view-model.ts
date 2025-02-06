import { AdvertisementEntity } from '@root/domain/enterprise/entities/advertisement.entity';

export class AdvertisementViewModel {
  static toHttp(entity: AdvertisementEntity) {
    return {
      id: entity.id.toValue(),
      km: entity.km,
      localization: entity.localization,
      title: entity.title,
      thumbnailUrl: entity.thumbnailUrl,
      year: entity.year,
      doors: entity.doors,
      model: entity.model,
      price: entity.price,
      soldStatus: entity.soldStatus,
      salePrice: entity.salePrice,
      gearBox: entity.gearBox,
      fuel: entity.fuel,
      capacity: entity.capacity,
      createdAt: entity.createdAt,
    };
  }
}
