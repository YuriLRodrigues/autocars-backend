import { BadRequestException, Controller, Get, HttpStatus, NotFoundException, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { FindAllFavoritesByUserIdUseCase } from '@root/domain/application/use-cases/favorite/find-all-favorites-by-user-id.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import { SwaggerFindAllFavoritesByUserIdDto } from '../../dto/favorite/find-all-favorites-by-user-id.dto';
import { PaginationDto } from '../../dto/pagination.dto';
import { FavoriteDetailsViewModel } from '../../view-model/favorite/favorite-details.view-model';

@ApiTags('Favorite - Controller')
@Controller('/favorite')
export class FindAllFavoritesByUserIdController {
  constructor(private readonly findAllFavoritesByUserId: FindAllFavoritesByUserIdUseCase) {}

  @SwaggerFindAllFavoritesByUserIdDto()
  @Roles({ roles: [UserRoles.Manager, UserRoles.Seller, UserRoles.Customer], isAll: false })
  @Get()
  async handle(@Query() query: PaginationDto, @CurrentUser() payload: UserPayload) {
    const { limit, page } = query;
    const { sub } = payload;

    const favorites = await this.findAllFavoritesByUserId.execute({
      limit: Number(limit) || 9,
      page: Number(page) || 1,
      userId: new UniqueEntityId(sub),
    });

    if (favorites.isLeft()) {
      const error = favorites.value;

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
      results: favorites.value.data.map(FavoriteDetailsViewModel.toHttp),
      meta: favorites.value.meta,
    };
  }
}
