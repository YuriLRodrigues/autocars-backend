import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { InvalidCredentialsError } from '@root/core/errors/invalid-credentials-error';
import { UserEntity, UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { FakeHash } from 'test/cryptography';
import { FakeEncrypter } from 'test/encrypter';
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryLikeAdvertisementRepository } from 'test/repositories/in-memory-like-advertisement-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { Encrypter } from '../../cryptography/encrypter';
import { AuthorizationUserUseCase } from './authorization-user.use-case';

describe('Authorization User - Use Case', () => {
  let sut: AuthorizationUserUseCase;
  let fakeHash: FakeHash;
  let fakeCryptography: Encrypter;
  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryAdvertisementRepository: InMemoryAdvertisementRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryLikeAdvertisementRepository: InMemoryLikeAdvertisementRepository;
  let inMemoryImageRepository: InMemoryImageRepository;
  let inMemoryAddressRepository: InMemoryAddressRepository;

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
    fakeHash = new FakeHash();
    fakeCryptography = new FakeEncrypter();

    sut = new AuthorizationUserUseCase(inMemoryUserRepository, fakeHash, fakeCryptography);

    const user = UserEntity.create(
      {
        username: 'testUser',
        email: 'emailtest@example.com',
        name: 'TestUser',
        password: 'password',
      },
      new UniqueEntityId('123'),
    );

    inMemoryUserRepository.register({ user });
  });

  it('should be able to authorize the user to log in to the application and return the token', async () => {
    const output = await sut.execute({
      email: 'emailtest@example.com',
      password: 'password',
    });

    expect(output.isRight()).toBe(true);

    if (output.isRight()) {
      expect(JSON.parse(output.value)).toEqual(
        expect.objectContaining({
          sub: '123',
          roles: [UserRoles.Customer],
          name: 'TestUser',
          username: 'testUser',
          email: 'emailtest@example.com',
        }),
      );
    }
  });

  it('should not be able to authorize the user to log in to the application with invalid email or password and should return the authorization error', async () => {
    const output = await sut.execute({
      email: 'invalid-email-test@example.com',
      password: 'invalid-password',
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(InvalidCredentialsError);
  });
});
