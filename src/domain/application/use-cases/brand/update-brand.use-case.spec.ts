import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { makeFakeBrand } from 'test/factory/make-fake-brand';
import { makeFakeImage } from 'test/factory/make-fake-image';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryLikeAdvertisementRepository } from 'test/repositories/in-memory-like-advertisement-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { UpdateBrandUseCase } from './update-brand.use-case';

describe('Update Brand - Use Case', () => {
  let sut: UpdateBrandUseCase;
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
    inMemoryImageRepository = new InMemoryImageRepository();
    sut = new UpdateBrandUseCase(inMemoryBrandRepository, inMemoryUserRepository, inMemoryImageRepository);
  });

  it('should be possible to update an brand if it exists', async () => {
    const image = makeFakeImage();
    inMemoryImageRepository.create({ image });

    const brand = makeFakeBrand();
    inMemoryBrandRepository.create({ brand });

    const adminUser = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserRepository.register({ user: adminUser });

    const output = await sut.execute({
      id: brand.id,
      userId: adminUser.id,
      logoId: image.id,
      name: 'New Brand Name',
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toBe(null);
  });

  it('should not be able to update an brand if your id is invalid (non-existent) ', async () => {
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
  });

  it('should not be able to update an brand if your user is not manager', async () => {
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
  });
});
