import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { AsyncMaybe } from '@root/core/logic/Maybe';
import { BrandEntity } from '@root/domain/enterprise/entities/brand.entity';

export type FindByIdProps = {
  id: UniqueEntityId;
};

export type CreateProps = {
  brand: BrandEntity;
};

export type DeleteProps = {
  brandId: UniqueEntityId;
};

export type SaveProps = {
  brand: BrandEntity;
};

export type FindByNameProps = {
  name: string;
};

export type FindAllProps = {
  limit?: number;
  page?: number;
};

export abstract class BrandRepository {
  abstract findById({ id }: FindByIdProps): AsyncMaybe<BrandEntity>;
  abstract findByName({ name }: FindByNameProps): AsyncMaybe<BrandEntity>;
  abstract create({ brand }: CreateProps): AsyncMaybe<BrandEntity>;
  abstract delete({ brandId }: DeleteProps): AsyncMaybe<void>;
  abstract save({ brand }: SaveProps): AsyncMaybe<void>;
  abstract findAll({ limit, page }: FindAllProps): AsyncMaybe<PaginatedResult<BrandEntity[]>>;
}
