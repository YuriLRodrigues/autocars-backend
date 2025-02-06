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

import { FindAllTopSellersUseCase } from './find-all-top-sellers.use-case';

describe('Find All Top Sellers - Use Case', () => {
  let sut: FindAllTopSellersUseCase;
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
    inMemoryUserRepository = new InMemoryUserRepository(inMemoryAdvertisementRepository);

    sut = new FindAllTopSellersUseCase(inMemoryUserRepository);
  });

  it('should be able do find all top sellers in crescent order ', async () => {
    const firstUser = makeFakeUser({ roles: [UserRoles.Seller], name: 'User 1' });
    inMemoryUserRepository.register({ user: firstUser });

    Array.from({ length: 5 }).map(() => {
      const advertisement = makeFakeAdvertisement({
        userId: firstUser.id,
        soldStatus: SoldStatus.Sold,
      });
      inMemoryAdvertisementRepository.createAd({ advertisement });
    });

    const secondUser = makeFakeUser({ roles: [UserRoles.Seller, UserRoles.Manager], name: 'User 2' });
    inMemoryUserRepository.register({ user: secondUser });

    Array.from({ length: 10 }).map(() => {
      const advertisement = makeFakeAdvertisement({
        userId: secondUser.id,
        soldStatus: SoldStatus.Sold,
      });
      inMemoryAdvertisementRepository.createAd({ advertisement });
    });

    const output = await sut.execute({
      userId: secondUser.id,
    });

    expect(output.isRight()).toBe(true);
    expect(inMemoryAdvertisementRepository.advertisements).toHaveLength(15);
  });
});
