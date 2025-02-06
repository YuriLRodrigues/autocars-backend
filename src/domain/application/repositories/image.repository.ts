import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { AsyncMaybe } from '@root/core/logic/Maybe';
import { ImageEntity } from '@root/domain/enterprise/entities/image.entity';

export type FindByIdProps = {
  id: UniqueEntityId;
};

export type FindManyByAdIdProps = {
  id: UniqueEntityId;
};

export type FindAllProps = {
  page: number;
  limit: number;
};

export type CreateProps = {
  image: ImageEntity;
};

export type DeleteProps = {
  imageId: UniqueEntityId;
};

export type DeleteManyProps = {
  imagesIds: UniqueEntityId[];
};

export type SaveProps = {
  image: ImageEntity;
};

export type FindAllByAdvertisementIdProps = {
  advertisementId: UniqueEntityId;
};

export type FindThumbnailProps = {
  advertisementId: UniqueEntityId;
};

export type FindAvatarProps = {
  userId: UniqueEntityId;
};

export abstract class ImageRepository {
  abstract create({ image }: CreateProps): AsyncMaybe<ImageEntity>;
  abstract delete({ imageId }: DeleteProps): AsyncMaybe<void>;
  abstract deleteMany({ imagesIds }: DeleteManyProps): AsyncMaybe<void>;
  abstract save({ image }: SaveProps): AsyncMaybe<void>;
  abstract findById({ id }: FindByIdProps): AsyncMaybe<ImageEntity | null>;
  abstract findThumbnail({ advertisementId }: FindThumbnailProps): AsyncMaybe<ImageEntity | null>;
  abstract findAvatar({ userId }: FindAvatarProps): AsyncMaybe<ImageEntity | null>;
  abstract findMetrics(): AsyncMaybe<{
    totalCount: number;
    totalInAdvertisements: number;
    totalThumbnails: number;
    totalUnused: number;
  }>;
  abstract findManyByAdId({ id }: FindByIdProps): AsyncMaybe<ImageEntity[]>;
  abstract findAll({ limit, page }: FindAllProps): AsyncMaybe<PaginatedResult<ImageEntity[]>>;
}
