import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { repeat } from '@root/utils/repeat';
import { makeFakeAddress } from 'test/factory/make-fake-address';
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

import { UpdateSalePriceUseCase } from './update-sale-price.use-case';

describe('Update SalePrice - Use Case', () => {
  let sut: UpdateSalePriceUseCase;
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
    sut = new UpdateSalePriceUseCase(inMemoryAdvertisementRepository, inMemoryUserRepository);
  });

  it('should be able to update the sale price', async () => {
    const user = makeFakeUser({ roles: [UserRoles.Customer] });
    inMemoryUserRepository.register({ user });

    const address = makeFakeAddress({ userId: user.id });
    inMemoryAddressRepository.create({ address });

    const brand = makeFakeBrand();
    inMemoryBrandRepository.create({ brand });

    const advertisement = makeFakeAdvertisement({ price: 1000, userId: user.id, brandId: brand.id });
    inMemoryAdvertisementRepository.createAd({ advertisement });

    repeat(5, () => {
      const image = makeFakeImage({ advertisementId: advertisement.id });
      inMemoryImageRepository.create({ image });
    });

    const imageThumb = makeFakeImage({ isThumbnail: true, advertisementId: advertisement.id });
    inMemoryImageRepository.create({ image: imageThumb });

    const newImageThumb = makeFakeImage({ isThumbnail: true, advertisementId: advertisement.id });
    inMemoryImageRepository.create({ image: newImageThumb });

    const output = await sut.execute({
      id: advertisement.id,
      userId: user.id,
      salePrice: 10000,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toBe(null);
    expect(inMemoryAdvertisementRepository.advertisements[0]).toEqual(
      expect.objectContaining({
        salePrice: 10000,
        price: 1000,
      }),
    );
  });

  it('should not be able to update the sale price with invalidId', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const advertisement = makeFakeAdvertisement({ title: 'Old Title', userId: user.id });
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const output = await sut.execute({
      id: new UniqueEntityId(),
      salePrice: 10000,
      userId: user.id,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to update the sale price with invalid userId (non-existent)', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const advertisement = makeFakeAdvertisement({ title: 'Old Title' });
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const output = await sut.execute({
      id: advertisement.id,
      salePrice: 10000,
      userId: new UniqueEntityId(),
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not possible to update a the sale price if you are not the manager or owner of the ad', async () => {
    const userNotOwner = makeFakeUser({ roles: [UserRoles.Customer] });
    inMemoryUserRepository.register({ user: userNotOwner });

    const user = makeFakeUser({ roles: [UserRoles.Customer] });
    inMemoryUserRepository.register({ user });

    const address = makeFakeAddress({ userId: user.id });
    inMemoryAddressRepository.create({ address });

    const brand = makeFakeBrand();
    inMemoryBrandRepository.create({ brand });

    const advertisement = makeFakeAdvertisement({ title: 'Old Title', userId: user.id, brandId: brand.id });
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const output = await sut.execute({
      id: advertisement.id,
      salePrice: 10000,
      userId: userNotOwner.id,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(NotAllowedError);
  });
});
