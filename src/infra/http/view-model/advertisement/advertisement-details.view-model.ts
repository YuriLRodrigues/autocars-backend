import { AdvertisementDetails } from '@root/domain/enterprise/value-object/advertisement-details';

export class AdvertisementDetailsViewModel {
  static toHttp(entity: AdvertisementDetails) {
    return {
      km: entity.km,
      localization: entity.localization,
      phone: entity.phone,
      title: entity.title,
      year: entity.year,
      description: entity.description,
      details: entity.details,
      doors: entity.doors,
      model: entity.model,
      color: entity.color,
      price: entity.price,
      soldStatus: entity.soldStatus,
      salePrice: entity.salePrice,
      gearBox: entity.gearBox,
      fuel: entity.fuel,
      capacity: entity.capacity,
      images: entity.images.map((image) => ({
        url: image.url,
      })),
      brand: {
        id: entity.brand.brandId.toValue(),
        name: entity.brand.name,
        logoUrl: entity.brand.logoUrl,
      },
      user: {
        id: entity.user.id.toValue(),
        name: entity.user.name,
        address: {
          street: entity.user.address.street,
          city: entity.user.address.city,
          zipCode: entity.user.address.zipCode,
        },
      },
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt || null,
    };
  }
}
