import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ValueObject } from '@root/core/domain/value-object/value-object';

type AdvertisementThumbnailProps = {
  advertisementId: UniqueEntityId;
  thumbnailId: UniqueEntityId;
};

export class AdvertisementThumbnail extends ValueObject<AdvertisementThumbnailProps> {
  get advertisementId() {
    return this.props.advertisementId;
  }

  get thumbnailId() {
    return this.props.thumbnailId;
  }

  static create(data: AdvertisementThumbnailProps) {
    return new AdvertisementThumbnail({
      advertisementId: data.advertisementId,
      thumbnailId: data.thumbnailId,
    });
  }
}
