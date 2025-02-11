import {
  Advertisement,
  Prisma,
  Capacity as CapacityPrisma,
  Color as ColorPrisma,
  Doors as DoorsPrisma,
  Fuel as FuelPrisma,
  GearBox as GearBoxPrisma,
  Model as ModelPrisma,
  SoldStatus as SoldStatusPrisma,
} from '@prisma/client';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import {
  AdvertisementEntity,
  Capacity,
  Color,
  Doors,
  Fuel,
  GearBox,
  Model,
} from '@root/domain/enterprise/entities/advertisement.entity';

import { SoldStatus } from '../../../domain/enterprise/entities/advertisement.entity';

export class AdvertisementMappers {
  static toDomain(data: Advertisement): AdvertisementEntity {
    return AdvertisementEntity.create(
      {
        brandId: new UniqueEntityId(data.brandId),
        capacity: Capacity[data.capacity],
        color: Color[data.color],
        createdAt: data.createdAt,
        description: data.description,
        doors: Doors[data.doors],
        fuel: Fuel[data.fuel],
        gearBox: GearBox[data.gearBox],
        km: data.km,
        localization: data.localization,
        model: Model[data.model],
        phone: data.phone,
        price: data.price,
        thumbnailUrl: data.thumbnailUrl,
        title: data.title,
        userId: new UniqueEntityId(data.userId),
        year: data.year,
        details: data.details,
        salePrice: data.salePrice,
        updatedAt: data.updatedAt,
        soldStatus: SoldStatus[data.soldStatus],
      },
      new UniqueEntityId(data.id),
    );
  }

  static toPersistence(data: AdvertisementEntity): Prisma.AdvertisementCreateInput {
    return {
      brand: {
        connect: {
          id: data.brandId.toValue(),
        },
      },
      capacity: CapacityPrisma[data.capacity],
      color: ColorPrisma[data.color],
      createdAt: data.createdAt,
      description: data.description,
      doors: DoorsPrisma[data.doors],
      fuel: FuelPrisma[data.fuel],
      gearBox: GearBoxPrisma[data.gearBox],
      km: data.km,
      localization: data.localization,
      model: ModelPrisma[data.model],
      phone: data.phone,
      price: data.price,
      thumbnailUrl: data.thumbnailUrl,
      title: data.title,
      user: {
        connect: {
          id: data.userId.toValue(),
        },
      },
      year: data.year,
      details: data.details,
      salePrice: data.salePrice || undefined,
      updatedAt: data.updatedAt,
      soldStatus: SoldStatusPrisma[data.soldStatus],
      id: data.id.toValue(),
    };
  }
}
