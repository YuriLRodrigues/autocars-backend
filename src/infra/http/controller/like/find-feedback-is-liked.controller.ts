import { BadRequestException, Controller, Get, HttpStatus, NotFoundException, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { FindFeedbackIsLikedUseCase } from '@root/domain/application/use-cases/like/find-feedback-is-liked.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import { SwaggerFindFeedbackIsLikedDto } from '../../dto/like/find-feedback-is-liked.dto';

@ApiTags('Like - Controller')
@Controller('/like')
export class FindFeedbackIsLikedController {
  constructor(private readonly findFeedbackIsLiked: FindFeedbackIsLikedUseCase) {}

  @SwaggerFindFeedbackIsLikedDto()
  @Roles({ roles: [UserRoles.Customer, UserRoles.Seller, UserRoles.Manager], isAll: false })
  @Get('fb/is-liked/:id')
  async handle(@Param('id') id: string, @CurrentUser() payload: UserPayload) {
    const { sub } = payload;

    const likeFb = await this.findFeedbackIsLiked.execute({
      feedbackId: new UniqueEntityId(id),
      userId: sub ? new UniqueEntityId(sub) : undefined,
    });

    if (likeFb.isLeft()) {
      const error = likeFb.value;

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

    return likeFb.value;
  }
}
