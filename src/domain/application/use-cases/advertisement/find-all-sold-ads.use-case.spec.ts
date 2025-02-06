import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { SoldStatus } from '@root/domain/enterprise/entities/advertisement.entity';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { makeFakeAdvertisement } from 'test/factory/make-fake-advertisement';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryLikeAdvertisementRepository } from 'test/repositories/in-memory-like-advertisement-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { FindAllSoldsAdsUseCase } from './find-all-sold-ads.use-case';

describe('Find All Sold Ads - Use Case', () => {
  let sut: FindAllSoldsAdsUseCase;
  let inMemoryAdRepository: InMemoryAdvertisementRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryLikeAdvertisementRepository: InMemoryLikeAdvertisementRepository;
  let inMemoryImageRepository: InMemoryImageRepository;
  let inMemoryAddressRepository: InMemoryAddressRepository;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository(inMemoryAdRepository);
    inMemoryBrandRepository = new InMemoryBrandRepository();
    inMemoryImageRepository = new InMemoryImageRepository();
    inMemoryAddressRepository = new InMemoryAddressRepository();
    inMemoryLikeAdvertisementRepository = new InMemoryLikeAdvertisementRepository();
    inMemoryAdRepository = new InMemoryAdvertisementRepository(
      inMemoryBrandRepository,
      inMemoryLikeAdvertisementRepository,
      inMemoryUserRepository,
      inMemoryImageRepository,
      inMemoryAddressRepository,
    );
    sut = new FindAllSoldsAdsUseCase(inMemoryAdRepository, inMemoryUserRepository);
  });

  it('should be able do find all sold by user id with referenceDate', async () => {
    const user = makeFakeUser({ roles: [UserRoles.Seller] });
    inMemoryUserRepository.register({ user });

    Array.from({ length: 5 }).map(() => {
      const advertisement = makeFakeAdvertisement({
        createdAt: new Date(),
        userId: user.id,
        soldStatus: SoldStatus.Sold,
      });
      inMemoryAdRepository.createAd({ advertisement });
    });
    Array.from({ length: 5 }).map(() => {
      const advertisement = makeFakeAdvertisement({
        createdAt: new Date(),
        userId: user.id,
        soldStatus: SoldStatus.Active,
      });
      inMemoryAdRepository.createAd({ advertisement });
    });

    const output = await sut.execute({ userId: user.id, referenceDate: new Date().getMonth() + 1 });

    expect(output.isRight()).toBe(true);
    expect(output.value).toHaveLength(5);
    expect(output.value).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          price: expect.any(Number),
          updatedAt: expect.any(Date),
        }),
      ]),
    );
    expect(inMemoryAdRepository.advertisements).toHaveLength(10);
  });
  it('should not be able to find all sold if user not found and returns a error (User not found)', async () => {
    const output = await sut.execute({ userId: new UniqueEntityId(), referenceDate: new Date().getMonth() + 1 });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
  });
  it('should not be able to find all sold if user dont have seller role and returns a error (Not allowed)', async () => {
    const user = makeFakeUser({ roles: [UserRoles.Customer] });
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({ userId: user.id, referenceDate: new Date().getMonth() + 1 });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(NotAllowedError);
  });
});
