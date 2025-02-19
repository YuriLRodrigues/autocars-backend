import { UserAdvertisements } from '@root/domain/enterprise/value-object/user-advertisements';

export class UserAdvertisementViewModel {
  static toHttp(entity: UserAdvertisements) {
    return {
      user: {
        profileImg: entity.user.profileImg,
        username: entity.user.username,
        id: entity.user.id.toValue(),
      },
      advertisement: {
        createdAt: entity.advertisement.createdAt,
        id: entity.advertisement.id.toValue(),
        title: entity.advertisement.title,
        price: entity.advertisement.price,
        salePrice: entity.advertisement.salePrice ?? null,
        soldStatus: entity.advertisement.soldStatus,
        km: entity.advertisement.km,
        thumbnailUrl: entity.advertisement.thumbnailUrl,
        blurHash: entity.advertisement.blurHash,
        capacity: entity.advertisement.capacity,
        model: entity.advertisement.model,
        doors: entity.advertisement.doors,
        fuel: entity.advertisement.fuel,
        gearBox: entity.advertisement.gearBox,
      },
    };
  }
}
