import { AdvertisementThumbnail } from '@root/domain/enterprise/value-object/advertisement-thumbnail';

export type UpdateProps = {
  advertisementThumbnail: AdvertisementThumbnail;
};
export type CreateProps = {
  advertisementThumbnail: AdvertisementThumbnail;
};

export abstract class AdvertisementThumbnailRepository {
  abstract update({ advertisementThumbnail }: UpdateProps): Promise<void>;
}
