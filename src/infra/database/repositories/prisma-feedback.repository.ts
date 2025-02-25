import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { AsyncMaybe, Maybe } from '@root/core/logic/Maybe';
import {
  CreateProps,
  FeedbackRepository,
  DeleteProps,
  FindAllByAdvertisementIdProps,
  FindByIdProps,
  SaveProps,
} from '@root/domain/application/repositories/feedback.repository';
import { FeedbackEntity } from '@root/domain/enterprise/entities/feedback.entity';
import { FeedbackDetails } from '@root/domain/enterprise/value-object/feedback-details';

import { FeedbackMappers } from '../mappers/feedback.mappers';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaFeedbackRepository implements FeedbackRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ feedback }: CreateProps): AsyncMaybe<FeedbackEntity> {
    const raw = FeedbackMappers.toPersistence(feedback);

    await this.prismaService.feedback.create({ data: raw });

    return Maybe.some(feedback);
  }

  async findById({ feedbackId }: FindByIdProps): AsyncMaybe<FeedbackEntity> {
    const feedback = await this.prismaService.feedback.findFirst({
      where: {
        id: feedbackId.toValue(),
      },
    });

    if (!feedback) return Maybe.none();

    const mappedFeedback = FeedbackMappers.toDomain(feedback);

    return Maybe.some(mappedFeedback);
  }

  async findAllByAdvertisementId({
    advertisementId,
    page,
    limit,
  }: FindAllByAdvertisementIdProps): AsyncMaybe<PaginatedResult<FeedbackDetails[]>> {
    const [feedbacksByAd, count] = await this.prismaService.$transaction([
      this.prismaService.feedback.findMany({
        where: {
          advertisementId: advertisementId.toValue(),
        },
        select: {
          likes: true,
          id: true,
          comment: true,
          stars: true,
          title: true,
          user: {
            select: {
              name: true,
              id: true,
              avatar: true,
              images: {
                select: { isAvatar: true, blurHash: true },
              },
            },
          },
          createdAt: true,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prismaService.feedback.count({
        where: {
          advertisementId: advertisementId.toValue(),
        },
      }),
    ]);

    const mappedFeedbacks = feedbacksByAd.map((fb) =>
      FeedbackDetails.create({
        comment: fb.comment,
        id: new UniqueEntityId(fb.id),
        stars: fb.stars,
        title: fb.title,
        user: {
          name: fb.user.name,
          id: new UniqueEntityId(fb.user.id),
          avatar: fb.user.avatar || null,
          blurHash: fb.user.images[0]?.blurHash || null,
        },
        totalLikes: fb.likes.length,
      }),
    );

    return Maybe.some({
      data: mappedFeedbacks,
      meta: {
        page,
        perPage: limit,
        totalPages: Math.ceil(count / limit),
        totalCount: count,
      },
    });
  }

  async save({ feedback }: SaveProps): AsyncMaybe<void> {
    const raw = FeedbackMappers.toPersistence(feedback);

    await this.prismaService.feedback.update({
      data: raw,
      where: {
        id: raw.id,
      },
    });

    return;
  }

  async delete({ feedbackId }: DeleteProps): AsyncMaybe<void> {
    await this.prismaService.feedback.delete({
      where: {
        id: feedbackId.toValue(),
      },
    });

    return;
  }
}
