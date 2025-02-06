import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { makeFakeBrand } from 'test/factory/make-fake-brand';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryLikeAdvertisementRepository } from 'test/repositories/in-memory-like-advertisement-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { DeleteBrandUseCase } from './delete-brand.use-case';

describe('Delete Brand - Use Case', () => {
  let sut: DeleteBrandUseCase;
  let inMemoryAdRepository: InMemoryAdvertisementRepository;

  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryLikeRepository: InMemoryLikeAdvertisementRepository;
  let inMemoryImageRepository: InMemoryImageRepository;
  let inMemoryAddressRepository: InMemoryAddressRepository;

  beforeEach(() => {
    inMemoryBrandRepository = new InMemoryBrandRepository();
    inMemoryAddressRepository = new InMemoryAddressRepository();
    inMemoryUserRepository = new InMemoryUserRepository(inMemoryAdRepository);
    inMemoryLikeRepository = new InMemoryLikeAdvertisementRepository();
    inMemoryImageRepository = new InMemoryImageRepository();
    inMemoryAdRepository = new InMemoryAdvertisementRepository(
      inMemoryBrandRepository,
      inMemoryLikeRepository,
      inMemoryUserRepository,
      inMemoryImageRepository,
      inMemoryAddressRepository,
    );
    sut = new DeleteBrandUseCase(inMemoryBrandRepository, inMemoryUserRepository);
  });

  it(' should be possible to delete a tag if you are manager and brand exists', async () => {
    const brand = makeFakeBrand();
    inMemoryBrandRepository.create({ brand });

    const adminUser = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserRepository.register({ user: adminUser });

    const output = await sut.execute({
      id: brand.id,
      userId: adminUser.id,
    });

    expect(output.isRight()).toBe(true);
    expect(inMemoryBrandRepository.brands).toHaveLength(0);
  });

  it('should not be able to delete an brand if your id is invalid (non-existent)', async () => {
    const brand = makeFakeBrand();
    inMemoryBrandRepository.create({ brand });

    const adminUser = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserRepository.register({ user: adminUser });

    const output = await sut.execute({
      id: new UniqueEntityId(),
      userId: adminUser.id,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
    expect(inMemoryBrandRepository.brands).toHaveLength(1);
  });

  it('should not be able to delete an brand if your user is not manager', async () => {
    const brand = makeFakeBrand();
    inMemoryBrandRepository.create({ brand });

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({
      id: brand.id,
      userId: user.id,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(NotAllowedError);
    expect(inMemoryBrandRepository.brands).toHaveLength(1);
  });
});
