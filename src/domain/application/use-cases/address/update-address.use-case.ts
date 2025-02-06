import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';
import { AddressEntity } from '@root/domain/enterprise/entities/address.entity';

import { AddressRepository } from '../../repositories/address.repository';
import { UserRepository } from '../../repositories/user.repository';

type Output = Either<ResourceNotFoundError, AddressEntity>;

type Input = {
  city?: string;
  country?: string;
  neighborhood?: string;
  state?: string;
  street?: string;
  zipCode?: number;
  userId: UniqueEntityId;
};

@Injectable()
export class UpdateAddressUseCase {
  constructor(
    private readonly addressRepository: AddressRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ userId, city, country, neighborhood, state, street, zipCode }: Input): Promise<Output> {
    const { isNone: userNotExists } = await this.userRepository.findById({
      id: userId,
    });

    if (userNotExists()) {
      return left(new ResourceNotFoundError());
    }

    const { isNone: addressNotFound, value: address } = await this.addressRepository.findByUserId({ id: userId });

    if (addressNotFound()) return left(new ResourceNotFoundError());

    address.editAddress({
      city,
      country,
      neighborhood,
      state,
      street,
      zipCode,
    });

    await this.addressRepository.save({ address });

    return right(address);
  }
}
