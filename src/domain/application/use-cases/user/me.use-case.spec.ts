import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { makeFakeAddress } from 'test/factory/make-fake-address';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { MeUseCase } from './me.use-case';

describe('Me - Use Case', () => {
  let sut: MeUseCase;
  let inMemoryAdvertisementRepository: InMemoryAdvertisementRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryImageRepository: InMemoryImageRepository;
  let inMemoryAddressRepository: InMemoryAddressRepository;

  beforeEach(() => {
    inMemoryImageRepository = new InMemoryImageRepository();
    inMemoryAddressRepository = new InMemoryAddressRepository();
    inMemoryUserRepository = new InMemoryUserRepository(inMemoryAdvertisementRepository);

    sut = new MeUseCase(inMemoryUserRepository, inMemoryAddressRepository, inMemoryImageRepository);
  });

  it('should be able to get my profile info', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const address = makeFakeAddress({ userId: user.id });
    inMemoryAddressRepository.create({ address });

    const output = await sut.execute({ id: user.id });

    expect(output.isRight()).toBe(true);

    if (output.isRight()) {
      expect(output.value.address).toEqual(
        expect.objectContaining({
          street: address.street,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          country: address.country,
        }),
      );
      expect(output.value.user).toEqual(
        expect.objectContaining({
          email: user.email,
          username: user.username,
          id: user.id,
          avatar: user.avatar,
        }),
      );
    }
  });

  it('should not be able to get my profile info if user not exists', async () => {
    const output = await sut.execute({ id: new UniqueEntityId() });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to get my profile info if address not exists', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({ id: user.id });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
