import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { AsyncMaybe } from '@root/core/logic/Maybe';
import { LikeEntity } from '@root/domain/enterprise/entities/like.entity';

export type CreateProps = {
  like: LikeEntity;
};

export type DeleteProps = {
  likeId: UniqueEntityId;
};

export type FindByIdProps = {
  feedbackId: UniqueEntityId;
  userId: UniqueEntityId;
};

export type FindAllProps = {
  feedbackId: UniqueEntityId;
};

export type SaveProps = {
  like: LikeEntity;
};

export abstract class LikeFeedbackRepository {
  abstract create({ like }: CreateProps): AsyncMaybe<LikeEntity>;
  abstract findById({ feedbackId, userId }: FindByIdProps): AsyncMaybe<LikeEntity>;
  abstract findAll({ feedbackId }: FindAllProps): AsyncMaybe<LikeEntity[]>;
  abstract findAllLikes({ feedbackId }: FindAllProps): AsyncMaybe<number>;
  abstract delete({ likeId }: DeleteProps): AsyncMaybe<void>;
}
