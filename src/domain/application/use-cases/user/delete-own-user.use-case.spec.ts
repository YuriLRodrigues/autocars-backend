import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { UserEntity } from '@root/domain/enterprise/entities/user.entity';
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryLikeAdvertisementRepository } from 'test/repositories/in-memory-like-advertisement-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { DeleteOwnUserUseCase } from './delete-own-user.use-case';

describe('Delete Own User - Use Case', () => {
  let sut: DeleteOwnUserUseCase;
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
    sut = new DeleteOwnUserUseCase(inMemoryUserRepository);
  });

  it('should be able to delete own user with correctly id', async () => {
    const user = UserEntity.create({
      avatar: 'Avatar 1',
      username: 'testUser',
      email: 'emailtest@example.com',
      name: 'TestUser',
      password: 'password',
    });
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({ id: user.id });

    expect(output.isRight()).toBe(true);
    expect(output.value).toBe(null);
  });

  it('should not be able to delete own user with invalid id', async () => {
    const output = await sut.execute({ id: new UniqueEntityId() });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
