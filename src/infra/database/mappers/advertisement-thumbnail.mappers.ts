import { Prisma } from '@prisma/client';
import { AdvertisementThumbnail } from '@root/domain/enterprise/value-object/advertisement-thumbnail';

export class AdvertisementThumbnailMappers {
  static toPersistence(data: AdvertisementThumbnail): Prisma.ImageUpdateArgs {
    return {
      data: {
        advertisementId: data.advertisementId.toValue(),
        isThumbnail: true,
      },
      where: {
        id: data.thumbnailId.toValue(),
      },
    };
  }
}
