import { repeat } from '@root/utils/repeat';
import { makeFakeAdvertisement } from 'test/factory/make-fake-advertisement';
import { makeFakeBrand } from 'test/factory/make-fake-brand';
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryLikeAdvertisementRepository } from 'test/repositories/in-memory-like-advertisement-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { FindAllAdsUseCase } from './find-all-ads.use-case';

describe('Find All Advertisements - Use Case', () => {
  let sut: FindAllAdsUseCase;
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
    sut = new FindAllAdsUseCase(inMemoryAdRepository);
  });

  it('should be able to find all advertisements', async () => {
    const brand = makeFakeBrand();
    inMemoryBrandRepository.create({ brand });

    repeat(15, () => {
      const advertisement = makeFakeAdvertisement({ brandId: brand.id });
      inMemoryAdRepository.createAd({ advertisement });
    });

    const advertisement = makeFakeAdvertisement({ brandId: brand.id });
    inMemoryAdRepository.createAd({ advertisement });

    const output = await sut.execute({
      limit: 10,
      page: 1,
    });

    expect(output.isRight()).toBe(true);
    expect(inMemoryAdRepository.advertisements).toHaveLength(16);
    expect(output.value).toEqual(
      expect.objectContaining({
        meta: expect.objectContaining({
          page: 1,
          perPage: 10,
          totalPages: 2,
        }),
        data: expect.any(Array),
      }),
    );
  });

  it('should be able to return an lenght 0 if items not exist', async () => {
    const output = await sut.execute({
      limit: 10,
      page: 1,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toEqual(
      expect.objectContaining({
        data: [],
        meta: expect.objectContaining({
          page: 1,
          perPage: 10,
          totalPages: 0,
        }),
      }),
    );
  });
});
