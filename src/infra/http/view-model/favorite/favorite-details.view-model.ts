import { FavoriteDetailsProps } from '@root/domain/enterprise/value-object/favorite-details';

export class FavoriteDetailsViewModel {
  static toHttp(favoriteDetails: FavoriteDetailsProps) {
    return {
      id: favoriteDetails.id.toValue(),
      advertisement: {
        id: favoriteDetails.advertisement.id.toValue(),
        title: favoriteDetails.advertisement.title,
        thumbnailUrl: favoriteDetails.advertisement.thumbnailUrl,
        blurHash: favoriteDetails.advertisement.blurHash,
        price: favoriteDetails.advertisement.price,
        km: favoriteDetails.advertisement.km,
        doors: favoriteDetails.advertisement.doors,
        gearBox: favoriteDetails.advertisement.gearBox,
        fuel: favoriteDetails.advertisement.fuel,
        capacity: favoriteDetails.advertisement.capacity,
        soldStatus: favoriteDetails.advertisement.soldStatus,
      },
    };
  }
}
