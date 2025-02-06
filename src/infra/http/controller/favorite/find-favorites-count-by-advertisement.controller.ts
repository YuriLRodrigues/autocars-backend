import { BadRequestException, Controller, Get, HttpStatus, NotFoundException, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { FindFavoritesCountByAdvertisementUseCase } from '@root/domain/application/use-cases/favorite/find-favorites-count-by-advertisement';
import { Public } from '@root/infra/auth/public';

import { SwaggerFindFavoritesCountByAdvertisementDto } from '../../dto/favorite/find-favorites-count-by-advertisement.dto';

@ApiTags('Favorite - Controller')
@Controller('/favorite')
export class FindFavoritesCountByAdvertisementController {
  constructor(private readonly findFavoritesCountByAdvertisement: FindFavoritesCountByAdvertisementUseCase) {}

  @SwaggerFindFavoritesCountByAdvertisementDto()
  @Public()
  @Get('/count/:id')
  async handle(@Param('id') id: string) {
    const count = await this.findFavoritesCountByAdvertisement.execute({
      advertisementId: new UniqueEntityId(id),
    });

    if (count.isLeft()) {
      const error = count.value;

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

    return count.value;
  }
}
