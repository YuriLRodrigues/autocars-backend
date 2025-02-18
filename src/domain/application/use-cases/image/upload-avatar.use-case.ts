import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';
import { ImageEntity } from '@root/domain/enterprise/entities/image.entity';
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
  avatar: ImageProps;
  userId: UniqueEntityId;
};

type Output = Either<NotAllowedError | ImageTypeError, ImageEntity>;

@Injectable()
export class UploadAvatarUseCase {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly uploader: Uploader,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ avatar, userId }: Input): Promise<Output> {
    const { isNone: userNotExists, value: user } = await this.userRepository.findById({
      id: userId,
    });

    if (userNotExists()) return left(new ResourceNotFoundError());

    const maxFileSize = 5 * 1024 * 1024; // 5MB

    if (!/^(image\/(png|jpg|jpeg|webp))$/.test(avatar.fileType))
      return left(new ImageTypeError(`Unsupported file type: ${avatar.fileType}`));

    if (avatar.fileSize > maxFileSize)
      return left(new ImageTypeError(`File size exceeds the maximum limit of 5MB: ${avatar.fileSize} bytes`));

    const blurHash = await generateBlurHash(avatar.body);

    const imageUploaded = await this.uploader.uploadImage({ image: avatar });

    const imageEntity = ImageEntity.create({
      url: imageUploaded.url,
      blurHash,
      userId: user.id,
      isAvatar: true,
    });

    await this.imageRepository.create({ image: imageEntity });

    return right(imageEntity);
  }
}
