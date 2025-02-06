import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ValueObject } from '@root/core/domain/value-object/value-object';

type AdvertisementImageProps = {
  advertisementId: UniqueEntityId;
  imageId: UniqueEntityId;
};

export class AdvertisementImage extends ValueObject<AdvertisementImageProps> {
  get advertisementId() {
    return this.props.advertisementId;
  }

  get imageId() {
    return this.props.imageId;
  }

  static create(props: AdvertisementImageProps) {
    return new AdvertisementImage({
      advertisementId: props.advertisementId,
      imageId: props.imageId,
    });
  }
}
