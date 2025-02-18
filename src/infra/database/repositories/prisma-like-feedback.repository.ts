import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { AsyncMaybe, Maybe } from '@root/core/logic/Maybe';
import {
  LikeFeedbackRepository,
  CreateProps,
  DeleteProps,
  FindAllProps,
  FindByIdProps,
} from '@root/domain/application/repositories/like-feedback.reposiotry';
import { LikeEntity } from '@root/domain/enterprise/entities/like.entity';

import { LikeFeedbackMappers } from '../mappers/like-feedback.mappers';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaLikeFeedbackRepository implements LikeFeedbackRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ like }: CreateProps): AsyncMaybe<LikeEntity> {
    const raw = LikeFeedbackMappers.toPersistence(like);

    await this.prismaService.like.create({ data: raw });

    return Maybe.some(like);
  }

  async findById({ feedbackId, userId }: FindByIdProps): AsyncMaybe<LikeEntity> {
    const like = await this.prismaService.like.findFirst({
      where: {
        feedbackId: feedbackId.toValue(),
        userId: userId.toValue(),
      },
    });

    if (!like) return Maybe.none();

    const mappedLike = LikeFeedbackMappers.toDomain(like);

    return Maybe.some(mappedLike);
  }

  async findAll({ feedbackId }: FindAllProps): AsyncMaybe<LikeEntity[]> {
    const likes = await this.prismaService.like.findMany({
      where: {
        feedbackId: feedbackId.toValue(),
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

  async findAllLikes({ feedbackId }: FindAllProps): AsyncMaybe<number> {
    const likes = await this.prismaService.like.count({
      where: {
        feedbackId: feedbackId.toValue(),
      },
    });

    return Maybe.some(likes);
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
