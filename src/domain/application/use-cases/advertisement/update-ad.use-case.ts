import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';
import {
  Capacity,
  Color,
  Doors,
  Fuel,
  GearBox,
  Model,
  SoldStatus,
} from '@root/domain/enterprise/entities/advertisement.entity';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';

import { AdvertisementThumbnailRepository } from '../../repositories/advertisement-thumbnail.repository';
import { AdvertisementRepository } from '../../repositories/advertisement.repository';
import { ImageRepository } from '../../repositories/image.repository';
import { UserRepository } from '../../repositories/user.repository';

type Input = {
  id: UniqueEntityId;
  userId: UniqueEntityId;
  km?: number;
  localization?: string;
  phone?: string;
  title?: string;
  newImagesIds?: string[];
  removedImagesIds?: string[];
  thumbnailImageId?: UniqueEntityId;
  description?: string;
  year?: number;
  details?: string[];
  brandId?: UniqueEntityId;
  doors?: Doors;
  model?: Model;
  color?: Color;
  price?: number;
  soldStatus?: SoldStatus;
  salePrice?: number;
  gearBox?: GearBox;
  fuel?: Fuel;
  capacity?: Capacity;
  updatedAt?: Date;
};

type Output = Either<ResourceNotFoundError | NotAllowedError, null>;

@Injectable()
export class UpdateAdUseCase {
  constructor(
    private readonly advertisementRepository: AdvertisementRepository,
    private readonly imageRepository: ImageRepository,
    private readonly userRepository: UserRepository,
    private readonly advertisementThumbnailRepository: AdvertisementThumbnailRepository,
  ) {}

  async execute({
    id,
    userId,
    brandId,
    capacity,
    color,
    description,
    details,
    doors,
    fuel,
    newImagesIds,
    removedImagesIds,
    gearBox,
    km,
    localization,
    model,
    phone,
    price,
    salePrice,
    thumbnailImageId,
    title,
    updatedAt,
    soldStatus,
    year,
  }: Input): Promise<Output> {
    const { isNone: userNotExists, value: user } = await this.userRepository.findById({
      id: userId,
    });

    if (userNotExists()) return left(new ResourceNotFoundError());

    const { isNone: adNotFound, value: advertisement } = await this.advertisementRepository.findAdById({
      id,
    });

    if (adNotFound()) return left(new ResourceNotFoundError());

    if (
      (user.roles.includes(UserRoles.Seller) && advertisement.userId !== user.id) ||
      (!user.roles.includes(UserRoles.Manager) && advertisement.userId !== user.id)
    ) {
      return left(new NotAllowedError());
    }

    const { value: oldImages, isNone: oldImagesNotFound } = await this.imageRepository.findManyByAdId({ id });

    if (oldImagesNotFound() || oldImages.length === 0) return left(new ResourceNotFoundError());

    newImagesIds?.map(async (imageId) => {
      const { value: image, isNone: imageNotFound } = await this.imageRepository.findById({
        id: new UniqueEntityId(imageId),
      });

      if (imageNotFound()) return left(new ResourceNotFoundError());

      image.advertisementId = id;

      await this.imageRepository.save({ image });
    });

    if (thumbnailImageId) {
      const { isNone: thumbnailNotExists, value: thumbnailImage } = await this.imageRepository.findById({
        id: thumbnailImageId,
      });

      if (thumbnailNotExists()) return left(new ResourceNotFoundError());

      advertisement.editInfo({
        thumbnailUrl: thumbnailImage.url,
      });
    }

    const { value: oldImageThumbnail } = await this.imageRepository.findThumbnail({
      advertisementId: advertisement.id,
    });

    advertisement.editInfo({
      brandId,
      capacity,
      color,
      description,
      details,
      doors,
      fuel,
      gearBox,
      km,
      localization,
      model,
      phone,
      price,
      salePrice,
      title,
      updatedAt,
      soldStatus,
      year,
    });

    Promise.all([
      await this.advertisementRepository.saveAd({ advertisement }),
      thumbnailImageId && (await this.imageRepository.delete({ imageId: oldImageThumbnail.id })),
      removedImagesIds &&
        this.imageRepository.deleteMany({ imagesIds: removedImagesIds.map((id) => new UniqueEntityId(id)) }),
    ]);

    return right(null);
  }
}
