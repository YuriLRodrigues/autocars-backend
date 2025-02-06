import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { readFileSync } from 'fs';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryLikeAdvertisementRepository } from 'test/repositories/in-memory-like-advertisement-repository';
import { InMemoryUploaderRepository } from 'test/repositories/in-memory-uploader-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { ImageTypeError } from '../../errors/image-type-error';
import { UploadImageUseCase } from './upload-image.use-case';

describe('Upload And Create Image - Use Case', () => {
  let sut: UploadImageUseCase;
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
    sut = new UploadImageUseCase(inMemoryImageRepository, inMemoryUploaderRepository, inMemoryUserRepository);
  });

  it('should be able to create and upload an image', async () => {
    const adminUser = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserRepository.register({ user: adminUser });

    const imageBuffer = readFileSync('./images/image-buffer-test.png');

    const output = await sut.execute({
      userId: adminUser.id,
      images: [
        {
          body: Buffer.from(imageBuffer),
          fileName: 'test-image.png',
          fileType: 'image/png',
          fileSize: 100,
        },
      ],
    });

    expect(output.isRight()).toBe(true);
    expect(inMemoryImageRepository.images).toHaveLength(1);
  });

  it('should not be able to create and upload an image if your user is customer', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({
      userId: user.id,
      images: [
        {
          body: Buffer.from('buffer'),
          fileName: 'test-image.png',
          fileType: 'image/png',
          fileSize: 100,
        },
      ],
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(NotAllowedError);
    expect(inMemoryImageRepository.images).toHaveLength(0);
  });

  it('should not be able to create an image with an invalid type', async () => {
    const user = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({
      userId: user.id,
      images: [
        {
          body: Buffer.from('buffer'),
          fileName: 'test.html',
          fileType: 'test/html',
          fileSize: 100,
        },
      ],
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ImageTypeError);
  });
});
