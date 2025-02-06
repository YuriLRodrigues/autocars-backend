import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
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

import { FindAllAdvertisementLikesUseCase } from './find-all-advertisement-likes.use-case';

describe('Find All Advertisement Likes - Use Case', () => {
  let sut: FindAllAdvertisementLikesUseCase;
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
    inMemoryLikeAdvertisementRepository = new InMemoryLikeAdvertisementRepository();
    inMemoryUserRepository = new InMemoryUserRepository(inMemoryAdvertisementRepository);
    inMemoryAdvertisementRepository = new InMemoryAdvertisementRepository(
      inMemoryBrandRepository,
      inMemoryLikeAdvertisementRepository,
      inMemoryUserRepository,
      inMemoryImageRepository,
      inMemoryAddressRepository,
    );
    sut = new FindAllAdvertisementLikesUseCase(inMemoryLikeAdvertisementRepository, inMemoryAdvertisementRepository);
  });

  it('should be able to find all likes of a advertisement by your id', async () => {
    const user = makeFakeUser({ roles: [UserRoles.Manager, UserRoles.Seller] });
    inMemoryUserRepository.register({ user });

    const address = makeFakeAddress({ userId: user.id });
    inMemoryAddressRepository.create({ address });

    const brand = makeFakeBrand();
    inMemoryBrandRepository.create({ brand });

    const advertisement = makeFakeAdvertisement({ userId: user.id, brandId: brand.id });
    inMemoryAdvertisementRepository.createAd({ advertisement });

    Array.from({ length: 5 }).map(() => {
      const like = makeFakeLike({ advertisementId: advertisement.id });
      inMemoryLikeAdvertisementRepository.create({ like });
    });

    Array.from({ length: 5 }).map(() => {
      const like = makeFakeLike();
      inMemoryLikeAdvertisementRepository.create({ like });
    });

    const output = await sut.execute({
      advertisementId: advertisement.id,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toBe(5);
    expect(inMemoryLikeAdvertisementRepository.advertisementLikes).toHaveLength(10);
  });

  it('should not be able to find all likes of a feedback if your id is invalid (non-existent)', async () => {
    const output = await sut.execute({
      advertisementId: new UniqueEntityId(),
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
