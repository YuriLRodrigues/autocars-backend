import { BadRequestException, Controller, Get, HttpStatus, NotFoundException, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { FindAdvertisementIsLikedUseCase } from '@root/domain/application/use-cases/like/find-advertisement-is-liked.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import { SwaggerFindAdIsLikedDto } from '../../dto/like/find-ad-is-liked.dto';

@ApiTags('Like - Controller')
@Controller('/like')
export class FindAdvertisementIsLikedController {
  constructor(private readonly findAdvertisementIsLiked: FindAdvertisementIsLikedUseCase) {}

  @SwaggerFindAdIsLikedDto()
  @Roles({ roles: [UserRoles.Customer, UserRoles.Manager, UserRoles.Seller], isAll: false })
  @Get('ad/is-liked/:id')
  async handle(@Param('id') id: string, @CurrentUser() payload: UserPayload) {
    const { sub } = payload;

    const likeAd = await this.findAdvertisementIsLiked.execute({
      advertisementId: new UniqueEntityId(id),
      userId: new UniqueEntityId(sub),
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
