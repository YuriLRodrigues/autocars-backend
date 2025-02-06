import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ValueObject } from '@root/core/domain/value-object/value-object';
import { validateUsername } from '@root/utils/validate-username';

import { UserRoles } from '../entities/user.entity';

export type MeProps = {
  user: {
    blurHash?: string;
    avatar?: string;
    email: string;
    username: string;
    name: string;
    id: UniqueEntityId;
    roles: UserRoles[];
  };
  address: {
    id: UniqueEntityId;
    street: string;
    city: string;
    state: string;
    zipCode: number;
    country: string;
    neighborhood: string;
  };
};

export class Me extends ValueObject<MeProps> {
  get user() {
    return this.props.user;
  }

  get address() {
    return this.props.address;
  }

  static create(props: MeProps) {
    const userAdvertisement = new Me({
      user: {
        blurHash: props.user.blurHash,
        avatar: props.user.avatar,
        email: props.user.email,
        name: props.user.name,
        username: validateUsername(props.user.username),
        roles: props.user.roles,
        id: props.user.id,
      },
      address: {
        id: props.address.id,
        street: props.address.street,
        city: props.address.city,
        state: props.address.state,
        zipCode: props.address.zipCode,
        country: props.address.country,
        neighborhood: props.address.neighborhood,
      },
    });

    return userAdvertisement;
  }
}
