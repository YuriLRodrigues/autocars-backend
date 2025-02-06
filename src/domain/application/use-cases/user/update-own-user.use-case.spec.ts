import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { UserEntity, UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { FakeEncrypter } from 'test/encrypter';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryLikeAdvertisementRepository } from 'test/repositories/in-memory-like-advertisement-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { UpdateOwnUserUseCase } from './update-own-user.use-case';

describe('Update User Info - Use Case', () => {
  let sut: UpdateOwnUserUseCase;
  let inMemoryUserRepository: InMemoryUserRepository;

  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryAdvertisementRepository: InMemoryAdvertisementRepository;
  let inMemoryLikeAdvertisementRepository: InMemoryLikeAdvertisementRepository;
  let inMemoryImageRepository: InMemoryImageRepository;
  let inMemoryAddressRepository: InMemoryAddressRepository;
  let inMemoryEncrypterRepository: FakeEncrypter;

  const user = makeFakeUser();

  beforeEach(() => {
    inMemoryEncrypterRepository = new FakeEncrypter();
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
    sut = new UpdateOwnUserUseCase(inMemoryUserRepository, inMemoryEncrypterRepository);
    inMemoryUserRepository.register({ user });
  });

  it('should be able to update a user with your correctly id', async () => {
    const output = await sut.execute({
      id: user.id,
      avatar: 'new avatar',
      name: 'New Name',
      username: 'new_username',
    });

    expect(output.isRight()).toBe(true);

    if (output.isRight()) {
      expect(JSON.parse(output.value)).toEqual(
        expect.objectContaining({
          sub: user.id.toValue(),
          roles: [UserRoles.Customer],
          name: 'New Name',
          username: 'new_username',
          email: user.email,
        }),
      );
    }
  });

  it('should not be able to update a user with invalid id', async () => {
    const output = await sut.execute({
      id: new UniqueEntityId(),
      avatar: 'new avatar',
      name: 'New Name',
      username: 'new_username',
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).not.toBeInstanceOf(UserEntity);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
