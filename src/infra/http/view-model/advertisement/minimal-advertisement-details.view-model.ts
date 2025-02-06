import { MinimalAdvertisementDetails } from '@root/domain/enterprise/value-object/minimal-advertisement-details';

export class MinimalAdvertisementDetailsViewModel {
  static toHttp(minimalAdvertisementDetails: MinimalAdvertisementDetails) {
    return {
      brand: {
        logoUrl: minimalAdvertisementDetails.brand.logoUrl,

        name: minimalAdvertisementDetails.brand.name,
        brandId: minimalAdvertisementDetails.brand.brandId.toValue(),
      },
      km: minimalAdvertisementDetails.km,
      price: minimalAdvertisementDetails.price,
      title: minimalAdvertisementDetails.title,
      advertisementId: minimalAdvertisementDetails.advertisementId,
      thumbnailUrl: minimalAdvertisementDetails.thumbnailUrl,
      blurHash: minimalAdvertisementDetails.blurHash,
      capacity: minimalAdvertisementDetails.capacity,
      doors: minimalAdvertisementDetails.doors,
      fuel: minimalAdvertisementDetails.fuel,
      gearBox: minimalAdvertisementDetails.gearBox,
      likes: minimalAdvertisementDetails.likes ?? [],
    };
  }
}
