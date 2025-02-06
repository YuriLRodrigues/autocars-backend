import { PaginatedResult } from '@root/core/dto/paginated-result';
import { AsyncMaybe, Maybe } from '@root/core/logic/Maybe';
import {
  CreateProps,
  DeleteManyProps,
  DeleteProps,
  FindAllProps,
  FindAvatarProps,
  FindByIdProps,
  FindThumbnailProps,
  ImageRepository,
  SaveProps,
} from '@root/domain/application/repositories/image.repository';
import { ImageEntity } from '@root/domain/enterprise/entities/image.entity';

export class InMemoryImageRepository implements ImageRepository {
  public images: ImageEntity[] = [];

  async create({ image }: CreateProps): AsyncMaybe<ImageEntity> {
    this.images.push(image);

    return Maybe.some(image);
  }

  async findById({ id }: FindByIdProps): AsyncMaybe<ImageEntity> {
    const image = this.images.find((image) => image.id.equals(id));

    if (!image) {
      return Maybe.none();
    }

    return Maybe.some(image);
  }

  async findAll({ limit, page }: FindAllProps): AsyncMaybe<PaginatedResult<ImageEntity[]>> {
    const images = this.images.slice((page - 1) * limit, limit * page);

    return Maybe.some({
      data: images,
      meta: {
        page,
        perPage: limit,
        totalPages: Math.ceil(this.images.length / limit),
        totalCount: this.images.length,
      },
    });
  }

  async findManyByAdId({ id }: FindByIdProps): AsyncMaybe<ImageEntity[]> {
    const images = this.images.filter((image) => image.advertisementId.equals(id));

    return Maybe.some(images);
  }

  async findMetrics(): AsyncMaybe<{
    totalCount: number;
    totalInAdvertisements: number;
    totalThumbnails: number;
    totalUnused: number;
  }> {
    const totalCount = this.images.length;
    const totalInAdvertisements = this.images.filter((image) => image.advertisementId).length;
    const totalThumbnails = this.images.filter((image) => image.isThumbnail).length;
    const totalUnused = totalCount - (totalInAdvertisements + totalThumbnails);

    return Maybe.some({
      totalCount,
      totalInAdvertisements,
      totalThumbnails,
      totalUnused,
    });
  }

  async findThumbnail({ advertisementId }: FindThumbnailProps): AsyncMaybe<ImageEntity | null> {
    const thumbnail = this.images.find((image) => image.isThumbnail && image.advertisementId.equals(advertisementId));

    if (!thumbnail) return Maybe.none();

    return Maybe.some(thumbnail);
  }

  async findAvatar({ userId }: FindAvatarProps): AsyncMaybe<ImageEntity | null> {
    const avatar = this.images.find((image) => image.isAvatar && image.userId.equals(userId));

    if (!avatar) return Maybe.none();

    return Maybe.some(avatar);
  }

  async delete({ imageId }: DeleteProps): AsyncMaybe<void> {
    this.images = this.images.filter((image) => !image.id.equals(imageId));

    return;
  }

  async deleteMany({ imagesIds }: DeleteManyProps): AsyncMaybe<void> {
    this.images = this.images.filter((image) => !imagesIds.includes(image.id));

    return;
  }

  async save({ image }: SaveProps): AsyncMaybe<void> {
    const index = this.images.findIndex((img) => img.id.equals(image.id));

    this.images[index] = image;

    return;
  }
}
