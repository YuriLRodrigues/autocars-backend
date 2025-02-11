import { BadRequestException, Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindFavoritesCountUseCase } from '@root/domain/application/use-cases/favorite/find-favorites-count.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { Roles } from '@root/infra/auth/roles';

import { SwaggerFindFavoritesCountDto } from '../../dto/favorite/find-favorites-count.dto';

@ApiTags('Favorite - Controller')
@Controller('/favorite')
export class FindFavoritesCountController {
  constructor(private readonly findFavoritesCount: FindFavoritesCountUseCase) {}

  @SwaggerFindFavoritesCountDto()
  @Roles({ roles: [UserRoles.Manager, UserRoles.Seller], isAll: false })
  @Get('/count')
  async handle() {
    const count = await this.findFavoritesCount.execute(); // TODO: resolver o userID para admin ou vendedor buscas de acordo com ou seu anuncio (vendedor) ou todos se for admin

    if (count.isLeft()) {
      const error = count.value;

      switch (error.constructor) {
        default:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Internal API error',
          });
      }
    }

    return count.value;
  }
}
