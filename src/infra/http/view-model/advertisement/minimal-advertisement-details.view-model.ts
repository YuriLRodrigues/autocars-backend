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
      salePrice: minimalAdvertisementDetails.salePrice,
      title: minimalAdvertisementDetails.title,
      advertisementId: minimalAdvertisementDetails.advertisementId.toValue(),
      thumbnailUrl: minimalAdvertisementDetails.thumbnailUrl,
      blurHash: minimalAdvertisementDetails.blurHash,
      capacity: minimalAdvertisementDetails.capacity,
      soldStatus: minimalAdvertisementDetails.soldStatus,
      model: minimalAdvertisementDetails.model,
      doors: minimalAdvertisementDetails.doors,
      fuel: minimalAdvertisementDetails.fuel,
      gearBox: minimalAdvertisementDetails.gearBox,
      likes: minimalAdvertisementDetails.likes ?? [],
    };
  }
}
