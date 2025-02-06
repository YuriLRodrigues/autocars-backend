import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
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

import { FindFavoritesCountByAdvertisementUseCase } from './find-favorites-count-by-advertisement';

describe('Find Favorites Count By Advertisement - Use Case', () => {
  let sut: FindFavoritesCountByAdvertisementUseCase;
  let inMemoryAdvertisementRepository: InMemoryAdvertisementRepository;
  let inMemoryLikeAdvertisementRepository: InMemoryLikeAdvertisementRepository;
  let inMemoryFavoriteRepository: InMemoryFavoriteRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryImageRepository: InMemoryImageRepository;
  let inMemoryAddressRepository: InMemoryAddressRepository;

  beforeEach(() => {
    inMemoryAddressRepository = new InMemoryAddressRepository();
    inMemoryImageRepository = new InMemoryImageRepository();
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
    sut = new FindFavoritesCountByAdvertisementUseCase(inMemoryFavoriteRepository, inMemoryAdvertisementRepository);
  });

  it('should be able to find total count of favorites by ad', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository.createAd({ advertisement });

    Array.from({ length: 10 }, () => {
      const user = makeFakeUser();
      inMemoryUserRepository.register({ user });
      const favorite = makeFakeFavorite({ advertisementId: advertisement.id, userId: user.id });
      inMemoryFavoriteRepository.favorites.push(favorite);
    });

    Array.from({ length: 10 }, () => {
      const favorite = makeFakeFavorite();
      inMemoryFavoriteRepository.favorites.push(favorite);
    });

    const output = await sut.execute({
      advertisementId: advertisement.id,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toEqual(10);
    expect(inMemoryFavoriteRepository.favorites).toHaveLength(20);
  });

  it('should not be able to find total count of favorites by ad if ad not exists', async () => {
    const output = await sut.execute({
      advertisementId: new UniqueEntityId(),
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
    expect(inMemoryFavoriteRepository.favorites).toHaveLength(0);
  });
});
