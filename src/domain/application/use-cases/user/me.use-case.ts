import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';
import { Me } from '@root/domain/enterprise/value-object/me';

import { AddressRepository } from '../../repositories/address.repository';
import { ImageRepository } from '../../repositories/image.repository';
import { UserRepository } from '../../repositories/user.repository';

type Output = Either<ResourceNotFoundError, Me>;

type Input = {
  id: UniqueEntityId;
};

@Injectable()
export class MeUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly addressRepository: AddressRepository,
    private readonly imageRepository: ImageRepository,
  ) {}

  async execute({ id }: Input): Promise<Output> {
    const { value: user, isNone: userNotFound } = await this.userRepository.findById({ id });

    if (userNotFound()) return left(new ResourceNotFoundError());

    const { value: address, isNone: addressNotFound } = await this.addressRepository.findByUserId({ id: user.id });

    if (addressNotFound()) return left(new ResourceNotFoundError());

    const { value: avatar } = await this.imageRepository.findAvatar({ userId: user.id });

    const me = Me.create({
      user: {
        blurHash: avatar?.blurHash || undefined,
        avatar: user.avatar || undefined,
        email: user.email,
        username: user.username,
        name: user.name,
        id: user.id,
        roles: user.roles,
      },
      address: {
        id: address.id,
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        neighborhood: address.neighborhood,
      },
    });

    return right(me);
  }
}
