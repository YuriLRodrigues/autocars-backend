import { Entity } from '@root/core/domain/entity/entity';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Optional } from '@root/core/logic/Optional';

type FavoriteEntityProps = {
  userId: UniqueEntityId;
  advertisementId: UniqueEntityId;
  createdAt: Date;
  updatedAt?: Date;
};

export class FavoriteEntity extends Entity<FavoriteEntityProps> {
  get userId() {
    return this.props.userId;
  }

  get advertisementId() {
    return this.props.advertisementId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: Optional<FavoriteEntityProps, 'createdAt'>, id?: UniqueEntityId) {
    return new FavoriteEntity(
      {
        advertisementId: props.advertisementId,
        userId: props.userId,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }
}
