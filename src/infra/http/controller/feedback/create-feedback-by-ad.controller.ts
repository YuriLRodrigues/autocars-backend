import { BadRequestException, Body, Controller, HttpStatus, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { CreateFeedbackUseCase } from '@root/domain/application/use-cases/feedback/create-feedback.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import {
  CreateFeedbackByAdIdBodyDto,
  SwaggerCreateFeedbackByAdIdDto,
} from '../../dto/feedback/create-by-advertisement.dto';

@ApiTags('Feedback - Controller')
@Controller('/feedback')
export class CreateFeedbackByAdvertisementIdController {
  constructor(private readonly createFeedback: CreateFeedbackUseCase) {}

  @SwaggerCreateFeedbackByAdIdDto()
  @Roles({ roles: [UserRoles.Manager, UserRoles.Seller, UserRoles.Customer], isAll: false })
  @Post('/ad/:id')
  async handle(
    @Param('id') id: string,
    @Body() body: CreateFeedbackByAdIdBodyDto,
    @CurrentUser() payload: UserPayload,
  ) {
    const { comment, stars, title } = body;
    const { sub } = payload;

    const feedback = await this.createFeedback.execute({
      advertisementId: new UniqueEntityId(id),
      userId: new UniqueEntityId(sub),
      comment,
      title,
      stars,
    });

    if (feedback.isLeft()) {
      const error = feedback.value;

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

    return {
      message: 'Feedback successfully created',
    };
  }
}
