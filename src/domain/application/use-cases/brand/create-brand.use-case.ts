import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceAlreadyExistsError } from '@root/core/errors/resource-already-exists-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';
import { BrandEntity } from '@root/domain/enterprise/entities/brand.entity';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';

import { BrandRepository } from '../../repositories/brand.repository';
import { ImageRepository } from '../../repositories/image.repository';
import { UserRepository } from '../../repositories/user.repository';

type Input = {
  logoId: UniqueEntityId;
  name: string;
  userId: UniqueEntityId;
};

type Output = Either<ResourceAlreadyExistsError | ResourceNotFoundError | NotAllowedError, BrandEntity>;

@Injectable()
export class CreateBrandUseCase {
  constructor(
    private readonly brandRepository: BrandRepository,
    private readonly userRepository: UserRepository,
    private readonly imageRepository: ImageRepository,
  ) {}

  async execute({ logoId, name, userId }: Input): Promise<Output> {
    const { isNone: userNotExists, value: user } = await this.userRepository.findById({ id: userId });

    if (userNotExists()) {
      return left(new ResourceNotFoundError());
    }

    if (!user.roles.includes(UserRoles.Manager)) {
      return left(new NotAllowedError());
    }

    const { isSome: brandAlreadyExists } = await this.brandRepository.findByName({ name });

    if (brandAlreadyExists()) {
      return left(new ResourceAlreadyExistsError());
    }

    const { isNone: imageNotFound, value: image } = await this.imageRepository.findById({ id: logoId });

    if (imageNotFound()) return left(new ResourceNotFoundError());

    const brand = BrandEntity.create({
      logoUrl: image.url,
      name,
    });

    const { value: createdBrand } = await this.brandRepository.create({ brand });

    return right(createdBrand);
  }
}
