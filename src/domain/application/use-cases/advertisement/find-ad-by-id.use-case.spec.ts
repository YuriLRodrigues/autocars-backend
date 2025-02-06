import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { AdvertisementDetails } from '@root/domain/enterprise/value-object/advertisement-details';
import { makeFakeAddress } from 'test/factory/make-fake-address';
import { makeFakeAdvertisement } from 'test/factory/make-fake-advertisement';
import { makeFakeBrand } from 'test/factory/make-fake-brand';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryLikeAdvertisementRepository } from 'test/repositories/in-memory-like-advertisement-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { FindAdByIdUseCase } from './find-ad-by-id.use-case';

describe('Find Advertisement - Use Case', () => {
  let sut: FindAdByIdUseCase;
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
    sut = new FindAdByIdUseCase(inMemoryAdRepository);
  });

  it('should be able to find an advertisement by id', async () => {
    const user = makeFakeUser({ roles: [UserRoles.Manager, UserRoles.Seller] });
    inMemoryUserRepository.register({ user });

    const address = makeFakeAddress({ userId: user.id });
    inMemoryAddressRepository.create({ address });

    const brand = makeFakeBrand();
    inMemoryBrandRepository.create({ brand });

    const advertisement = makeFakeAdvertisement({ userId: user.id, brandId: brand.id });
    inMemoryAdRepository.createAd({ advertisement });

    const output = await sut.execute({ id: advertisement.id });

    expect(output.isRight()).toBe(true);
    expect(output.value).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          id: user.id,
          name: user.name,
          address: expect.objectContaining({
            street: address.street,
            city: address.city,
            zipCode: address.zipCode,
          }),
        }),
        brand: expect.objectContaining({ brandId: brand.id, name: brand.name }),
      }),
    );
    expect(output.value).toBeInstanceOf(AdvertisementDetails);
    expect(inMemoryAdRepository.advertisements).toHaveLength(1);
  });

  it('should not be able to find an advertisement by invalid id (non-existent)', async () => {
    const output = await sut.execute({ id: new UniqueEntityId() });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
