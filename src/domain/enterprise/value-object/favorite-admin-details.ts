import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ValueObject } from '@root/core/domain/value-object/value-object';

import { SoldStatus } from '../entities/advertisement.entity';

export type FavoriteAdminDetailsProps = {
  id: UniqueEntityId;
  advertisement: {
    id: UniqueEntityId;
    title: string;
    thumbnailUrl: string;
    blurHash: string;
    price: number;
    status: SoldStatus;
  };
  user: {
    id: UniqueEntityId;
    name: string;
    avatar: string;
  };
  favoritesCount: number;
  createdAt: Date;
};

export class FavoriteAdminDetails extends ValueObject<FavoriteAdminDetailsProps> {
  get id() {
    return this.props.id;
  }

  get advertisement() {
    return this.props.advertisement;
  }

  get user() {
    return this.props.user;
  }

  get favoritesCount() {
    return this.props.favoritesCount;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(props: FavoriteAdminDetailsProps) {
    return new FavoriteAdminDetails({
      id: props.id,
      advertisement: {
        id: props.advertisement.id,
        price: props.advertisement.price,
        thumbnailUrl: props.advertisement.thumbnailUrl,
        blurHash: props.advertisement.blurHash,
        title: props.advertisement.title,
        status: props.advertisement.status,
      },
      user: {
        avatar: props.user.avatar,
        id: props.user.id,
        name: props.user.name,
      },
      favoritesCount: props.favoritesCount,
      createdAt: props.createdAt,
    });
  }
}
