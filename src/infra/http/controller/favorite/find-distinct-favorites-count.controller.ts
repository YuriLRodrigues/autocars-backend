import { BadRequestException, Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindDistinctFavoritesCountUseCase } from '@root/domain/application/use-cases/favorite/find-distinct-favorites-count.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { Roles } from '@root/infra/auth/roles';

import { SwaggerFindDistinctFavoritesCountDto } from '../../dto/favorite/find-distinct-favorites-count.dto';

@ApiTags('Favorite - Controller')
@Controller('/favorite')
export class FindDistinctFavoritesCountController {
  constructor(private readonly findDistinctFavoritesCount: FindDistinctFavoritesCountUseCase) {}

  @SwaggerFindDistinctFavoritesCountDto()
  @Roles({ roles: [UserRoles.Manager] })
  @Get('/distinct-count')
  async handle() {
    const count = await this.findDistinctFavoritesCount.execute();

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
