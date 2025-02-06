import { AsyncMaybe, Maybe } from '@root/core/logic/Maybe';
import {
  CreateProps,
  FindAllProps,
  LikeFeedbackRepository,
  DeleteProps,
  FindByIdProps,
} from '@root/domain/application/repositories/like-feedback.reposiotry';
import { LikeEntity } from '@root/domain/enterprise/entities/like.entity';

export class InMemoryLikeFeedbackRepository implements LikeFeedbackRepository {
  public feedbackLikes: LikeEntity[] = [];

  async create({ like }: CreateProps): AsyncMaybe<LikeEntity> {
    this.feedbackLikes.push(like);

    return Maybe.some(like);
  }

  async findById({ feedbackId, userId }: FindByIdProps): AsyncMaybe<LikeEntity> {
    const like = this.feedbackLikes.find((like) => like.feedbackId.equals(feedbackId) && like.userId.equals(userId));

    if (!like) {
      return Maybe.none();
    }

    return Maybe.some(like);
  }

  async findAll({ feedbackId }: FindAllProps): AsyncMaybe<LikeEntity[]> {
    const likes = this.feedbackLikes.filter((like) => like.feedbackId.equals(feedbackId));

    return Maybe.some(likes);
  }

  async findAllLikes({ feedbackId }: FindAllProps): AsyncMaybe<number> {
    const likes = this.feedbackLikes.filter((like) => like.feedbackId.equals(feedbackId));

    return Maybe.some(likes.length);
  }

  async delete({ likeId }: DeleteProps): AsyncMaybe<void> {
    this.feedbackLikes = this.feedbackLikes.filter((like) => !like.id.equals(likeId));

    return;
  }

  // async save({ like }: SaveProps): AsyncMaybe<void> {
  //   const index = this.feedbackLikes.findIndex((fblike) => fblike.id.equals(like.id));

  //   this.feedbackLikes[index] = like;

  //   return;
  // } // kalil
}
