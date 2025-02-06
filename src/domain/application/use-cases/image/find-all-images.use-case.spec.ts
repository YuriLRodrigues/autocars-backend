import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { repeat } from '@root/utils/repeat';
import { makeFakeImage } from 'test/factory/make-fake-image';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryLikeAdvertisementRepository } from 'test/repositories/in-memory-like-advertisement-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { FindAllImagesUseCase } from './find-all-images.use-case';

describe('Find All Images - Use Case', () => {
  let sut: FindAllImagesUseCase;
  let inMemoryImageRepository: InMemoryImageRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryAdvertisementRepository: InMemoryAdvertisementRepository;
  let inMemoryLikeRepository: InMemoryLikeAdvertisementRepository;
  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryAddressRepository: InMemoryAddressRepository;

  beforeEach(() => {
    inMemoryImageRepository = new InMemoryImageRepository();
    inMemoryAddressRepository = new InMemoryAddressRepository();
    inMemoryBrandRepository = new InMemoryBrandRepository();
    inMemoryAdvertisementRepository = new InMemoryAdvertisementRepository(
      inMemoryBrandRepository,
      inMemoryLikeRepository,
      inMemoryUserRepository,
      inMemoryImageRepository,
      inMemoryAddressRepository,
    );
    inMemoryUserRepository = new InMemoryUserRepository(inMemoryAdvertisementRepository);
    sut = new FindAllImagesUseCase(inMemoryImageRepository, inMemoryUserRepository);
  });

  it('should be able to find all images', async () => {
    repeat(10, () => {
      const image = makeFakeImage();
      inMemoryImageRepository.create({ image });
    });

    const adminUser = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserRepository.register({ user: adminUser });

    const output = await sut.execute({
      limit: 2,
      page: 1,
      userId: adminUser.id,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toEqual({
      data: inMemoryImageRepository.images.slice(0, 2),
      meta: {
        page: 1,
        perPage: 2,
        totalPages: 5,
        totalCount: 10,
      },
    });
    expect(inMemoryImageRepository.images).toHaveLength(10);
  });

  it('should not be able to delete an image if your user is not manager', async () => {
    const image = makeFakeImage();
    inMemoryImageRepository.create({ image });

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({
      limit: 10,
      page: 1,
      userId: user.id,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(NotAllowedError);
  });
});
