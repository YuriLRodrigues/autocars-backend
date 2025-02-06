import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryLikeAdvertisementRepository } from 'test/repositories/in-memory-like-advertisement-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { HandleActiveUserUseCase } from './handle-active-user.use-case';

describe('Handle Active user - Use Case', () => {
  let sut: HandleActiveUserUseCase;
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
    sut = new HandleActiveUserUseCase(inMemoryUserRepository);
  });

  it('should be able to block an seller if you have Manager permission', async () => {
    const adminUser = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserRepository.register({ user: adminUser });

    const sellerUser = makeFakeUser({ roles: [UserRoles.Seller] });
    inMemoryUserRepository.register({ user: sellerUser });

    const output = await sut.execute({
      currentUserId: adminUser.id,
      sellerId: sellerUser.id,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toBe(null);
  });

  it('should not be able to block an seller if you not have Manager permission', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });
    const sellerUser = makeFakeUser({ roles: [UserRoles.Seller] });
    inMemoryUserRepository.register({ user: sellerUser });

    const output = await sut.execute({
      currentUserId: user.id,
      sellerId: sellerUser.id,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to find an user with invalid id (non-existent)', async () => {
    const adminUser = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserRepository.register({ user: adminUser });
    const sellerUser = makeFakeUser({ roles: [UserRoles.Seller] });
    inMemoryUserRepository.register({ user: sellerUser });

    const output = await sut.execute({
      currentUserId: adminUser.id,
      sellerId: new UniqueEntityId(),
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
