import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { AsyncMaybe } from '@root/core/logic/Maybe';
import { FeedbackEntity } from '@root/domain/enterprise/entities/feedback.entity';
import { FeedbackDetails } from '@root/domain/enterprise/value-object/feedback-details';

export type CreateProps = {
  feedback: FeedbackEntity;
};

export type SaveProps = {
  feedback: FeedbackEntity;
};

export type DeleteProps = {
  feedbackId: UniqueEntityId;
};

export type FindAllByAdvertisementIdProps = {
  advertisementId: UniqueEntityId;
  page: number;
  limit: number;
};

export type FindByIdProps = {
  feedbackId: UniqueEntityId;
};

export abstract class FeedbackRepository {
  abstract create({ feedback }: CreateProps): AsyncMaybe<FeedbackEntity>;
  abstract save({ feedback }: SaveProps): AsyncMaybe<void>;
  abstract delete({ feedbackId }: DeleteProps): AsyncMaybe<void>;
  abstract findAllByAdvertisementId({
    advertisementId,
    page,
    limit,
  }: FindAllByAdvertisementIdProps): AsyncMaybe<PaginatedResult<FeedbackDetails[]>>;
  abstract findById({ feedbackId }: FindByIdProps): AsyncMaybe<FeedbackEntity>;
}
