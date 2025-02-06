import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ValueObject } from '@root/core/domain/value-object/value-object';
import { validateUsername } from '@root/utils/validate-username';

import { SoldStatus } from '../entities/advertisement.entity';

export type UserAdvertisementsProps = {
  user: {
    profileImg: string;
    username: string;
    id: UniqueEntityId;
  };
  advertisement: {
    createdAt: Date;
    id: UniqueEntityId;
    title: string;
    price: number;
    salePrice?: number;
    soldStatus: SoldStatus;
  };
};

export class UserAdvertisements extends ValueObject<UserAdvertisementsProps> {
  get user() {
    return this.props.user;
  }

  get advertisement() {
    return this.props.advertisement;
  }

  static create(props: UserAdvertisementsProps) {
    const userAdvertisement = new UserAdvertisements({
      advertisement: props.advertisement,
      user: {
        id: props.user.id,
        profileImg: props.user.profileImg,
        username: validateUsername(props.user.username),
      },
    });

    return userAdvertisement;
  }
}
