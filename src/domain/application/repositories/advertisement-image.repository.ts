import { AdvertisementImage } from '@root/domain/enterprise/value-object/advertisement-image';

export type UpdateManyProps = {
  advertisementImages: AdvertisementImage[];
};

export abstract class AdvertisementImageRepository {
  abstract updateMany({ advertisementImages }: UpdateManyProps): Promise<void>;
}
