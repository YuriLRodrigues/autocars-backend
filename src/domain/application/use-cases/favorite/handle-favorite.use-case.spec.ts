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

import { HandleFavoriteUseCase } from './handle-favorite.use-case';

describe('Handle Favorite - Use Case', () => {
  let sut: HandleFavoriteUseCase;
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
    sut = new HandleFavoriteUseCase(
      inMemoryFavoriteRepository,
      inMemoryAdvertisementRepository,
      inMemoryUserRepository,
    );
  });

  it('should be able to add an advertisement to favorites', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({ advertisementId: advertisement.id, userId: user.id });

    expect(output.isRight()).toBe(true);
    expect(inMemoryFavoriteRepository.favorites[0].advertisementId.toValue()).toEqual(advertisement.id.toValue());
    expect(inMemoryFavoriteRepository.favorites).toHaveLength(1);
  });

  it('should be able to remove an advertisement to favorites if advertisement already in favorites', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const favorite = makeFakeFavorite({ advertisementId: advertisement.id, userId: user.id });
    inMemoryFavoriteRepository.favorites.push(favorite);

    expect(inMemoryFavoriteRepository.favorites[0].advertisementId.toValue()).toEqual(advertisement.id.toValue());
    expect(inMemoryFavoriteRepository.favorites).toHaveLength(1);

    const output = await sut.execute({ advertisementId: advertisement.id, userId: user.id });

    expect(output.isRight()).toBe(true);
    expect(inMemoryFavoriteRepository.favorites).toHaveLength(0);
    expect(output.value).toEqual(false);
  });

  it('should not be able to handle favorites if advertisement not exists', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({ advertisementId: new UniqueEntityId(), userId: user.id });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to handle favorites if advertisement not exists', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const output = await sut.execute({ advertisementId: advertisement.id, userId: new UniqueEntityId() });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
