import { Prisma } from '@prisma/client';
import { AdvertisementImage } from '@root/domain/enterprise/value-object/advertisement-image';

export class AdvertisementImageMappers {
  static toManyPersistence(adImgs: AdvertisementImage[]): Prisma.ImageUpdateManyArgs {
    const imagesIds = adImgs.map((adId) => {
      return adId.imageId.toValue();
    });

    return {
      where: {
        id: {
          in: imagesIds,
        },
      },
      data: {
        advertisementId: adImgs[0].advertisementId.toValue(),
      },
    };
  }
}
