import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ValueObject } from '@root/core/domain/value-object/value-object';
import { Optional } from '@root/core/logic/Optional';

import { Capacity, Color, Doors, Fuel, GearBox, Model, SoldStatus } from '../entities/advertisement.entity';

type AdvertisementDetailsProps = {
  km: number;
  localization: string;
  phone: string;
  title: string;
  description: string;
  year: number;
  details?: string[];
  doors: Doors;
  model: Model;
  color: Color;
  price: number;
  soldStatus: SoldStatus;
  salePrice?: number;
  gearBox: GearBox;
  fuel: Fuel;
  capacity: Capacity;
  images: Array<{
    url: string;
    blurHash: string;
    id: UniqueEntityId;
    isThumbnail: boolean;
  }>;
  brand: {
    brandId: UniqueEntityId;
    logoUrl: string;
    name: string;
  };
  user: {
    name: string;
    id: UniqueEntityId;
    avatar?: string;
    address: {
      street: string;
      city: string;
      zipCode: number;
    };
  };
  createdAt: Date;
  updatedAt?: Date;
};

export class AdvertisementDetails extends ValueObject<AdvertisementDetailsProps> {
  get km() {
    return this.props.km;
  }

  get localization() {
    return this.props.localization;
  }

  get phone() {
    return this.props.phone;
  }

  get title() {
    return this.props.title;
  }

  get year() {
    return this.props.year;
  }

  get description() {
    return this.props.description;
  }

  get details() {
    return this.props.details ?? [];
  }

  get doors() {
    return this.props.doors;
  }

  get model() {
    return this.props.model;
  }

  get color() {
    return this.props.color;
  }

  get price() {
    return this.props.price;
  }

  get soldStatus() {
    return this.props.soldStatus;
  }

  get salePrice() {
    return this.props.salePrice ?? null;
  }

  get gearBox() {
    return this.props.gearBox;
  }

  get fuel() {
    return this.props.fuel;
  }

  get capacity() {
    return this.props.capacity;
  }

  get images() {
    return this.props.images;
  }

  get brand() {
    return this.props.brand;
  }

  get user() {
    return this.props.user;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt ?? null;
  }

  public static create(props: Optional<AdvertisementDetailsProps, 'createdAt'>) {
    const advertisement = new AdvertisementDetails({
      title: props.title,
      localization: props.localization,
      km: props.km,
      capacity: props.capacity,
      color: props.color,
      description: props.description,
      doors: props.doors,
      fuel: props.fuel,
      gearBox: props.gearBox,
      model: props.model,
      phone: props.phone,
      price: props.price,
      year: props.year,
      details: props.details ?? [],
      salePrice: props.salePrice ?? null,
      soldStatus: props.soldStatus,
      brand: props.brand,
      images: props.images,
      user: props.user,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });

    return advertisement;
  }
}
