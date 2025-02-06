import { ResourceAlreadyExistsError } from '@root/core/errors/resource-already-exists-error';
import { UserEntity, UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { FakeHash } from 'test/cryptography';
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryLikeAdvertisementRepository } from 'test/repositories/in-memory-like-advertisement-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { RegisterUserUseCase } from './register-user.use-case';

describe('Register User - Use Case', () => {
  let sut: RegisterUserUseCase;

  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryAdvertisementRepository: InMemoryAdvertisementRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryLikeAdvertisementRepository: InMemoryLikeAdvertisementRepository;
  let inMemoryImageRepository: InMemoryImageRepository;
  let inMemoryAddressRepository: InMemoryAddressRepository;

  const user = UserEntity.create({
    username: 'testUser',
    email: 'emailtest@example.com',
    name: 'TestUser',
    password: 'password',
  });

  beforeEach(() => {
    inMemoryBrandRepository = new InMemoryBrandRepository();
    inMemoryImageRepository = new InMemoryImageRepository();
    inMemoryAddressRepository = new InMemoryAddressRepository();
    inMemoryUserRepository = new InMemoryUserRepository(inMemoryAdvertisementRepository);
    inMemoryLikeAdvertisementRepository = new InMemoryLikeAdvertisementRepository();
    inMemoryAdvertisementRepository = new InMemoryAdvertisementRepository(
      inMemoryBrandRepository,
      inMemoryLikeAdvertisementRepository,
      inMemoryUserRepository,
      inMemoryImageRepository,
      inMemoryAddressRepository,
    );
    const fakeHash = new FakeHash();
    sut = new RegisterUserUseCase(inMemoryUserRepository, fakeHash, inMemoryAddressRepository);
  });

  it('should be able to register a new user', async () => {
    const output = await sut.execute({
      username: 'john',
      email: 'email@example.com',
      name: 'John',
      password: 'password',
      city: 'Chicago',
      country: 'BR',
      neighborhood: 'Bairro',
      street: 'Rua',
      state: 'MG',
      zipCode: 12345,
      role: UserRoles.Customer,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toBeInstanceOf(UserEntity);
    expect(inMemoryUserRepository.users).toHaveLength(1);
    expect(output.value).toEqual(
      expect.objectContaining({
        username: 'john',
        email: 'email@example.com',
        name: 'John',
        password: 'password-hashed',
        roles: expect.arrayContaining([UserRoles.Customer]),
      }),
    );
  });

  it('should not be able to register a new user with an existing email or username', async () => {
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({
      username: 'testUser',
      email: 'emailtest@example.com',
      name: 'TestUser',
      password: 'password',
      city: 'Chicago',
      country: 'BR',
      neighborhood: 'Bairro',
      street: 'Rua',
      state: 'MG',
      zipCode: 12345,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).not.toBeInstanceOf(UserEntity);
    expect(output.value).toBeInstanceOf(ResourceAlreadyExistsError);
  });
});
