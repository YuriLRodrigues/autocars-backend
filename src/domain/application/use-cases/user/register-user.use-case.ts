import { Injectable } from '@nestjs/common';
import { ResourceAlreadyExistsError } from '@root/core/errors/resource-already-exists-error';
import { Either, left, right } from '@root/core/logic/Either';
import { AddressEntity } from '@root/domain/enterprise/entities/address.entity';
import { UserEntity, UserRoles } from '@root/domain/enterprise/entities/user.entity';

import { HashGenerator } from '../../cryptography/hash-generator';
import { AddressRepository } from '../../repositories/address.repository';
import { UserRepository } from '../../repositories/user.repository';

type Output = Either<ResourceAlreadyExistsError, UserEntity>;

type Input = {
  email: string;
  name: string;
  username: string;
  password: string;
  role?: UserRoles;
  city: string;
  country: string;
  neighborhood: string;
  state: string;
  street: string;
  zipCode: number;
};

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashGenerator: HashGenerator,
    private readonly addressRepository: AddressRepository,
  ) {}

  async execute({
    email,
    role,
    name,
    username,
    password,
    city,
    country,
    neighborhood,
    state,
    street,
    zipCode,
  }: Input): Promise<Output> {
    const { isSome: userEmailExists } = await this.userRepository.findByEmail({ email });

    if (userEmailExists()) {
      return left(new ResourceAlreadyExistsError());
    }

    const { isSome: userUsernameExists } = await this.userRepository.findByUsername({ username });

    if (userUsernameExists()) {
      return left(new ResourceAlreadyExistsError());
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = UserEntity.create({
      avatar: null,
      email,
      name,
      password: hashedPassword,
      username,
      roles: [role ?? UserRoles.Customer],
    });

    const address = AddressEntity.create({
      userId: user.id,
      street,
      city,
      neighborhood,
      state,
      zipCode,
      country,
    });

    Promise.all([await this.userRepository.register({ user }), await this.addressRepository.create({ address })]);

    return right(user);
  }
}
