import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ValueObject } from '@root/core/domain/value-object/value-object';
import { Optional } from '@root/core/logic/Optional';

import { LikeEntity } from '../entities/like.entity';

type FeedbackDetailsProps = {
  likes: LikeEntity[];
  feedbackId: UniqueEntityId;
  user: {
    userId: UniqueEntityId;
    name: string;
  };
  createdAt: Date;
  stars: number;
  comment: string;
};

export class FeedbackDetails extends ValueObject<FeedbackDetailsProps> {
  get likes() {
    return this.props.likes;
  }

  get feedbackId() {
    return this.props.feedbackId;
  }

  get userId() {
    return this.props.user.userId;
  }

  get userName() {
    return this.props.user.name;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get stars() {
    return this.props.stars;
  }

  get comment() {
    return this.props.comment;
  }

  static create({ comment, feedbackId, likes, stars, user }: Optional<FeedbackDetailsProps, 'createdAt'>) {
    return new FeedbackDetails({
      comment,
      createdAt: new Date(),
      feedbackId,
      user,
      likes,
      stars,
    });
  }
}
