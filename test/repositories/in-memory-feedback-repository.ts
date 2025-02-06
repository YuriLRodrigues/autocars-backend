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

import { InMemoryLikeFeedbackRepository } from './in-memory-like-feedback-repository';
import { InMemoryUserRepository } from './in-memory-user-repository';

export class InMemoryFeedbackRepository implements FeedbackRepository {
  constructor(
    private readonly userRepository: InMemoryUserRepository,
    private readonly likeFeedbackRepository: InMemoryLikeFeedbackRepository,
  ) {}
  public feedbacks: FeedbackEntity[] = [];

  async create({ feedback }: CreateProps): AsyncMaybe<FeedbackEntity> {
    this.feedbacks.push(feedback);

    return Maybe.some(feedback);
  }

  async findById({ feedbackId }: FindByIdProps): AsyncMaybe<FeedbackEntity> {
    const ad = this.feedbacks.find((fb) => fb.id.equals(feedbackId));

    if (!ad) {
      return Maybe.none();
    }

    return Maybe.some(ad);
  }

  async findAllByAdvertisementId({
    advertisementId,
    page,
    limit,
  }: FindAllByAdvertisementIdProps): AsyncMaybe<PaginatedResult<FeedbackDetails[]>> {
    const feedbacks = this.feedbacks.filter((fb) => fb.advertisementId.equals(advertisementId));

    const feedbackDetails = feedbacks.map((fb) => {
      const user = this.userRepository.users.find((user) => user.id.equals(fb.userId));
      const feedback = this.likeFeedbackRepository.feedbackLikes.filter((like) => like.feedbackId.equals(fb.id));

      return FeedbackDetails.create({
        comment: fb.comment,
        createdAt: fb.createdAt,
        feedbackId: fb.id,
        stars: fb.stars,
        user: {
          name: user.name,
          userId: user.id,
        },
        likes: feedback,
      });
    });

    const limitedFeedbacks = feedbackDetails.slice((page - 1) * limit, limit * page);

    return Maybe.some({
      data: limitedFeedbacks,
      meta: {
        page,
        perPage: limit,
        totalCount: feedbackDetails.length,
        totalPages: Math.ceil(feedbackDetails.length / limit),
      },
    });
  }

  async save({ feedback }: SaveProps): AsyncMaybe<void> {
    const index = await this.feedbacks.findIndex((fb) => fb.id.equals(feedback.id));

    this.feedbacks[index] = feedback;

    return Maybe.none();
  }

  async delete({ feedbackId }: DeleteProps): AsyncMaybe<void> {
    this.feedbacks = this.feedbacks.filter((fb) => !fb.id.equals(feedbackId));

    return Maybe.none();
  }
}
