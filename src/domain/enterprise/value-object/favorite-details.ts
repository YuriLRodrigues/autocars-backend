import { SoldStatus } from '@prisma/client';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ValueObject } from '@root/core/domain/value-object/value-object';

import { Capacity, Doors, Fuel, GearBox, Model } from '../entities/advertisement.entity';

export type FavoriteDetailsProps = {
  id: UniqueEntityId;
  advertisement: {
    id: UniqueEntityId;
    title: string;
    thumbnailUrl: string;
    blurHash: string;
    price: number;
    salePrice?: number;
    km: number;
    doors: Doors;
    gearBox: GearBox;
    fuel: Fuel;
    capacity: Capacity;
    soldStatus: SoldStatus;
    model: Model;
  };
};

export class FavoriteDetails extends ValueObject<FavoriteDetailsProps> {
  get advertisement() {
    return this.props.advertisement;
  }

  get id() {
    return this.props.id;
  }

  static create(props: FavoriteDetailsProps) {
    return new FavoriteDetails({
      id: props.id,
      advertisement: {
        id: props.advertisement.id,
        price: props.advertisement.price,
        salePrice: props.advertisement.salePrice,
        thumbnailUrl: props.advertisement.thumbnailUrl,
        blurHash: props.advertisement.blurHash,
        title: props.advertisement.title,
        doors: props.advertisement.doors,
        capacity: props.advertisement.capacity,
        model: props.advertisement.model,
        fuel: props.advertisement.fuel,
        gearBox: props.advertisement.gearBox,
        km: props.advertisement.km,
        soldStatus: props.advertisement.soldStatus,
      },
    });
  }
}
