import { AsyncMaybe, Maybe } from '@root/core/logic/Maybe';
import {
  CreateProps,
  FindAllProps,
  DeleteProps,
  FindByIdProps,
  LikeAdvertisementRepository,
} from '@root/domain/application/repositories/like-advertisement.reposiotry';
import { LikeEntity } from '@root/domain/enterprise/entities/like.entity';

export class InMemoryLikeAdvertisementRepository implements LikeAdvertisementRepository {
  public advertisementLikes: LikeEntity[] = [];

  async create({ like }: CreateProps): AsyncMaybe<LikeEntity> {
    this.advertisementLikes.push(like);

    return Maybe.some(like);
  }

  async findById({ advertisementId, userId }: FindByIdProps): AsyncMaybe<LikeEntity> {
    const like = this.advertisementLikes.find(
      (like) => like.advertisementId.equals(advertisementId) && like.userId.equals(userId),
    );

    if (!like) {
      return Maybe.none();
    }

    return Maybe.some(like);
  }

  async findAll({ advertisementId }: FindAllProps): AsyncMaybe<LikeEntity[]> {
    const likes = this.advertisementLikes.filter((like) => like.advertisementId.equals(advertisementId));

    return Maybe.some(likes);
  }

  async findAllLikes({ advertisementId }: FindAllProps): AsyncMaybe<number> {
    const likes = this.advertisementLikes.filter((like) => like.advertisementId.equals(advertisementId));

    return Maybe.some(likes.length);
  }

  async countLikes({ advertisementId }: FindAllProps): AsyncMaybe<number> {
    const likes = await this.advertisementLikes.filter(
      (ad) => ad.advertisementId.toValue() === advertisementId.toValue(),
    ).length;

    return Maybe.some(likes);
  }

  async delete({ likeId }: DeleteProps): AsyncMaybe<void> {
    this.advertisementLikes = this.advertisementLikes.filter((like) => !like.id.equals(likeId));

    return;
  }

  // async save({ like }: SaveProps): AsyncMaybe<void> {
  //   const index = this.advertisementLikes.findIndex((fblike) => fblike.id.equals(like.id));

  //   this.advertisementLikes[index] = like;

  //   return;
  // } // kalil
}
