import { Injectable } from '@nestjs/common';
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

import { ImageMappers } from '../mappers/image.mappers';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaImageRepository implements ImageRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ image }: CreateProps): AsyncMaybe<ImageEntity> {
    const raw = await ImageMappers.toPersistence(image);

    await this.prismaService.image.create({
      data: raw,
    });

    return Maybe.some(image);
  }

  async delete({ imageId }: DeleteProps): AsyncMaybe<void> {
    await this.prismaService.image.delete({
      where: {
        id: imageId.toValue(),
      },
    });

    return;
  }

  async deleteMany({ imagesIds }: DeleteManyProps): AsyncMaybe<void> {
    await this.prismaService.image.deleteMany({
      where: {
        id: { in: imagesIds.map((id) => id.toValue()) },
      },
    });

    return;
  }
  async findMetrics(): AsyncMaybe<{
    totalCount: number;
    totalInAdvertisements: number;
    totalThumbnails: number;
    totalUnused: number;
  }> {
    const [totalCount, totalInAdvertisements, totalThumbnails, totalUnused] = await this.prismaService.$transaction([
      this.prismaService.image.count(),
      this.prismaService.image.count({ where: { advertisementId: { not: null } } }),
      this.prismaService.image.count({
        where: {
          advertisementImages: {
            thumbnailUrl: {
              not: null,
            },
          },
        },
      }),
      this.prismaService.image.count({
        where: {
          advertisementImages: {
            AND: {
              thumbnailUrl: {
                equals: null,
              },
              id: {
                equals: null,
              },
            },
          },
        },
      }),
    ]);

    return Maybe.some({
      totalCount,
      totalInAdvertisements,
      totalThumbnails,
      totalUnused,
    });
  }

  async findThumbnail({ advertisementId }: FindThumbnailProps): AsyncMaybe<ImageEntity | null> {
    const thumbnail = await this.prismaService.image.findFirst({
      where: {
        advertisementId: advertisementId.toValue(),
        isThumbnail: true,
      },
    });

    if (!thumbnail) return Maybe.none();

    return Maybe.some(ImageMappers.toDomain(thumbnail));
  }

  async findAvatar({ userId }: FindAvatarProps): AsyncMaybe<ImageEntity | null> {
    const avatar = await this.prismaService.image.findFirst({
      where: {
        userId: userId.toValue(),
        isAvatar: true,
      },
    });

    if (!avatar) return Maybe.none();

    return Maybe.some(ImageMappers.toDomain(avatar));
  }

  async save({ image }: SaveProps): AsyncMaybe<void> {
    const raw = ImageMappers.toPersistence(image);

    await this.prismaService.image.update({
      data: raw,
      where: {
        id: image.id.toValue(),
      },
    });

    return;
  }

  async findManyByAdId({ id }: FindByIdProps): AsyncMaybe<ImageEntity[]> {
    const images = await this.prismaService.image.findMany({
      where: {
        advertisementId: id.toValue(),
      },
    });

    const imagesMapped = images.map(ImageMappers.toDomain);

    return Maybe.some(imagesMapped);
  }

  async findById({ id }: FindByIdProps): AsyncMaybe<ImageEntity> {
    const image = await this.prismaService.image.findFirst({
      where: {
        id: id.toValue(),
      },
    });

    if (!image) {
      return Maybe.none();
    }

    const mappedImage = ImageMappers.toDomain(image);

    return Maybe.some(mappedImage);
  }

  async findAll({ limit, page }: FindAllProps): AsyncMaybe<PaginatedResult<ImageEntity[]>> {
    const [images, count] = await this.prismaService.$transaction([
      this.prismaService.image.findMany({
        take: limit,
        skip: (page - 1) * limit,
      }),
      this.prismaService.image.count(),
    ]);

    const mappedImages = images.map(ImageMappers.toDomain);

    const paginatedImages = mappedImages.slice((page - 1) * limit, page * limit);

    return Maybe.some({
      data: paginatedImages,
      meta: {
        page,
        perPage: limit,
        totalPages: Math.ceil(count / limit),
        totalCount: count,
      },
    });
  }
}
