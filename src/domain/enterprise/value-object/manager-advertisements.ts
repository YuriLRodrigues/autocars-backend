import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ValueObject } from '@root/core/domain/value-object/value-object';

import { SoldStatus } from '../entities/advertisement.entity';

export type ManagerAdvertisementsProps = {
  createdAt: Date;
  id: UniqueEntityId;
  title: string;
  price: number;
  salePrice?: number;
  soldStatus: SoldStatus;
  thumbnailUrl: string;
  blurHash: string;
  brand: {
    name: string;
    logoUrl: string;
    id: UniqueEntityId;
  };
  user: {
    id: UniqueEntityId;
    name: string;
    avatar?: string;
    blurHash?: string;
  };
};

export class ManagerAdvertisements extends ValueObject<ManagerAdvertisementsProps> {
  get createdAt() {
    return this.props.createdAt;
  }

  get id() {
    return this.props.id;
  }

  get title() {
    return this.props.title;
  }

  get price() {
    return this.props.price;
  }

  get salePrice() {
    return this.props.salePrice;
  }

  get soldStatus() {
    return this.props.soldStatus;
  }

  get thumbnailUrl() {
    return this.props.thumbnailUrl;
  }

  get blurHash() {
    return this.props.blurHash;
  }

  get brand() {
    return this.props.brand;
  }

  get user() {
    return this.props.user;
  }

  static create(props: ManagerAdvertisementsProps) {
    const ManagerAdvertisement = new ManagerAdvertisements({
      createdAt: props.createdAt,
      id: props.id,
      title: props.title,
      price: props.price,
      salePrice: props.salePrice,
      soldStatus: props.soldStatus,
      thumbnailUrl: props.thumbnailUrl,
      blurHash: props.blurHash,
      brand: props.brand,
      user: props.user,
    });

    return ManagerAdvertisement;
  }
}
