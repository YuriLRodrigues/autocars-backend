import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { makeFakeAdvertisement } from 'test/factory/make-fake-advertisement';
import { makeFakeFavorite } from 'test/factory/make-fake-favorite';
import { makeFakeImage } from 'test/factory/make-fake-image';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryFavoriteRepository } from 'test/repositories/in-memory-favorite-repository';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryLikeAdvertisementRepository } from 'test/repositories/in-memory-like-advertisement-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { FindAllFavoritesByUserIdUseCase } from './find-all-favorites-by-user-id.use-case';

describe('Find All Favorites By User Id - Use Case', () => {
  let sut: FindAllFavoritesByUserIdUseCase;
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
    sut = new FindAllFavoritesByUserIdUseCase(inMemoryFavoriteRepository, inMemoryUserRepository);
  });

  it('should be able to find all favorites by user id', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const favorite = makeFakeFavorite({ advertisementId: advertisement.id, userId: user.id });
    inMemoryFavoriteRepository.favorites.push(favorite);

    const imageThumb = makeFakeImage({ advertisementId: advertisement.id, isThumbnail: true });
    inMemoryImageRepository.create({ image: imageThumb });

    const output = await sut.execute({ userId: user.id, limit: 10, page: 1 });

    expect(output.isRight()).toBe(true);
    expect(output.value).toEqual(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({
            advertisement: expect.objectContaining({
              id: advertisement.id,
            }),
          }),
        ]),
        meta: {
          page: 1,
          perPage: 10,
          totalPages: 1,
          totalCount: 1,
        },
      }),
    );
    expect(inMemoryFavoriteRepository.favorites).toHaveLength(1);
  });

  it('should be able to return an empty array if user not any favorite ', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({ userId: user.id, limit: 10, page: 1 });

    expect(output.isRight()).toBe(true);
    expect(output.value).toEqual(
      expect.objectContaining({
        data: [],
        meta: {
          page: 1,
          perPage: 10,
          totalPages: 0,
          totalCount: 0,
        },
      }),
    );
    expect(inMemoryFavoriteRepository.favorites).toHaveLength(0);
  });

  it('should not be able to find all favorites by user id if user not exists', async () => {
    const output = await sut.execute({ userId: new UniqueEntityId(), limit: 10, page: 1 });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
