import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { repeat } from '@root/utils/repeat';
import { makeFakeAdvertisement } from 'test/factory/make-fake-advertisement';
import { makeFakeImage } from 'test/factory/make-fake-image';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryLikeAdvertisementRepository } from 'test/repositories/in-memory-like-advertisement-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { FindImagesMetricsUseCase } from './find-images-metrics.use-case';

describe('Find Images Metrics - Use Case', () => {
  let sut: FindImagesMetricsUseCase;
  let inMemoryImageRepository: InMemoryImageRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryAdvertisementRepository: InMemoryAdvertisementRepository;
  let inMemoryLikeRepository: InMemoryLikeAdvertisementRepository;
  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryAddressRepository: InMemoryAddressRepository;

  beforeEach(() => {
    inMemoryImageRepository = new InMemoryImageRepository();
    inMemoryBrandRepository = new InMemoryBrandRepository();
    inMemoryAdvertisementRepository = new InMemoryAdvertisementRepository(
      inMemoryBrandRepository,
      inMemoryLikeRepository,
      inMemoryUserRepository,
      inMemoryImageRepository,
      inMemoryAddressRepository,
    );
    inMemoryUserRepository = new InMemoryUserRepository(inMemoryAdvertisementRepository);
    sut = new FindImagesMetricsUseCase(inMemoryImageRepository, inMemoryUserRepository);
  });

  it('should be able to find images metrics', async () => {
    repeat(2, () => {
      const advertisement = makeFakeAdvertisement();
      inMemoryAdvertisementRepository.createAd({ advertisement });

      const image = makeFakeImage({ advertisementId: advertisement.id, isThumbnail: false });
      inMemoryImageRepository.create({ image });
    });

    repeat(2, () => {
      const advertisement = makeFakeAdvertisement();
      inMemoryAdvertisementRepository.createAd({ advertisement });

      const image = makeFakeImage({ advertisementId: null, isThumbnail: false });
      inMemoryImageRepository.create({ image });
    });

    repeat(2, () => {
      const advertisement = makeFakeAdvertisement();
      inMemoryAdvertisementRepository.createAd({ advertisement });

      const image = makeFakeImage({ advertisementId: null, isThumbnail: true });
      inMemoryImageRepository.create({ image });
    });

    const adminUser = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserRepository.register({ user: adminUser });

    const output = await sut.execute({
      userId: adminUser.id,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toEqual(
      expect.objectContaining({
        totalCount: 6,
        totalInAdvertisements: 2,
        totalThumbnails: 2,
        totalUnused: 2,
      }),
    );
  });

  it('should not be able to find images metrics if your user is not manager', async () => {
    const image = makeFakeImage();
    inMemoryImageRepository.create({ image });

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({
      userId: user.id,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(NotAllowedError);
  });
});
