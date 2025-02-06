import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { AsyncMaybe } from '@root/core/logic/Maybe';
import { AddressEntity } from '@root/domain/enterprise/entities/address.entity';

export type CreateProps = {
  address: AddressEntity;
};

export type FindByUserIdProps = {
  id: UniqueEntityId;
};

export abstract class AddressRepository {
  abstract create({ address }: CreateProps): Promise<void>;
  abstract save({ address }: CreateProps): Promise<void>;
  abstract findByUserId({ id }: FindByUserIdProps): AsyncMaybe<AddressEntity>;
}
