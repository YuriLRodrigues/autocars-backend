import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
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

import { FindMetricsByUserIdUseCase } from './find-metrics-by-user-id.use-case';

describe('Find Metrics By User Id - Use Case', () => {
  let sut: FindMetricsByUserIdUseCase;
  let inMemoryAdvertisementRepository: InMemoryAdvertisementRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryLikeAdvertisementRepository: InMemoryLikeAdvertisementRepository;
  let inMemoryImageRepository: InMemoryImageRepository;
  let inMemoryAddressRepository: InMemoryAddressRepository;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository(inMemoryAdvertisementRepository);
    inMemoryBrandRepository = new InMemoryBrandRepository();
    inMemoryImageRepository = new InMemoryImageRepository();
    inMemoryAddressRepository = new InMemoryAddressRepository();
    inMemoryLikeAdvertisementRepository = new InMemoryLikeAdvertisementRepository();
    inMemoryAdvertisementRepository = new InMemoryAdvertisementRepository(
      inMemoryBrandRepository,
      inMemoryLikeAdvertisementRepository,
      inMemoryUserRepository,
      inMemoryImageRepository,
      inMemoryAddressRepository,
    );
    sut = new FindMetricsByUserIdUseCase(inMemoryAdvertisementRepository, inMemoryUserRepository);
  });

  it('should be able do find all metrics of advertisemnt by user id', async () => {
    const user = makeFakeUser({ roles: [UserRoles.Seller] });
    inMemoryUserRepository.register({ user });

    Array.from({ length: 5 }).map(() => {
      const advertisement = makeFakeAdvertisement({
        userId: user.id,
        soldStatus: SoldStatus.Active,
      });
      inMemoryAdvertisementRepository.createAd({ advertisement });
    });
    Array.from({ length: 3 }).map(() => {
      const advertisement = makeFakeAdvertisement({
        userId: user.id,
        soldStatus: SoldStatus.Reserved,
      });
      inMemoryAdvertisementRepository.createAd({ advertisement });
    });
    Array.from({ length: 2 }).map(() => {
      const advertisement = makeFakeAdvertisement({
        userId: user.id,
        soldStatus: SoldStatus.Sold,
      });
      inMemoryAdvertisementRepository.createAd({ advertisement });
    });

    const metrics = await sut.execute({ userId: user.id });

    expect(metrics.isRight()).toBe(true);
    expect(metrics.value).toEqual(
      expect.objectContaining({
        activesAdvertisements: 5,
        reservedAdvertisements: 3,
        soldAdvertisements: 2,
      }),
    );
    expect(inMemoryAdvertisementRepository.advertisements).toHaveLength(10);
  });
  it('should not be able to find all metrics of advertisemnt if user not found and returns a error (User not found)', async () => {
    const output = await sut.execute({ userId: new UniqueEntityId() });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toEqual(new ResourceNotFoundError());
  });
});
