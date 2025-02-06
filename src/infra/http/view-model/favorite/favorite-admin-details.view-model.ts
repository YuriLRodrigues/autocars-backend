import { FavoriteAdminDetails } from '@root/domain/enterprise/value-object/favorite-admin-details';

export class FavoriteAdminDetailsViewModel {
  static toHttp(favoriteDetails: FavoriteAdminDetails) {
    return {
      id: favoriteDetails.id.toValue(),
      advertisement: {
        id: favoriteDetails.advertisement.id.toValue(),
        title: favoriteDetails.advertisement.title,
        thumbnailUrl: favoriteDetails.advertisement.thumbnailUrl,
        blurHash: favoriteDetails.advertisement.blurHash,
        price: favoriteDetails.advertisement.price,
        status: favoriteDetails.advertisement.status,
      },
      user: {
        id: favoriteDetails.user.id.toValue(),
        name: favoriteDetails.user.name,
        avatar: favoriteDetails.user.avatar,
      },
      favoritesCount: favoriteDetails.favoritesCount,
      createdAt: favoriteDetails.createdAt,
    };
  }
}
