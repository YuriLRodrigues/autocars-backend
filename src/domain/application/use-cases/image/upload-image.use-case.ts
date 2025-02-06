import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { Either, left, right } from '@root/core/logic/Either';
import { ImageEntity } from '@root/domain/enterprise/entities/image.entity';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { generateBlurHash } from '@root/utils/blur-hash';

import { ImageTypeError } from '../../errors/image-type-error';
import { ImageRepository } from '../../repositories/image.repository';
import { Uploader } from '../../repositories/uploader.repository';
import { UserRepository } from '../../repositories/user.repository';

type ImageProps = {
  fileName: string;
  fileType: string;
  fileSize: number;
  body: Buffer;
};

type Input = {
  images: ImageProps[];
  userId: UniqueEntityId;
};

type Output = Either<NotAllowedError | ImageTypeError, ImageEntity[]>;

@Injectable()
export class UploadImageUseCase {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly uploader: Uploader,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ images, userId }: Input): Promise<Output> {
    const { isNone: userNotExists, value: user } = await this.userRepository.findById({
      id: userId,
    });

    if (userNotExists() || !user.roles.some((role) => role === UserRoles.Manager || role === UserRoles.Seller)) {
      return left(new NotAllowedError());
    }

    const uploadedImages: ImageEntity[] = [];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    for (const image of images) {
      if (!/^(image\/(png|jpg|jpeg|webp))$/.test(image.fileType)) {
        return left(new ImageTypeError(`Unsupported file type: ${image.fileType}`));
      }

      if (image.fileSize > maxFileSize) {
        return left(new ImageTypeError(`File size exceeds the maximum limit of 5MB: ${image.fileSize} bytes`));
      }

      const blurHash = await generateBlurHash(image.body);

      const imageUploaded = await this.uploader.uploadImage({ image });

      const imageEntity = ImageEntity.create({
        url: imageUploaded.url,
        blurHash,
        userId: user.id,
      });

      await this.imageRepository.create({ image: imageEntity });
      uploadedImages.push(imageEntity);
    }

    return right(uploadedImages);
  }
}
