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

import { DeleteUserUseCase } from './delete-user.use-case';

describe('Delete User - Use Case', () => {
  let sut: DeleteUserUseCase;
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
    sut = new DeleteUserUseCase(inMemoryUserRepository);
  });

  it('should be able to delete any user if you have the manager permission', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const adminUser = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserRepository.register({ user: adminUser });

    const output = await sut.execute({
      currentUserId: adminUser.id,
      userId: user.id,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toBe(null);
    expect(inMemoryUserRepository.users).toHaveLength(1);
  });

  it('should not be able to delete any user if you not have the manager permission', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const sellerUser = makeFakeUser({ roles: [UserRoles.Seller] });
    inMemoryUserRepository.register({ user: sellerUser });

    const output = await sut.execute({
      currentUserId: sellerUser.id,
      userId: user.id,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(NotAllowedError);
    expect(inMemoryUserRepository.users).toHaveLength(2);
  });

  it('should not be able to delete any user if id is invalid (non-existent)', async () => {
    const adminUser = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserRepository.register({ user: adminUser });

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({
      currentUserId: adminUser.id,
      userId: new UniqueEntityId(),
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
    expect(inMemoryUserRepository.users).toHaveLength(2);
  });
});
