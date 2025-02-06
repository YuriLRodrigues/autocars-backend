import { BadRequestException, Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindAllFavoritesUseCase } from '@root/domain/application/use-cases/favorite/find-all-favorites.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { Roles } from '@root/infra/auth/roles';

import { SwaggerFindAllFavoritesDto } from '../../dto/favorite/find-all-favorites.dto';
import { PaginationDto } from '../../dto/pagination.dto';
import { FavoriteAdminDetailsViewModel } from '../../view-model/favorite/favorite-admin-details.view-model';

@ApiTags('Favorite - Controller')
@Controller('/favorite')
export class FindAllFavoritesController {
  constructor(private readonly findAllFavorites: FindAllFavoritesUseCase) {}

  @SwaggerFindAllFavoritesDto()
  @Roles({ roles: [UserRoles.Manager] })
  @Get('/admin')
  async handle(@Query() query: PaginationDto) {
    const { limit, page } = query;

    const favorites = await this.findAllFavorites.execute({ limit: Number(limit) || 9, page: Number(page) || 1 });

    if (favorites.isLeft()) {
      const error = favorites.value;

      switch (error.constructor) {
        default:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Internal API error',
          });
      }
    }

    return {
      results: favorites.value.data.map(FavoriteAdminDetailsViewModel.toHttp),
      meta: favorites.value.meta,
    };
  }
}
