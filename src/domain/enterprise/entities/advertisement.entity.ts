import { Entity } from '@root/core/domain/entity/entity';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Optional } from '@root/core/logic/Optional';

export enum FilterDate {
  Desc = 'desc',
  Asc = 'asc',
}

export enum Likes {
  Desc = 'desc',
  Asc = 'asc',
}

export enum Doors {
  Two = 'Two',
  Three = 'Three',
  Four = 'Four',
}

export enum Model {
  SUV = 'SUV',
  Sedan = 'Sedan',
  Hatch = 'Hatch',
  Pickups = 'Pickups',
  Crossover = 'Crossover',
  Stilt = 'Stilt',
  Minivan = 'Minivan',
  Sport = 'Sport',
  Van = 'Van',
  Coupe = 'Coupe',
}

export enum Color {
  Red = 'Red',
  Black = 'Black',
  Green = 'Green',
  Silver = 'Silver',
  White = 'White',
  Blue = 'Blue',
  Gray = 'Gray',
  Yellow = 'Yellow',
  Orange = 'Orange',
  Metalic = 'Metalic',
  Pink = 'Pink',
  Purple = 'Purple',
  Brown = 'Brown',
}

export enum GearBox {
  Automatic = 'Automatic',
  Manual = 'Manual',
}

export enum Fuel {
  Gasoline = 'Gasoline',
  Flex = 'Flex',
  Ethanol = 'Ethanol',
  Diesel = 'Diesel',
  GNV = 'GNV',
  Eletric = 'Eletric',
}

export enum Capacity {
  Two = 'Two',
  Four = 'Four',
  Five = 'Five',
  Six = 'Six',
}

export enum SoldStatus {
  Sold = 'Sold',
  Active = 'Active',
  Reserved = 'Reserved',
}

type AdvertisementProps = {
  km: number;
  localization: string;
  phone: string;
  title: string;
  thumbnailUrl: string;
  userId: UniqueEntityId;
  description: string;
  year: number;
  details?: string[];
  brandId: UniqueEntityId;
  doors: Doors;
  model: Model;
  color: Color;
  price: number;
  soldStatus: SoldStatus;
  views: number;
  salePrice: number;
  gearBox: GearBox;
  fuel: Fuel;
  capacity: Capacity;
  createdAt: Date;
  updatedAt?: Date;
};

export type EditAdvertisementInfoProps = {
  km?: number;
  localization?: string;
  phone?: string;
  title?: string;
  thumbnailUrl?: string;
  description?: string;
  year?: number;
  details?: string[];
  brandId?: UniqueEntityId;
  doors?: Doors;
  model?: Model;
  color?: Color;
  price?: number;
  soldStatus?: SoldStatus;
  salePrice?: number;
  gearBox?: GearBox;
  fuel?: Fuel;
  capacity?: Capacity;
  updatedAt?: Date;
};

export class AdvertisementEntity extends Entity<AdvertisementProps> {
  get phone() {
    return this.props.phone;
  }

  get title() {
    return this.props.title;
  }

  get userId() {
    return this.props.userId;
  }

  get thumbnailUrl() {
    return this.props.thumbnailUrl;
  }

  get km() {
    return this.props.km;
  }

  get localization() {
    return this.props.localization;
  }

  get description() {
    return this.props.description;
  }

  get year() {
    return this.props.year;
  }

  get details() {
    return this.props.details;
  }

  get brandId() {
    return this.props.brandId;
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
    return this.props.salePrice;
  }

  get gearBox() {
    return this.props.gearBox;
  }

  get fuel() {
    return this.props.fuel;
  }

  get views() {
    return this.props.views;
  }

  get capacity() {
    return this.props.capacity;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  public static create(
    props: Optional<AdvertisementProps, 'details' | 'soldStatus' | 'views' | 'salePrice' | 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const advertisement = new AdvertisementEntity(
      {
        title: props.title,
        thumbnailUrl: props.thumbnailUrl,
        userId: props.userId,
        localization: props.localization,
        km: props.km,
        brandId: props.brandId,
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
        views: 0,
        details: props.details ?? [],
        salePrice: props.salePrice ?? null,
        soldStatus: props.soldStatus ?? SoldStatus.Active,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );

    return advertisement;
  }

  public editInfo(data: EditAdvertisementInfoProps): AdvertisementEntity {
    this.props.title = data.title ?? this.props.title;
    this.props.thumbnailUrl = data.thumbnailUrl ?? this.props.thumbnailUrl;
    this.props.km = data.km ?? this.props.km;
    this.props.localization = data.localization ?? this.props.localization;
    this.props.brandId = data.brandId ?? this.props.brandId;
    this.props.capacity = data.capacity ?? this.props.capacity;
    this.props.color = data.color ?? this.props.color;
    this.props.description = data.description ?? this.props.description;
    this.props.doors = data.doors ?? this.props.doors;
    this.props.fuel = data.fuel ?? this.props.fuel;
    this.props.gearBox = data.gearBox ?? this.props.gearBox;
    this.props.model = data.model ?? this.props.model;
    this.props.phone = data.phone ?? this.props.phone;
    this.props.price = data.price ?? this.props.price;
    this.props.year = data.year ?? this.props.year;
    this.props.details = data.details ?? this.props.details;
    this.props.salePrice = data.salePrice ?? this.props.salePrice;
    this.props.soldStatus = data.soldStatus ?? this.props.soldStatus;
    this.props.updatedAt = new Date();

    return this;
  }
}
