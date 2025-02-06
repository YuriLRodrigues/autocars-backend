import {
  AdvertisementImageRepository,
  UpdateManyProps,
} from '@root/domain/application/repositories/advertisement-image.repository';
import { AdvertisementImage } from '@root/domain/enterprise/value-object/advertisement-image';

export class InMemoryAdvertisementImageRepository implements AdvertisementImageRepository {
  public advertisementImages: AdvertisementImage[] = [];

  async updateMany({ advertisementImages }: UpdateManyProps): Promise<void> {
    advertisementImages.map((adImg) => {
      const index = this.advertisementImages.findIndex((img) => img.imageId.equals(adImg.imageId));

      if (index !== -1) {
        this.advertisementImages[index] = adImg;
      }
    });

    return;
  }
}
