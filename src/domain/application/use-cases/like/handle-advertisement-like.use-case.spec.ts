import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { LikeEntity } from '@root/domain/enterprise/entities/like.entity';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { makeFakeAddress } from 'test/factory/make-fake-address';
import { makeFakeAdvertisement } from 'test/factory/make-fake-advertisement';
import { makeFakeBrand } from 'test/factory/make-fake-brand';
import { makeFakeLike } from 'test/factory/make-fake-like';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryLikeAdvertisementRepository } from 'test/repositories/in-memory-like-advertisement-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { HandleAdvertisementLikeUseCase } from './handle-advertisement-like.use-case';

describe('Handle Advertisement Like - Use Case', () => {
  let sut: HandleAdvertisementLikeUseCase;
  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryAdvertisementRepository: InMemoryAdvertisementRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryLikeAdvertisementRepository: InMemoryLikeAdvertisementRepository;
  let inMemoryAddressRepository: InMemoryAddressRepository;
  let inMemoryImageRepository: InMemoryImageRepository;

  beforeEach(() => {
    inMemoryBrandRepository = new InMemoryBrandRepository();
    inMemoryAddressRepository = new InMemoryAddressRepository();
    inMemoryImageRepository = new InMemoryImageRepository();
    inMemoryUserRepository = new InMemoryUserRepository(inMemoryAdvertisementRepository);
    inMemoryLikeAdvertisementRepository = new InMemoryLikeAdvertisementRepository();
    inMemoryAdvertisementRepository = new InMemoryAdvertisementRepository(
      inMemoryBrandRepository,
      inMemoryLikeAdvertisementRepository,
      inMemoryUserRepository,
      inMemoryImageRepository,
      inMemoryAddressRepository,
    );
    sut = new HandleAdvertisementLikeUseCase(
      inMemoryLikeAdvertisementRepository,
      inMemoryUserRepository,
      inMemoryAdvertisementRepository,
    );
  });

  it('should be able create a new like to a advertisement if already exists', async () => {
    const user = makeFakeUser({ roles: [UserRoles.Manager, UserRoles.Seller] });
    inMemoryUserRepository.register({ user });

    const address = makeFakeAddress({ userId: user.id });
    inMemoryAddressRepository.create({ address });

    const brand = makeFakeBrand();
    inMemoryBrandRepository.create({ brand });

    const advertisement = makeFakeAdvertisement({ userId: user.id, brandId: brand.id });
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const output = await sut.execute({
      advertisementId: advertisement.id,
      userId: user.id,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toBeInstanceOf(LikeEntity);
    expect(inMemoryLikeAdvertisementRepository.advertisementLikes).toHaveLength(1);
    expect(inMemoryLikeAdvertisementRepository.advertisementLikes[0]).toEqual(
      expect.objectContaining({
        advertisementId: advertisement.id,
        userId: user.id,
      }),
    );
  });

  it('should not be able create a new like to a advertisement if advertisementId is invalid (non-existent)', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({
      advertisementId: new UniqueEntityId(),
      userId: user.id,
    });

    expect(output.isLeft()).toBe(true);
    expect(inMemoryLikeAdvertisementRepository.advertisementLikes).toHaveLength(0);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should be able to remove the like if user already liked advertisement', async () => {
    const user = makeFakeUser({ roles: [UserRoles.Manager, UserRoles.Seller] });
    inMemoryUserRepository.register({ user });

    const address = makeFakeAddress({ userId: user.id });
    inMemoryAddressRepository.create({ address });

    const brand = makeFakeBrand();
    inMemoryBrandRepository.create({ brand });

    const advertisement = makeFakeAdvertisement({ userId: user.id, brandId: brand.id });
    inMemoryAdvertisementRepository.createAd({ advertisement });

    inMemoryLikeAdvertisementRepository.advertisementLikes.push(
      makeFakeLike({ userId: user.id, advertisementId: advertisement.id }),
    );

    const output = await sut.execute({
      advertisementId: advertisement.id,
      userId: user.id,
    });

    expect(output.isRight()).toBe(true);
    expect(inMemoryLikeAdvertisementRepository.advertisementLikes).toHaveLength(0);
    expect(output.value).toEqual(null);
  });
});
