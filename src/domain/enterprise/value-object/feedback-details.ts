import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ValueObject } from '@root/core/domain/value-object/value-object';
import { Optional } from '@root/core/logic/Optional';

type FeedbackDetailsProps = {
  id: UniqueEntityId;
  user: {
    id: UniqueEntityId;
    avatar?: string;
    blurHash?: string;
    name: string;
  };
  createdAt: Date;
  stars: number;
  title: string;
  comment: string;
  totalLikes: number;
};

export class FeedbackDetails extends ValueObject<FeedbackDetailsProps> {
  get totalLikes() {
    return this.props.totalLikes;
  }

  get id() {
    return this.props.id;
  }

  get user() {
    return this.props.user;
  }

  get title() {
    return this.props.title;
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

  static create({ comment, id, totalLikes, stars, user, title }: Optional<FeedbackDetailsProps, 'createdAt'>) {
    return new FeedbackDetails({
      comment,
      createdAt: new Date(),
      id,
      user,
      title,
      totalLikes,
      stars,
    });
  }
}
