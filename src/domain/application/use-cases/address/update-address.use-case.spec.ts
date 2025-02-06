import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { makeFakeAddress } from 'test/factory/make-fake-address';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryLikeAdvertisementRepository } from 'test/repositories/in-memory-like-advertisement-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { UpdateAddressUseCase } from './update-address.use-case';

describe('Update Address - Use Case', () => {
  let sut: UpdateAddressUseCase;
  let inMemoryAddressRepository: InMemoryAddressRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryAdvertisementRepository: InMemoryAdvertisementRepository;
  let inMemoryLikeAdvertisementRepository: InMemoryLikeAdvertisementRepository;
  let inMemoryImageRepository: InMemoryImageRepository;

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

    sut = new UpdateAddressUseCase(inMemoryAddressRepository, inMemoryUserRepository);
  });

  it('should be able to edit your address if your user id exists and address already exists', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const address = makeFakeAddress({ userId: user.id });
    inMemoryAddressRepository.create({ address });

    const output = await sut.execute({
      userId: user.id,
      state: 'new state',
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toEqual(
      expect.objectContaining({
        state: 'new state',
      }),
    );
  });

  it('should not be able to edit your address if your user id not exists and should return the resource not found error', async () => {
    const output = await sut.execute({
      userId: new UniqueEntityId(),
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to edit a address if your user id exists but dont have address registred and should return the resource not found error', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({
      userId: user.id,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
