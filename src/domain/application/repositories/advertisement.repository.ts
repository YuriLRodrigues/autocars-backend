import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { AsyncMaybe } from '@root/core/logic/Maybe';
import {
  AdvertisementEntity,
  Color,
  Fuel,
  Model,
  SoldStatus,
} from '@root/domain/enterprise/entities/advertisement.entity';
import { AdvertisementDetails } from '@root/domain/enterprise/value-object/advertisement-details';
import { ManagerAdvertisements } from '@root/domain/enterprise/value-object/manager-advertisements';
import { MinimalAdvertisementDetails } from '@root/domain/enterprise/value-object/minimal-advertisement-details';
import { OwnAdvertisements } from '@root/domain/enterprise/value-object/own-advertisements';
import { UserAdvertisements } from '@root/domain/enterprise/value-object/user-advertisements';

export type FindAllAdsProps = {
  page: number;
  limit: number;
  search?: {
    title?: string;
    soldStatus?: SoldStatus;
    fuel?: Fuel;
    color?: Color;
    model?: Model;
    price?: number;
    year?: number;
    createdAt?: 'asc' | 'desc';
    brandId?: UniqueEntityId;
    km?: number;
  };
};

export type FindAllAdsByUserIdProps = {
  page: number;
  limit: number;
  userId: UniqueEntityId;
  search?: {
    title?: string;
    soldStatus?: SoldStatus;
    price?: number;
    sellerName?: string;
  };
};

export type SearchAdsProps = {
  title?: string;
  soldStatus?: SoldStatus;
  price?: number;
  createdAt?: 'asc' | 'desc';
  startDate?: Date | string;
  endDate?: Date | string;
  brandId?: UniqueEntityId;
};

export type FindAllOwnAdsProps = {
  page: number;
  limit: number;
  userId: UniqueEntityId;
  search?: SearchAdsProps;
};

export type FindAllManagerAdsProps = {
  page: number;
  limit: number;
  search?: SearchAdsProps;
};

export type FindAdByIdProps = {
  id: UniqueEntityId;
};

export type CreateAdProps = {
  advertisement: AdvertisementEntity;
};

export type DeleteAdProps = {
  advertisementId: UniqueEntityId;
};

export type SaveAdProps = {
  advertisement: AdvertisementEntity;
};

export type FindMetricsByUserId = {
  userId: UniqueEntityId;
};

export type FindAllSoldAds = {
  userId: UniqueEntityId;
  referenceDate: number;
  isManager: boolean;
};

export abstract class AdvertisementRepository {
  abstract findAdById({ id }: FindAdByIdProps): AsyncMaybe<AdvertisementEntity>;
  abstract findAdDetailsById({ id }: FindAdByIdProps): AsyncMaybe<AdvertisementDetails>;

  abstract createAd({ advertisement }: CreateAdProps): AsyncMaybe<AdvertisementEntity>;

  abstract deleteAd({ advertisementId }: DeleteAdProps): AsyncMaybe<void>;

  abstract saveAd({ advertisement }: SaveAdProps): AsyncMaybe<void>;

  abstract findAllAds({
    page,
    limit,
    search,
  }: FindAllAdsProps): AsyncMaybe<PaginatedResult<MinimalAdvertisementDetails[]>>;

  abstract findAllAdsByUserId({
    page,
    limit,
    search,
    userId,
  }: FindAllAdsByUserIdProps): AsyncMaybe<PaginatedResult<UserAdvertisements[]>>;

  abstract findAllOwnAds({ page, limit, search }: FindAllOwnAdsProps): AsyncMaybe<PaginatedResult<OwnAdvertisements[]>>;

  abstract findAllManagerAds({
    page,
    limit,
    search,
  }: FindAllManagerAdsProps): AsyncMaybe<PaginatedResult<ManagerAdvertisements[]>>;

  abstract findMetricsByUserId({ userId }: FindMetricsByUserId): AsyncMaybe<{
    activesAdvertisements: number;
    reservedAdvertisements: number;
    soldAdvertisements: number;
    totalAdvertisements: number;
  }>;

  abstract findMetrics(): AsyncMaybe<{
    activesAdvertisements: number;
    reservedAdvertisements: number;
    soldAdvertisements: number;
    totalSellers: number;
    totalManagers: number;
    totalAdvertisements: number;
  }>;

  abstract findAllSoldAds({ referenceDate, userId, isManager }: FindAllSoldAds): AsyncMaybe<
    {
      salePrice?: number;
      price: number;
      updatedAt: Date;
    }[]
  >;
}
