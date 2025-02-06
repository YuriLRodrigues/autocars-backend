import { BadRequestException, Controller, Get, HttpStatus, NotFoundException, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { FindAllAdvertisementLikesUseCase } from '@root/domain/application/use-cases/like/find-all-advertisement-likes.use-case';
import { Public } from '@root/infra/auth/public';

import { SwaggerFindAllAdvertisementLikesDto } from '../../dto/like/find-all-ad-likes.dto';

@ApiTags('Like - Controller')
@Controller('/like')
export class FindAllAdvertisementLikesLikeController {
  constructor(private readonly findAllAdvertisementLikes: FindAllAdvertisementLikesUseCase) {}

  @SwaggerFindAllAdvertisementLikesDto()
  @Public()
  @Get('ad/likes-count/:id')
  async handle(@Param('id') id: string) {
    const likes = await this.findAllAdvertisementLikes.execute({
      advertisementId: new UniqueEntityId(id),
    });

    if (likes.isLeft()) {
      const error = likes.value;

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

    return likes.value;
  }
}
