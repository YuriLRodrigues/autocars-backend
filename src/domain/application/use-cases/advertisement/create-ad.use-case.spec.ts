import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { AdvertisementImage } from '@root/domain/enterprise/value-object/advertisement-image';
import { AdvertisementThumbnail } from '@root/domain/enterprise/value-object/advertisement-thumbnail';
import { makeFakeAdvertisement } from 'test/factory/make-fake-advertisement';
import { makeFakeImage } from 'test/factory/make-fake-image';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { InMemoryAdvertisementImageRepository } from 'test/repositories/in-memory-advertisement-image-repository';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryAdvertisementThumbnailRepository } from 'test/repositories/in-memory-advertisement-thumbnail-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryLikeAdvertisementRepository } from 'test/repositories/in-memory-like-advertisement-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { CreateAdUseCase } from './create-ad.use-case';

describe('Create Advertisement - Use Case', () => {
  let sut: CreateAdUseCase;
  let inMemoryAdRepository: InMemoryAdvertisementRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryLikeAdvertisementRepository: InMemoryLikeAdvertisementRepository;
  let inMemoryImageRepository: InMemoryImageRepository;
  let inMemoryAddressRepository: InMemoryAddressRepository;
  let inMemoryAdvertisementImageRepository: InMemoryAdvertisementImageRepository;
  let inMemoryAdvertisementThumbnailRepository: InMemoryAdvertisementThumbnailRepository;

  beforeEach(() => {
    inMemoryAdvertisementImageRepository = new InMemoryAdvertisementImageRepository();
    inMemoryAdvertisementThumbnailRepository = new InMemoryAdvertisementThumbnailRepository();
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
    sut = new CreateAdUseCase(
      inMemoryAdRepository,
      inMemoryAdvertisementImageRepository,
      inMemoryAdvertisementThumbnailRepository,
      inMemoryUserRepository,
      inMemoryImageRepository,
    );
  });

  it('should be possible to create an new advertisement', async () => {
    const adminUser = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserRepository.register({ user: adminUser });

    const images = Array.from({ length: 5 }).map(() => {
      const image = makeFakeImage();
      inMemoryImageRepository.create({ image });

      return image;
    });

    const thumbnailImage = makeFakeImage({
      advertisementId: null,
    });
    inMemoryImageRepository.create({ image: thumbnailImage });

    const imagesIds = images.map((img) => img.id);

    const advertisementImages = images.map((img) =>
      AdvertisementImage.create({ advertisementId: null, imageId: img.id }),
    );
    inMemoryAdvertisementImageRepository.advertisementImages.push(...advertisementImages);

    const advertisementThumbnail = AdvertisementThumbnail.create({
      advertisementId: null,
      thumbnailId: thumbnailImage.id,
    });
    inMemoryAdvertisementThumbnailRepository.advertisementThumbnail.push(advertisementThumbnail);

    const advertisement = makeFakeAdvertisement({ title: 'Test advertisement', userId: adminUser.id });

    const output = await sut.execute({
      imagesIds,
      brandId: advertisement.brandId,
      capacity: advertisement.capacity,
      color: advertisement.color,
      description: advertisement.description,
      doors: advertisement.doors,
      fuel: advertisement.fuel,
      gearBox: advertisement.gearBox,
      km: advertisement.km,
      localization: advertisement.localization,
      model: advertisement.model,
      phone: advertisement.phone,
      price: advertisement.price,
      thumbnailImageId: thumbnailImage.id,
      title: advertisement.title,
      userId: adminUser.id,
      year: advertisement.year,
      details: advertisement.details,
    });

    if (output.isLeft()) return;

    expect(output.isRight()).toBe(true);
    expect(
      inMemoryAdvertisementImageRepository.advertisementImages.every((img) => img.advertisementId === output.value.id),
    ).toBeTruthy();
    expect(inMemoryAdvertisementThumbnailRepository.advertisementThumbnail[0].advertisementId).toEqual(output.value.id);
    expect(output.value).toEqual(expect.objectContaining({ title: 'Test advertisement' }));
    expect(inMemoryImageRepository.images).toHaveLength(6);
    expect(inMemoryAdvertisementThumbnailRepository.advertisementThumbnail[0]);
    expect(inMemoryAdRepository.advertisements).toHaveLength(1);
  });

  it('should not be possible to create an new advertisement if your user not exists (invalid-id)', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const images = Array.from({ length: 5 }).map(() => {
      const image = makeFakeImage();
      inMemoryImageRepository.create({ image });

      return image;
    });

    const imagesIds = images.map((img) => img.id);

    const advertisement = makeFakeAdvertisement({ title: 'Test advertisement' });

    const advertisementImages = images.map((img) =>
      AdvertisementImage.create({ advertisementId: advertisement.id, imageId: img.id }),
    );
    inMemoryAdvertisementImageRepository.advertisementImages.push(...advertisementImages);

    const imagesByAdvertisementId = inMemoryAdvertisementImageRepository.advertisementImages.filter((img) =>
      img.advertisementId.equals(advertisement.id),
    );

    const output = await sut.execute({
      imagesIds,
      brandId: advertisement.brandId,
      capacity: advertisement.capacity,
      color: advertisement.color,
      description: advertisement.description,
      doors: advertisement.doors,
      fuel: advertisement.fuel,
      gearBox: advertisement.gearBox,
      km: advertisement.km,
      localization: advertisement.localization,
      model: advertisement.model,
      phone: advertisement.phone,
      price: advertisement.price,
      thumbnailImageId: images[0].id,
      title: advertisement.title,
      userId: new UniqueEntityId(),
      year: advertisement.year,
      details: advertisement.details,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
    expect(imagesByAdvertisementId).toHaveLength(5);
  });

  it('should not be possible to create an new advertisement if your user is not manager or seller', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const images = Array.from({ length: 5 }).map(() => {
      const image = makeFakeImage();
      inMemoryImageRepository.create({ image });

      return image;
    });

    const imagesIds = images.map((img) => img.id);

    const advertisement = makeFakeAdvertisement({ title: 'Test advertisement', userId: user.id });

    const advertisementImages = images.map((img) =>
      AdvertisementImage.create({ advertisementId: advertisement.id, imageId: img.id }),
    );
    inMemoryAdvertisementImageRepository.advertisementImages.push(...advertisementImages);

    const imagesByAdvertisementId = inMemoryAdvertisementImageRepository.advertisementImages.filter((img) =>
      img.advertisementId.equals(advertisement.id),
    );

    const output = await sut.execute({
      imagesIds,
      brandId: advertisement.brandId,
      capacity: advertisement.capacity,
      color: advertisement.color,
      description: advertisement.description,
      doors: advertisement.doors,
      fuel: advertisement.fuel,
      gearBox: advertisement.gearBox,
      km: advertisement.km,
      localization: advertisement.localization,
      model: advertisement.model,
      phone: advertisement.phone,
      price: advertisement.price,
      thumbnailImageId: images[0].id,
      title: advertisement.title,
      userId: advertisement.userId,
      year: advertisement.year,
      details: advertisement.details,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(NotAllowedError);
    expect(imagesByAdvertisementId).toHaveLength(5);
  });

  it('should not be possible to create an new advertisement if thumbnailImageId not exists', async () => {
    const user = makeFakeUser({ roles: [UserRoles.Seller] });
    inMemoryUserRepository.register({ user });

    const images = Array.from({ length: 5 }).map(() => {
      const image = makeFakeImage();
      inMemoryImageRepository.create({ image });

      return image;
    });

    const imagesIds = images.map((img) => img.id);

    const advertisement = makeFakeAdvertisement({ title: 'Test advertisement', userId: user.id });

    const advertisementImages = images.map((img) =>
      AdvertisementImage.create({ advertisementId: advertisement.id, imageId: img.id }),
    );
    inMemoryAdvertisementImageRepository.advertisementImages.push(...advertisementImages);

    const imagesByAdvertisementId = inMemoryAdvertisementImageRepository.advertisementImages.filter((img) =>
      img.advertisementId.equals(advertisement.id),
    );

    const output = await sut.execute({
      imagesIds,
      brandId: advertisement.brandId,
      capacity: advertisement.capacity,
      color: advertisement.color,
      description: advertisement.description,
      doors: advertisement.doors,
      fuel: advertisement.fuel,
      gearBox: advertisement.gearBox,
      km: advertisement.km,
      localization: advertisement.localization,
      model: advertisement.model,
      phone: advertisement.phone,
      price: advertisement.price,
      thumbnailImageId: new UniqueEntityId(),
      title: advertisement.title,
      userId: advertisement.userId,
      year: advertisement.year,
      details: advertisement.details,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
    expect(imagesByAdvertisementId).toHaveLength(5);
  });
});
