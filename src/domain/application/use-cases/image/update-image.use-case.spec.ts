import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { readFileSync } from 'fs';
import { makeFakeAdvertisement } from 'test/factory/make-fake-advertisement';
import { makeFakeImage } from 'test/factory/make-fake-image';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryLikeAdvertisementRepository } from 'test/repositories/in-memory-like-advertisement-repository';
import { InMemoryUploaderRepository } from 'test/repositories/in-memory-uploader-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { UpdateImageUseCase } from './update-image.use-case';

describe('Update Image - Use Case', () => {
  let sut: UpdateImageUseCase;
  let inMemoryImageRepository: InMemoryImageRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryAdvertisementRepository: InMemoryAdvertisementRepository;
  let inMemoryLikeRepository: InMemoryLikeAdvertisementRepository;
  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryUploaderRepository: InMemoryUploaderRepository;
  let inMemoryAddressRepository: InMemoryAddressRepository;

  beforeEach(() => {
    inMemoryImageRepository = new InMemoryImageRepository();
    inMemoryAddressRepository = new InMemoryAddressRepository();
    inMemoryUploaderRepository = new InMemoryUploaderRepository();
    inMemoryBrandRepository = new InMemoryBrandRepository();
    inMemoryAdvertisementRepository = new InMemoryAdvertisementRepository(
      inMemoryBrandRepository,
      inMemoryLikeRepository,
      inMemoryUserRepository,
      inMemoryImageRepository,
      inMemoryAddressRepository,
    );
    inMemoryUserRepository = new InMemoryUserRepository(inMemoryAdvertisementRepository);
    sut = new UpdateImageUseCase(
      inMemoryImageRepository,
      inMemoryUploaderRepository,
      inMemoryUserRepository,
      inMemoryAdvertisementRepository,
    );
  });

  it('should be able to update an image by your correctly id', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const image = makeFakeImage({ advertisementId: advertisement.id });
    inMemoryImageRepository.create({ image });

    const adminUser = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserRepository.register({ user: adminUser });

    const imageBuffer = readFileSync('./images/image-buffer-test.png');

    const output = await sut.execute({
      advertisementId: advertisement.id,
      userId: adminUser.id,
      newImages: [
        {
          body: Buffer.from(imageBuffer),
          fileName: 'image-test',
          fileSize: 100,
          fileType: 'image/png',
        },
      ],
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toBe(null);
  });

  it('should not be able to delete an image if your user is not manager', async () => {
    const image = makeFakeImage();
    inMemoryImageRepository.create({ image });

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({
      advertisementId: image.id,
      userId: user.id,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to delete an image if image not exists', async () => {
    const user = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({
      advertisementId: new UniqueEntityId(),
      userId: user.id,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
