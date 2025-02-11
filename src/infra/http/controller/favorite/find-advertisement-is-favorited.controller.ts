import { BadRequestException, Controller, Get, HttpStatus, NotFoundException, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { FindAdvertisementIsFavoritedUseCase } from '@root/domain/application/use-cases/favorite/find-advertisement-is-favorited.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import { SwaggerFindAdIsFavoritedDto } from '../../dto/favorite/find-ad-is-favorited.dto';

@ApiTags('Like - Controller')
@Controller('/favorite')
export class FindAdvertisementIsFavoritedController {
  constructor(private readonly findAdvertisementIsFavorited: FindAdvertisementIsFavoritedUseCase) {}

  @SwaggerFindAdIsFavoritedDto()
  @Roles({ roles: [UserRoles.Customer, UserRoles.Manager, UserRoles.Seller], isAll: false })
  @Get('/is-favorited/:id')
  async handle(@Param('id') id: string, @CurrentUser() payload: UserPayload) {
    const { sub } = payload;

    const favoritedAd = await this.findAdvertisementIsFavorited.execute({
      advertisementId: new UniqueEntityId(id),
      userId: new UniqueEntityId(sub),
    });

    if (favoritedAd.isLeft()) {
      const error = favoritedAd.value;

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

    return favoritedAd.value;
  }
}
