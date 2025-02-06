import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { Either, right } from '@root/core/logic/Either';
import { FeedbackDetails } from '@root/domain/enterprise/value-object/feedback-details';

import { FeedbackRepository } from '../../repositories/feedback.repository';

type Input = {
  advertisementId: UniqueEntityId;
  limit: number;
  page: number;
};

type Output = Either<Error, PaginatedResult<FeedbackDetails[]>>;

@Injectable()
export class FindAllByAdvertisementIdUseCase {
  constructor(private readonly feedbackRepository: FeedbackRepository) {}

  async execute({ advertisementId, limit, page }: Input): Promise<Output> {
    const { value: feedbacks } = await this.feedbackRepository.findAllByAdvertisementId({
      advertisementId,
      limit,
      page,
    });

    return right(feedbacks);
  }
}
