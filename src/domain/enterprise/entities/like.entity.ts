import { Entity } from '@root/core/domain/entity/entity';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Optional } from '@root/core/logic/Optional';

export type LikeEntityProps = {
  feedbackId?: UniqueEntityId;
  userId: UniqueEntityId;
  advertisementId?: UniqueEntityId;
  createdAt: Date;
  updatedAt?: Date;
};

export class LikeEntity extends Entity<LikeEntityProps> {
  get userId() {
    return this.props.userId;
  }

  get feedbackId() {
    return this.props.feedbackId;
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

  static create(props: Optional<LikeEntityProps, 'createdAt'>, id?: UniqueEntityId) {
    return new LikeEntity(
      {
        userId: props.userId,
        advertisementId: props.advertisementId,
        feedbackId: props.feedbackId ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      id,
    );
  }
}
