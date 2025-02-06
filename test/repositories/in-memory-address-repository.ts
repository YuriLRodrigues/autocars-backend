import { AsyncMaybe, Maybe } from '@root/core/logic/Maybe';
import {
  AddressRepository,
  CreateProps,
  FindByUserIdProps,
} from '@root/domain/application/repositories/address.repository';
import { AddressEntity } from '@root/domain/enterprise/entities/address.entity';

export class InMemoryAddressRepository implements AddressRepository {
  public addresses: AddressEntity[] = [];

  async create({ address }: CreateProps): Promise<void> {
    this.addresses.push(address);

    return;
  }

  async save({ address }: CreateProps): Promise<void> {
    const indexOfAddress = this.addresses.findIndex((ad) => ad.id.equals(address.id));

    if (indexOfAddress !== -1) {
      this.addresses[indexOfAddress] = address;
    }

    return;
  }

  async findByUserId({ id }: FindByUserIdProps): AsyncMaybe<AddressEntity> {
    const address = this.addresses.find((ad) => ad.userId.equals(id));

    if (!address) return Maybe.none();

    return Maybe.some(address);
  }
}
