import { BadRequestException, Controller, Get, HttpStatus, NotFoundException, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { FindAllFeedbackLikesUseCase } from '@root/domain/application/use-cases/like/find-all-feedback-likes.use-case';
import { Public } from '@root/infra/auth/public';

import { SwaggerFindAllFeedbackLikesDto } from '../../dto/like/find-all-feedback-likes.dto';

@ApiTags('Like - Controller')
@Controller('/like')
export class FindAllFeedbackLikesController {
  constructor(private readonly findAllFeedbackLikes: FindAllFeedbackLikesUseCase) {}

  @SwaggerFindAllFeedbackLikesDto()
  @Public()
  @Get('fb/likes-count/:id')
  async handle(@Param('id') id: string) {
    const likes = await this.findAllFeedbackLikes.execute({
      feedbackId: new UniqueEntityId(id),
    });

    if (likes.isLeft()) {
      const error = likes.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            error: error.message,
          });
        default:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Internal API error',
          });
      }
    }

    return likes.value;
  }
}
