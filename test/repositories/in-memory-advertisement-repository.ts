import { PaginatedResult } from '@root/core/dto/paginated-result';
import { AsyncMaybe, Maybe } from '@root/core/logic/Maybe';
import {
  AdvertisementRepository,
  CreateAdProps,
  DeleteAdProps,
  FindAdByIdProps,
  FindAllAdsByUserIdProps,
  FindAllAdsProps,
  FindAllManagerAdsProps,
  FindAllOwnAdsProps,
  FindAllSoldAds,
  FindMetricsByUserId,
  SaveAdProps,
} from '@root/domain/application/repositories/advertisement.repository';
import {
  AdvertisementEntity,
  Capacity,
  Color,
  Doors,
  Fuel,
  GearBox,
  Model,
} from '@root/domain/enterprise/entities/advertisement.entity';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { AdvertisementDetails } from '@root/domain/enterprise/value-object/advertisement-details';
import { ManagerAdvertisements } from '@root/domain/enterprise/value-object/manager-advertisements';
import { MinimalAdvertisementDetails } from '@root/domain/enterprise/value-object/minimal-advertisement-details';
import { OwnAdvertisements } from '@root/domain/enterprise/value-object/own-advertisements';
import { UserAdvertisements } from '@root/domain/enterprise/value-object/user-advertisements';

import { InMemoryAddressRepository } from './in-memory-address-repository';
import { InMemoryBrandRepository } from './in-memory-brand-repository';
import { InMemoryImageRepository } from './in-memory-image-repository';
import { InMemoryLikeAdvertisementRepository } from './in-memory-like-advertisement-repository';
import { InMemoryUserRepository } from './in-memory-user-repository';

export class InMemoryAdvertisementRepository implements AdvertisementRepository {
  constructor(
    private readonly inMemoryBrandRepository: InMemoryBrandRepository,
    private readonly inMemoryLikeAdvertisementRepository: InMemoryLikeAdvertisementRepository,
    private readonly inMemoryUserRepository: InMemoryUserRepository,
    private readonly inMemoryImageRepository: InMemoryImageRepository,
    private readonly inMemoryAddressRepository: InMemoryAddressRepository,
  ) {}

  public advertisements: AdvertisementEntity[] = [];

  async createAd({ advertisement }: CreateAdProps): AsyncMaybe<AdvertisementEntity> {
    this.advertisements.push(advertisement);

    return Maybe.some(advertisement);
  }

  async findAllAdsByUserId({
    userId,
    page,
    limit,
  }: FindAllAdsByUserIdProps): AsyncMaybe<PaginatedResult<UserAdvertisements[]>> {
    const user = this.inMemoryUserRepository.users.find((user) => user.id.toValue() === userId.toValue());

    const advertisements = this.advertisements.filter((ad) => ad.userId.toValue() === userId.toValue());

    const minimalData = advertisements.map((ad) => {
      return UserAdvertisements.create({
        advertisement: {
          createdAt: ad.createdAt,
          id: ad.id,
          price: ad.price,
          soldStatus: ad.soldStatus,
          title: ad.title,
          salePrice: ad.salePrice,
        },
        user: {
          id: user.id,
          profileImg: user.avatar,
          username: user.username,
        },
      });
    });

    const advertisementsPaginated = minimalData.slice((page - 1) * limit, limit * page);

    return Maybe.some({
      data: advertisementsPaginated,
      meta: {
        page,
        perPage: limit,
        totalPages: Math.ceil(minimalData.length / limit),
        totalCount: minimalData.length,
      },
    });
  }

  async findAllOwnAds({
    page,
    limit,
    userId,
    search,
  }: FindAllOwnAdsProps): AsyncMaybe<PaginatedResult<OwnAdvertisements[]>> {
    const advertisements = this.advertisements.filter((ad) => {
      if (!ad.userId.equals(userId)) return false;

      if (search?.title && !ad.title.toLowerCase().includes(search.title.toLowerCase())) return false;

      if (search?.price && ad.price > search.price) return false;

      if (search?.soldStatus && ad.soldStatus !== search.soldStatus) return false;

      if (search?.startDate && ad.createdAt.getTime() < new Date(search?.startDate).getTime()) return false;

      if (search?.endDate && ad.createdAt.getTime() > new Date(search?.endDate).getTime()) return false;

      if (search?.brandId && !ad.brandId.equals(search.brandId)) return false;

      return true;
    });

    if (search?.createdAt) {
      const orderDirection = search.createdAt === 'asc' ? 1 : -1;

      advertisements.sort((a, b) => {
        if (a.createdAt < b.createdAt) return -orderDirection;

        if (a.createdAt > b.createdAt) return orderDirection;

        return 0;
      });
    }

    const paginatedAds = advertisements.slice((page - 1) * limit, page * limit);

    const ownAdvertisements = paginatedAds.map((ad) => {
      const adThumbnail = this.inMemoryImageRepository.images.find((img) => img.advertisementId.equals(ad.id));
      const brand = this.inMemoryBrandRepository.brands.find((brand) => brand.id.equals(ad.brandId));

      return OwnAdvertisements.create({
        blurHash: adThumbnail.blurHash,
        createdAt: ad.createdAt,
        thumbnailUrl: adThumbnail.url,
        id: ad.id,
        price: ad.price,
        salePrice: ad.salePrice,
        soldStatus: ad.soldStatus,
        title: ad.title,
        brand,
      });
    });

    return Maybe.some({
      data: ownAdvertisements,
      meta: {
        page,
        perPage: limit,
        totalPages: Math.ceil(advertisements.length / limit),
        totalCount: advertisements.length,
      },
    });
  }

  async findAllManagerAds({
    page,
    limit,
    search,
  }: FindAllManagerAdsProps): AsyncMaybe<PaginatedResult<ManagerAdvertisements[]>> {
    const advertisements = this.advertisements.filter((ad) => {
      if (search?.title && !ad.title.toLowerCase().includes(search.title.toLowerCase())) return false;

      if (search?.price && ad.price > search.price) return false;

      if (search?.soldStatus && ad.soldStatus !== search.soldStatus) return false;

      if (search?.startDate && ad.createdAt.getTime() < new Date(search?.startDate).getTime()) return false;

      if (search?.endDate && ad.createdAt.getTime() > new Date(search?.endDate).getTime()) return false;

      if (search?.brandId && !ad.brandId.equals(search.brandId)) return false;

      return true;
    });

    if (search?.createdAt) {
      const orderDirection = search.createdAt === 'asc' ? 1 : -1;

      advertisements.sort((a, b) => {
        if (a.createdAt < b.createdAt) return -orderDirection;

        if (a.createdAt > b.createdAt) return orderDirection;

        return 0;
      });
    }

    const paginatedAds = advertisements.slice((page - 1) * limit, page * limit);

    const managerAdvertisements = paginatedAds.map((ad) => {
      const adThumbnail = this.inMemoryImageRepository.images.find((img) => img.advertisementId.equals(ad.id));
      const brand = this.inMemoryBrandRepository.brands.find((brand) => brand.id.equals(ad.brandId));
      const user = this.inMemoryUserRepository.users.find((user) => user.id.equals(ad.userId));

      return ManagerAdvertisements.create({
        blurHash: adThumbnail.blurHash,
        createdAt: ad.createdAt,
        thumbnailUrl: adThumbnail.url,
        id: ad.id,
        price: ad.price,
        salePrice: ad.salePrice,
        soldStatus: ad.soldStatus,
        title: ad.title,
        brand,
        user,
      });
    });

    return Maybe.some({
      data: managerAdvertisements,
      meta: {
        page,
        perPage: limit,
        totalPages: Math.ceil(advertisements.length / limit),
        totalCount: advertisements.length,
      },
    });
  }

  async findAllAds({
    page,
    limit,
    search,
  }: FindAllAdsProps): AsyncMaybe<PaginatedResult<MinimalAdvertisementDetails[]>> {
    const filteredData = this.advertisements.filter((ad) => {
      if (search?.color && ad.color !== search.color) return false;

      const brand = this.inMemoryBrandRepository.brands.find((brand) => brand.id.equals(ad.brandId));

      if (!brand) return false;

      if (search?.brandId && !brand.id.equals(search?.brandId)) return false;

      if (search?.fuel && ad.fuel !== search?.fuel) return false;

      if (search?.km && ad.km > +search?.km) return false;

      if (search?.model && ad.model !== search?.model) return false;

      if (search?.price && ad.price > +search?.price) return false;

      if (search?.color && ad.color !== search?.color) return false;

      if (search?.year && ad.year !== +search?.year) return false;

      if (search?.soldStatus && ad.soldStatus !== search?.soldStatus) return false;

      if (search?.title && !ad.title.toLowerCase().includes(search?.title?.toLowerCase())) return false;

      return true;
    });

    const sortedData = filteredData.sort((a, b) => {
      if (search?.createdAt.includes('asc')) return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

      if (search?.createdAt.includes('desc')) return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

      return;
    });

    const minimalData = sortedData.map((ad) => {
      const brand = this.inMemoryBrandRepository.brands.find((brand) => brand.id.equals(ad.brandId));

      const likes = this.inMemoryLikeAdvertisementRepository.advertisementLikes.filter((adLike) =>
        ad.id.equals(adLike.id),
      );

      const adThumbnail = this.inMemoryImageRepository.images.find((image) => image.blurHash);

      if (!adThumbnail) return null;

      return MinimalAdvertisementDetails.create({
        advertisementId: ad.id,
        title: ad.title,
        price: ad.price,
        km: ad.km,
        capacity: ad.capacity,
        doors: ad.doors,
        fuel: ad.fuel,
        gearBox: ad.gearBox,
        brand: {
          brandId: brand.id,
          logoUrl: brand.logoUrl,
          name: brand.name,
        },
        thumbnailUrl: ad.thumbnailUrl,
        blurHash: adThumbnail.blurHash,
        likes,
      });
    });

    const advertisementsPaginated = minimalData.slice((page - 1) * limit, limit * page);

    return Maybe.some({
      data: advertisementsPaginated,
      meta: {
        page,
        perPage: limit,
        totalPages: Math.ceil(minimalData.length / limit) || 0,
        totalCount: minimalData.length,
      },
    });
  }

  async findAdById({ id }: FindAdByIdProps): AsyncMaybe<AdvertisementEntity> {
    const ad = this.advertisements.find((ad) => ad.id === id);

    if (!ad) return Maybe.none();

    const adDetails = AdvertisementEntity.create(
      {
        title: ad.title,
        price: ad.price,
        km: ad.km,
        capacity: Capacity[ad.capacity],
        doors: Doors[ad.doors],
        fuel: Fuel[ad.fuel],
        gearBox: GearBox[ad.gearBox],
        color: Color[ad.color],
        model: Model[ad.model],
        soldStatus: ad.soldStatus,
        salePrice: ad.salePrice,
        year: ad.year,
        description: ad.description,
        details: ad.details,
        phone: ad.phone,
        localization: ad.localization,
        brandId: ad.brandId,
        thumbnailUrl: ad.thumbnailUrl,
        userId: ad.userId,
        createdAt: ad.createdAt,
        updatedAt: ad.updatedAt,
      },
      ad.id,
    );

    return Maybe.some(adDetails);
  }

  async findAdDetailsById({ id }: FindAdByIdProps): AsyncMaybe<AdvertisementDetails> {
    const ad = this.advertisements.find((ad) => ad.id === id);

    if (!ad) return Maybe.none();

    const { value: user } = await this.inMemoryUserRepository.findById({ id: ad.userId });

    if (!user) return Maybe.none();

    const { value: address } = await this.inMemoryAddressRepository.findByUserId({ id: user.id });

    if (!address) return Maybe.none();

    const { value: brand } = await this.inMemoryBrandRepository.findById({ id: ad.brandId });

    if (!brand) return Maybe.none();

    const { value: images } = await this.inMemoryImageRepository.findManyByAdId({ id: ad.id });

    const adDetails = AdvertisementDetails.create({
      title: ad.title,
      price: ad.price,
      km: ad.km,
      capacity: Capacity[ad.capacity],
      doors: Doors[ad.doors],
      fuel: Fuel[ad.fuel],
      gearBox: GearBox[ad.gearBox],
      color: Color[ad.color],
      model: Model[ad.model],
      soldStatus: ad.soldStatus,
      salePrice: ad.salePrice,
      year: ad.year,
      description: ad.description,
      details: ad.details,
      phone: ad.phone,
      localization: ad.localization,
      brand: {
        brandId: brand.id,
        logoUrl: brand.logoUrl,
        name: brand.name,
      },
      images: images,
      user: {
        id: user.id,
        name: user.name,
        address: {
          street: address.street,
          city: address.city,
          zipCode: address.zipCode,
        },
      },
      createdAt: ad.createdAt,
      updatedAt: ad.updatedAt,
    });

    return Maybe.some(adDetails);
  }

  async findMetricsByUserId({ userId }: FindMetricsByUserId): AsyncMaybe<{
    activesAdvertisements: number;
    reservedAdvertisements: number;
    soldAdvertisements: number;
    totalAdvertisements: number;
  }> {
    const user = await this.inMemoryUserRepository.findById({ id: userId });

    if (!user) return Maybe.none();

    const activesAdvertisements = this.advertisements.filter(
      (ad) => ad.userId.toValue() === userId.toValue() && ad.soldStatus === 'Active',
    ).length;

    const reservedAdvertisements = this.advertisements.filter(
      (ad) => ad.userId.toValue() === userId.toValue() && ad.soldStatus === 'Reserved',
    ).length;

    const soldAdvertisements = this.advertisements.filter(
      (ad) => ad.soldStatus === 'Sold' && ad.userId.toValue() === userId.toValue(),
    ).length;

    const totalAdvertisements = this.advertisements.filter((ad) => ad.userId.equals(userId)).length;

    return Maybe.some({
      activesAdvertisements,
      reservedAdvertisements,
      soldAdvertisements,
      totalAdvertisements,
    });
  }

  async findMetrics(): AsyncMaybe<{
    activesAdvertisements: number;
    reservedAdvertisements: number;
    soldAdvertisements: number;
    totalSellers: number;
    totalManagers: number;
    totalAdvertisements: number;
  }> {
    const activesAdvertisements = this.advertisements.filter((ad) => ad.soldStatus === 'Active').length;

    const reservedAdvertisements = this.advertisements.filter((ad) => ad.soldStatus === 'Reserved').length;

    const soldAdvertisements = this.advertisements.filter((ad) => ad.soldStatus === 'Sold').length;

    const totalSellers = this.inMemoryUserRepository.users.filter((user) =>
      user.roles.includes(UserRoles.Seller),
    ).length;

    const totalAdvertisements = this.advertisements.length;

    const totalManagers = this.inMemoryUserRepository.users.filter((user) =>
      user.roles.includes(UserRoles.Manager),
    ).length;

    return Maybe.some({
      activesAdvertisements,
      reservedAdvertisements,
      soldAdvertisements,
      totalSellers,
      totalManagers,
      totalAdvertisements,
    });
  }

  async findAllSoldAds({ referenceDate, userId }: FindAllSoldAds): AsyncMaybe<
    {
      price: number;
      updatedAt: Date;
    }[]
  > {
    const soldAds = this.advertisements.filter((ad) => ad.soldStatus === 'Sold' && ad.userId.equals(userId));

    const filteredAds = soldAds.filter((ad) => new Date(ad.createdAt).getMonth() === referenceDate - 1);

    const mappedAds = filteredAds.map((ad) => {
      return {
        price: ad.salePrice || ad.price,
        updatedAt: ad.updatedAt,
      };
    });

    return Maybe.some(mappedAds);
  }

  async deleteAd({ advertisementId }: DeleteAdProps): AsyncMaybe<void> {
    this.advertisements = this.advertisements.filter((ad) => !ad.id.equals(advertisementId));

    return;
  }

  async saveAd({ advertisement }: SaveAdProps): AsyncMaybe<void> {
    const index = this.advertisements.findIndex((ad) => ad.id.equals(advertisement.id));
    this.advertisements[index] = advertisement;

    return;
  }
}
