import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ValueObject } from '@root/core/domain/value-object/value-object';

import { SoldStatus } from '../entities/advertisement.entity';

export type OwnAdvertisementsProps = {
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
};

export class OwnAdvertisements extends ValueObject<OwnAdvertisementsProps> {
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

  static create(props: OwnAdvertisementsProps) {
    const OwnAdvertisement = new OwnAdvertisements({
      createdAt: props.createdAt,
      id: props.id,
      title: props.title,
      price: props.price,
      salePrice: props.salePrice,
      soldStatus: props.soldStatus,
      thumbnailUrl: props.thumbnailUrl,
      blurHash: props.blurHash,
      brand: props.brand,
    });

    return OwnAdvertisement;
  }
}
