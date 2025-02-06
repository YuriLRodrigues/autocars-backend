import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceAlreadyExistsError } from '@root/core/errors/resource-already-exists-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { makeFakeImage } from 'test/factory/make-fake-image';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryLikeAdvertisementRepository } from 'test/repositories/in-memory-like-advertisement-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { CreateBrandUseCase } from './create-brand.use-case';

describe('Create Brand - Use Case', () => {
  let sut: CreateBrandUseCase;
  let inMemoryAdRepository: InMemoryAdvertisementRepository;

  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryLikeRepository: InMemoryLikeAdvertisementRepository;
  let inMemoryImageRepository: InMemoryImageRepository;
  let inMemoryAddressRepository: InMemoryAddressRepository;

  beforeEach(() => {
    inMemoryBrandRepository = new InMemoryBrandRepository();
    inMemoryAddressRepository = new InMemoryAddressRepository();
    inMemoryUserRepository = new InMemoryUserRepository(inMemoryAdRepository);
    inMemoryLikeRepository = new InMemoryLikeAdvertisementRepository();
    inMemoryImageRepository = new InMemoryImageRepository();
    inMemoryAdRepository = new InMemoryAdvertisementRepository(
      inMemoryBrandRepository,
      inMemoryLikeRepository,
      inMemoryUserRepository,
      inMemoryImageRepository,
      inMemoryAddressRepository,
    );
    sut = new CreateBrandUseCase(inMemoryBrandRepository, inMemoryUserRepository, inMemoryImageRepository);
  });

  it('should be able to create an new brand', async () => {
    const image = makeFakeImage();
    inMemoryImageRepository.create({ image });

    const adminUser = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserRepository.register({ user: adminUser });

    const output = await sut.execute({
      userId: adminUser.id,
      logoId: image.id,
      name: 'Test',
    });

    expect(output.isRight()).toBe(true);
    expect(inMemoryBrandRepository.brands).toHaveLength(1);
  });

  it('should not be able to create an new brand if name already exists', async () => {
    const image = makeFakeImage();
    inMemoryImageRepository.create({ image });

    const adminUser = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserRepository.register({ user: adminUser });

    await sut.execute({
      logoId: image.id,
      name: 'Test',
      userId: adminUser.id,
    });

    const output = await sut.execute({
      userId: adminUser.id,
      logoId: image.id,
      name: 'Test',
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ResourceAlreadyExistsError);
    expect(inMemoryBrandRepository.brands).toHaveLength(1);
  });

  it('should not be able to create an new brand if user is not admin', async () => {
    const image = makeFakeImage();
    inMemoryImageRepository.create({ image });

    const user = makeFakeUser({ roles: [UserRoles.Customer] });
    inMemoryUserRepository.register({ user: user });

    await sut.execute({
      logoId: image.id,
      name: 'Test',
      userId: user.id,
    });

    const output = await sut.execute({
      userId: user.id,
      logoId: image.id,
      name: 'Test',
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(NotAllowedError);
    expect(inMemoryBrandRepository.brands).toHaveLength(0);
  });

  it('should not be able to create an new brand if user not exists', async () => {
    const image = makeFakeImage();
    inMemoryImageRepository.create({ image });

    const output = await sut.execute({
      userId: new UniqueEntityId(),
      logoId: image.id,
      name: 'Test',
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
    expect(inMemoryBrandRepository.brands).toHaveLength(0);
  });

  it('should not be able to create an new brand if image not exists', async () => {
    const user = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserRepository.register({ user: user });

    const output = await sut.execute({
      userId: user.id,
      logoId: new UniqueEntityId(),
      name: 'Test',
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
    expect(inMemoryBrandRepository.brands).toHaveLength(0);
  });
});
