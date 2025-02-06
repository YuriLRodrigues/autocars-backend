import { Entity } from '@root/core/domain/entity/entity';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Optional } from '@root/core/logic/Optional';

type BrandEntityProps = {
  name: string;
  logoUrl: string;
  createdAt: Date;
  updatedAt?: Date;
};

type EditBrandInfoProps = {
  name?: string;
  logoUrl?: string;
  updatedAt?: Date;
};

export class BrandEntity extends Entity<BrandEntityProps> {
  get name() {
    return this.props.name;
  }

  get logoUrl() {
    return this.props.logoUrl;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: Optional<BrandEntityProps, 'createdAt'>, id?: UniqueEntityId) {
    const brand = new BrandEntity(
      {
        logoUrl: props.logoUrl,
        name: props.name,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );

    return brand;
  }

  editInfo(props: EditBrandInfoProps) {
    this.props.name = props.name ?? this.props.name;
    this.props.logoUrl = props.logoUrl ?? this.props.logoUrl;
    this.props.updatedAt = props.updatedAt ?? new Date();

    return this;
  }
}
