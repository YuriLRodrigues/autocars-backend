import { BadRequestException, Controller, HttpStatus, NotFoundException, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { HandleFavoriteUseCase } from '@root/domain/application/use-cases/favorite/handle-favorite.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import { SwaggerHandleFavoriteDto } from '../../dto/favorite/handle-favorite.dto';

@ApiTags('Favorite - Controller')
@Controller('/favorite')
export class HandleFavoriteController {
  constructor(private readonly handleFavorite: HandleFavoriteUseCase) {}

  @SwaggerHandleFavoriteDto()
  @Roles({ roles: [UserRoles.Customer, UserRoles.Manager, UserRoles.Seller], isAll: false })
  @Patch('handle-favorite/:id')
  async handle(@Param('id') id: string, @CurrentUser() payload: UserPayload) {
    const { sub } = payload;

    const favorite = await this.handleFavorite.execute({
      advertisementId: new UniqueEntityId(id),
      userId: new UniqueEntityId(sub),
    });

    if (favorite.isLeft()) {
      const error = favorite.value;

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
      message: 'Favorite action handled successfully',
    };
  }
}
