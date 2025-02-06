import { Entity } from '@root/core/domain/entity/entity';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Optional } from '@root/core/logic/Optional';

type AddressProps = {
  userId: UniqueEntityId;
  street: string;
  city: string;
  state: string;
  zipCode: number;
  country: string;
  neighborhood: string;
  createdAt: Date;
  updatedAt?: Date;
};

type EditAddressProps = Omit<AddressProps, 'createdAt' | 'updatedAt' | 'userId'>;

export class AddressEntity extends Entity<AddressProps> {
  get userId() {
    return this.props.userId;
  }

  get street() {
    return this.props.street;
  }

  get city() {
    return this.props.city;
  }

  get neighborhood() {
    return this.props.neighborhood;
  }

  get state() {
    return this.props.state;
  }

  get zipCode() {
    return this.props.zipCode;
  }

  get country() {
    return this.props.country;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  public static create(props: Optional<AddressProps, 'createdAt'>, id?: UniqueEntityId) {
    const address = new AddressEntity(
      {
        userId: props.userId,
        street: props.street,
        city: props.city,
        state: props.state,
        zipCode: props.zipCode,
        neighborhood: props.neighborhood,
        country: props.country,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );

    return address;
  }

  public editAddress(data: EditAddressProps): AddressEntity {
    this.props.street = data.street;
    this.props.neighborhood = data.neighborhood;
    this.props.city = data.city;
    this.props.state = data.state;
    this.props.zipCode = data.zipCode;
    this.props.country = data.country;
    this.touch();

    return this;
  }
}
