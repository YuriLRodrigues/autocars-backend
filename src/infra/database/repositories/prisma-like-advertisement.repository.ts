import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { AsyncMaybe, Maybe } from '@root/core/logic/Maybe';
import {
  LikeAdvertisementRepository,
  CreateProps,
  DeleteProps,
  FindAllProps,
  FindByIdProps,
} from '@root/domain/application/repositories/like-advertisement.reposiotry';
import { LikeEntity } from '@root/domain/enterprise/entities/like.entity';

import { LikeAdvertisementMappers } from '../mappers/like-advertisement.mappers';
import { PrismaService } from '../prisma.service';

export class PrismaLikeAdvertisementRepository implements LikeAdvertisementRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ like }: CreateProps): AsyncMaybe<LikeEntity> {
    const raw = LikeAdvertisementMappers.toPersistence(like);

    await this.prismaService.like.create({ data: raw });

    return Maybe.some(like);
  }

  async findById({ advertisementId, userId }: FindByIdProps): AsyncMaybe<LikeEntity> {
    const like = await this.prismaService.like.findFirst({
      where: {
        advertisementId: advertisementId.toValue(),
        userId: userId.toValue(),
      },
    });

    if (!like) return Maybe.none();

    const mappedLike = LikeAdvertisementMappers.toDomain(like);

    return Maybe.some(mappedLike);
  }

  async findAll({ advertisementId }: FindAllProps): AsyncMaybe<LikeEntity[]> {
    const likes = await this.prismaService.like.findMany({
      where: {
        advertisementId: advertisementId.toValue(),
      },
    });

    const mappedLikes = likes.map((like) =>
      LikeEntity.create(
        {
          advertisementId: new UniqueEntityId(like.advertisementId),
          createdAt: like.createdAt,
          updatedAt: like.updatedAt,
          userId: new UniqueEntityId(like.userId),
        },
        new UniqueEntityId(like.id),
      ),
    );

    return Maybe.some(mappedLikes);
  }

  async countLikes({ advertisementId }: FindAllProps): AsyncMaybe<number> {
    const likesCount = await this.prismaService.like.count({
      where: {
        advertisementId: advertisementId.toValue(),
      },
    });

    return Maybe.some(likesCount);
  }

  async delete({ likeId }: DeleteProps): AsyncMaybe<void> {
    await this.prismaService.like.delete({
      where: {
        id: likeId.toValue(),
      },
    });

    return Maybe.none();
  }
}
