import { BadRequestException, Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { FindAllByAdvertisementIdUseCase } from '@root/domain/application/use-cases/feedback/find-all-by-advertisement-id.use-case';
import { Public } from '@root/infra/auth/public';

import { SwaggerFindAllFeedbacksByAdIdDto } from '../../dto/feedback/find-all-by-advertisement.dto';
import { PaginationDto } from '../../dto/pagination.dto';
import { FeedbackDetailsViewModel } from '../../view-model/feedback/feedback-details.view-model';

@ApiTags('Feedback - Controller')
@Controller('/feedback')
export class FindAllFeedbacksByAdvertisementIdController {
  constructor(private readonly findAllByAdvertisementId: FindAllByAdvertisementIdUseCase) {}

  @SwaggerFindAllFeedbacksByAdIdDto()
  @Public()
  @Get('/ad/:id')
  async handle(@Param('id') id: string, @Query() query: PaginationDto) {
    const { limit, page } = query;

    const feedbacks = await this.findAllByAdvertisementId.execute({
      advertisementId: new UniqueEntityId(id),
      limit: Number(limit) || 6,
      page: Number(page) || 1,
    });

    if (feedbacks.isLeft()) {
      const error = feedbacks.value;

      switch (error.constructor) {
        default:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Internal API error',
          });
      }
    }

    return {
      results: feedbacks.value.data.map(FeedbackDetailsViewModel.toHttp),
      meta: feedbacks.value.meta,
    };
  }
}
