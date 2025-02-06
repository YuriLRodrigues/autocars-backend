import { BadRequestException, Controller, Get, HttpStatus, NotFoundException, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { FindAdvertisementIsLikedUseCase } from '@root/domain/application/use-cases/like/find-advertisement-is-liked.use-case';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Public } from '@root/infra/auth/public';

import { SwaggerFindAdIsLikedDto } from '../../dto/like/find-ad-is-liked.dto';

@ApiTags('Like - Controller')
@Controller('/like')
export class FindAdvertisementIsLikedController {
  constructor(private readonly findAdvertisementIsLiked: FindAdvertisementIsLikedUseCase) {}

  @SwaggerFindAdIsLikedDto()
  @Public()
  @Get('ad/:id')
  async handle(@Param('id') id: string, @CurrentUser() payload: UserPayload) {
    const { sub } = payload;

    const likeAd = await this.findAdvertisementIsLiked.execute({
      advertisementId: new UniqueEntityId(id),
      userId: sub ? new UniqueEntityId(sub) : undefined,
    });

    if (likeAd.isLeft()) {
      const error = likeAd.value;

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

    return likeAd.value;
  }
}
