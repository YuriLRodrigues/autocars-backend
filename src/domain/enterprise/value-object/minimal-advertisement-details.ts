import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ValueObject } from '@root/core/domain/value-object/value-object';

import { Capacity, Doors, Fuel, GearBox, Model, SoldStatus } from '../entities/advertisement.entity';
import { LikeEntity } from '../entities/like.entity';

export type MinimalAdvertisementDetailsProps = {
  brand: {
    logoUrl: string;
    name: string;
    brandId: UniqueEntityId;
  };
  km: number;
  price: number;
  salePrice?: number;
  title: string;
  advertisementId: UniqueEntityId;
  thumbnailUrl: string;
  blurHash: string;
  capacity: Capacity;
  soldStatus: SoldStatus;
  model: Model;
  doors: Doors;
  fuel: Fuel;
  gearBox: GearBox;
  likes?: LikeEntity[];
};

export class MinimalAdvertisementDetails extends ValueObject<MinimalAdvertisementDetailsProps> {
  get brand() {
    return this.props.brand;
  }

  get doors() {
    return this.props.doors;
  }

  get fuel() {
    return this.props.fuel;
  }

  get capacity() {
    return this.props.capacity;
  }

  get gearBox() {
    return this.props.gearBox;
  }

  get soldStatus() {
    return this.props.soldStatus;
  }

  get model() {
    return this.props.model;
  }

  get thumbnailUrl() {
    return this.props.thumbnailUrl;
  }

  get km() {
    return this.props.km;
  }

  get advertisementId() {
    return this.props.advertisementId;
  }

  get blurHash() {
    return this.props.blurHash;
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

  get likes() {
    return this.props.likes;
  }

  static create(props: MinimalAdvertisementDetailsProps) {
    const ads = new MinimalAdvertisementDetails({
      advertisementId: props.advertisementId,
      title: props.title,
      price: props.price,
      salePrice: props.salePrice,
      km: props.km,
      capacity: props.capacity,
      doors: props.doors,
      fuel: props.fuel,
      model: props.model,
      soldStatus: props.soldStatus,
      likes: props.likes,
      gearBox: props.gearBox,
      brand: {
        brandId: props.brand.brandId,
        logoUrl: props.brand.logoUrl,
        name: props.brand.name,
      },
      thumbnailUrl: props.thumbnailUrl,
      blurHash: props.blurHash,
    });

    return ads;
  }
}
