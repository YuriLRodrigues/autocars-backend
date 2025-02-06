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

import { FindAdvertisementIsLikedUseCase } from './find-advertisement-is-liked.use-case';

describe('Find Advertisement Is Liked - Use Case', () => {
  let sut: FindAdvertisementIsLikedUseCase;
  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryAdvertisementRepository: InMemoryAdvertisementRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryLikeAdvertisementRepository: InMemoryLikeAdvertisementRepository;
  let inMemoryAddressRepository: InMemoryAddressRepository;
  let inMemoryImageRepository: InMemoryImageRepository;

  beforeEach(() => {
    inMemoryBrandRepository = new InMemoryBrandRepository();
    inMemoryImageRepository = new InMemoryImageRepository();
    inMemoryAddressRepository = new InMemoryAddressRepository();
    inMemoryLikeAdvertisementRepository = new InMemoryLikeAdvertisementRepository();
    inMemoryUserRepository = new InMemoryUserRepository(inMemoryAdvertisementRepository);
    inMemoryAdvertisementRepository = new InMemoryAdvertisementRepository(
      inMemoryBrandRepository,
      inMemoryLikeAdvertisementRepository,
      inMemoryUserRepository,
      inMemoryImageRepository,
      inMemoryAddressRepository,
    );
    sut = new FindAdvertisementIsLikedUseCase(
      inMemoryLikeAdvertisementRepository,
      inMemoryUserRepository,
      inMemoryAdvertisementRepository,
    );
  });

  it('should validate that the user has already liked the ad and value should return true', async () => {
    const user = makeFakeUser({ roles: [UserRoles.Manager, UserRoles.Seller] });
    inMemoryUserRepository.register({ user });

    const address = makeFakeAddress({ userId: user.id });
    inMemoryAddressRepository.create({ address });

    const brand = makeFakeBrand();
    inMemoryBrandRepository.create({ brand });

    const advertisement = makeFakeAdvertisement({ userId: user.id, brandId: brand.id });
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const like = makeFakeLike({ advertisementId: advertisement.id, userId: user.id });
    inMemoryLikeAdvertisementRepository.create({ like });

    const output = await sut.execute({
      advertisementId: advertisement.id,
      userId: user.id,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toBe(true);
    expect(inMemoryLikeAdvertisementRepository.advertisementLikes).toHaveLength(1);
    expect(inMemoryLikeAdvertisementRepository.advertisementLikes[0]).toEqual(
      expect.objectContaining({
        advertisementId: advertisement.id,
        userId: user.id,
      }),
    );
  });

  it('should validate that the user has not liked the ad and value should return false', async () => {
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
    expect(output.value).toBe(false);
    expect(inMemoryLikeAdvertisementRepository.advertisementLikes).toHaveLength(0);
  });
});
