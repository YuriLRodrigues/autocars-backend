import { makeFakeAdvertisement } from 'test/factory/make-fake-advertisement';
import { makeFakeFavorite } from 'test/factory/make-fake-favorite';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryFavoriteRepository } from 'test/repositories/in-memory-favorite-repository';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryLikeAdvertisementRepository } from 'test/repositories/in-memory-like-advertisement-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { FindDistinctFavoritesCountUseCase } from './find-distinct-favorites-count';

describe('Find Favorites Count - Use Case', () => {
  let sut: FindDistinctFavoritesCountUseCase;
  let inMemoryAdvertisementRepository: InMemoryAdvertisementRepository;
  let inMemoryLikeAdvertisementRepository: InMemoryLikeAdvertisementRepository;
  let inMemoryFavoriteRepository: InMemoryFavoriteRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryImageRepository: InMemoryImageRepository;
  let inMemoryAddressRepository: InMemoryAddressRepository;

  beforeEach(() => {
    inMemoryImageRepository = new InMemoryImageRepository();
    inMemoryAddressRepository = new InMemoryAddressRepository();
    inMemoryUserRepository = new InMemoryUserRepository(inMemoryAdvertisementRepository);
    inMemoryBrandRepository = new InMemoryBrandRepository();
    inMemoryLikeAdvertisementRepository = new InMemoryLikeAdvertisementRepository();
    inMemoryAdvertisementRepository = new InMemoryAdvertisementRepository(
      inMemoryBrandRepository,
      inMemoryLikeAdvertisementRepository,
      inMemoryUserRepository,
      inMemoryImageRepository,
      inMemoryAddressRepository,
    );
    inMemoryFavoriteRepository = new InMemoryFavoriteRepository(
      inMemoryAdvertisementRepository,
      inMemoryUserRepository,
      inMemoryImageRepository,
    );
    sut = new FindDistinctFavoritesCountUseCase(inMemoryFavoriteRepository);
  });

  it('should be able to find total count of distinct favorites', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository.createAd({ advertisement });

    Array.from({ length: 10 }, () => {
      const user = makeFakeUser();
      inMemoryUserRepository.register({ user });
      const favorite = makeFakeFavorite({ advertisementId: advertisement.id, userId: user.id });
      inMemoryFavoriteRepository.favorites.push(favorite);
    });

    const output = await sut.execute();

    expect(output.isRight()).toBe(true);
    expect(output.value).toEqual(1);
    expect(inMemoryFavoriteRepository.favorites).toHaveLength(10);
  });
});
