import {
  AdvertisementThumbnailRepository,
  UpdateProps,
} from '@root/domain/application/repositories/advertisement-thumbnail.repository';
import { AdvertisementThumbnail } from '@root/domain/enterprise/value-object/advertisement-thumbnail';

export class InMemoryAdvertisementThumbnailRepository implements AdvertisementThumbnailRepository {
  public advertisementThumbnail: AdvertisementThumbnail[] = [];

  async update({ advertisementThumbnail }: UpdateProps): Promise<void> {
    const index = this.advertisementThumbnail.findIndex((thumbnail) =>
      thumbnail.thumbnailId.equals(advertisementThumbnail.thumbnailId),
    );

    if (index !== -1) {
      this.advertisementThumbnail[index] = advertisementThumbnail;
    }

    return;
  }
}
