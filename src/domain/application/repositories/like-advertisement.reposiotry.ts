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
  advertisementId: UniqueEntityId;
  userId: UniqueEntityId;
};

export type FindAllProps = {
  advertisementId: UniqueEntityId;
};

export type FindCountLikesProps = {
  advertisementId: UniqueEntityId;
};

export abstract class LikeAdvertisementRepository {
  abstract create({ like }: CreateProps): AsyncMaybe<LikeEntity>;
  abstract findById({ advertisementId, userId }: FindByIdProps): AsyncMaybe<LikeEntity>;
  abstract findAll({ advertisementId }: FindAllProps): AsyncMaybe<LikeEntity[]>;
  abstract countLikes({ advertisementId }: FindAllProps): AsyncMaybe<number>;
  abstract delete({ likeId }: DeleteProps): AsyncMaybe<void>;
}
