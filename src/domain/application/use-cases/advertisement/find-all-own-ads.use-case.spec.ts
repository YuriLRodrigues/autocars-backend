import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { repeat } from '@root/utils/repeat';
import { makeFakeAdvertisement } from 'test/factory/make-fake-advertisement';
import { makeFakeBrand } from 'test/factory/make-fake-brand';
import { makeFakeImage } from 'test/factory/make-fake-image';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryLikeAdvertisementRepository } from 'test/repositories/in-memory-like-advertisement-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { FindAllOwnAdsUseCase } from './find-all-own-ads.use-case';

describe('Find All Own Advertisements - Use Case', () => {
  let sut: FindAllOwnAdsUseCase;
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
    sut = new FindAllOwnAdsUseCase(inMemoryAdRepository, inMemoryUserRepository);
  });

  it('should be able to find all own advertisements ', async () => {
    const brand = makeFakeBrand();
    inMemoryBrandRepository.create({ brand });

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const advertisement = makeFakeAdvertisement({ userId: user.id, brandId: brand.id });
    inMemoryAdRepository.createAd({ advertisement });

    repeat(5, () => {
      const image = makeFakeImage({ advertisementId: advertisement.id });
      inMemoryImageRepository.create({ image });
    });

    const imageThumb = makeFakeImage({ isThumbnail: true, advertisementId: advertisement.id });
    inMemoryImageRepository.create({ image: imageThumb });

    const output = await sut.execute({
      userId: user.id,
      limit: 2,
      page: 1,
    });

    expect(output.isRight()).toBe(true);
    expect(inMemoryAdRepository.advertisements).toHaveLength(1);
    expect(output.value).toEqual(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({
            id: advertisement.id,
          }),
        ]),
        meta: expect.objectContaining({
          page: 1,
          perPage: 2,
          totalPages: 1,
          totalCount: 1,
        }),
      }),
    );
  });

  it('should not be able to find all own advertisements if your id is invalid (non-existent)', async () => {
    const output = await sut.execute({
      userId: new UniqueEntityId(),
      limit: 2,
      page: 1,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should be able to return an lenght 0 if items not exist', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({
      userId: user.id,
      limit: 10,
      page: 1,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toEqual(
      expect.objectContaining({
        data: [],
        meta: { page: 1, perPage: 10, totalPages: 0, totalCount: 0 },
      }),
    );
  });
});
