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
      },
    };
  }
}
