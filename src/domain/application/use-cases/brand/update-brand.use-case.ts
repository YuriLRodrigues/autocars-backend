import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';

import { BrandRepository } from '../../repositories/brand.repository';
import { ImageRepository } from '../../repositories/image.repository';
import { UserRepository } from '../../repositories/user.repository';

type Input = {
  id: UniqueEntityId;
  userId: UniqueEntityId;
  logoId?: UniqueEntityId;
  name?: string;
};

type Output = Either<NotAllowedError | ResourceNotFoundError, void>;

@Injectable()
export class UpdateBrandUseCase {
  constructor(
    private readonly brandRepository: BrandRepository,
    private readonly userRepository: UserRepository,
    private readonly imageRepository: ImageRepository,
  ) {}

  async execute({ id, name, logoId, userId }: Input): Promise<Output> {
    const { isNone: userNotExists, value: user } = await this.userRepository.findById({ id: userId });

    if (userNotExists() || !user.roles.includes(UserRoles.Manager)) {
      return left(new NotAllowedError());
    }

    const { isNone: brandNotExists, value: brand } = await this.brandRepository.findById({ id });

    if (brandNotExists()) {
      return left(new ResourceNotFoundError());
    }

    const { isNone: imageNotFound, value: image } = await this.imageRepository.findById({ id: logoId });

    if (imageNotFound()) return left(new ResourceNotFoundError());

    brand.editInfo({
      logoUrl: image.url,
      name,
    });

    await this.brandRepository.save({ brand });

    return right(null);
  }
}
