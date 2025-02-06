import { BadRequestException, Controller, Get, HttpStatus, MethodNotAllowedException, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { FindAllImagesUseCase } from '@root/domain/application/use-cases/image/find-all-images.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import { SwaggerFindAllImagesDto } from '../../dto/images/find-all-images.dto';
import { PaginationDto } from '../../dto/pagination.dto';
import { UploadImagesViewModel } from '../../view-model/image/upload-images.view-model';

@ApiTags('Image - Controller')
@Controller('image')
export class FindAllImagesController {
  constructor(private readonly findAllImages: FindAllImagesUseCase) {}

  @SwaggerFindAllImagesDto()
  @Roles({ roles: [UserRoles.Manager] })
  @Get('/all')
  async handle(@Query() query: PaginationDto, @CurrentUser() { sub }: UserPayload) {
    const { page, limit } = query;

    const images = await this.findAllImages.execute({
      limit: Number(limit) || 9,
      page: Number(page) || 1,
      userId: new UniqueEntityId(sub),
    });

    if (images.isLeft()) {
      const error = images.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new MethodNotAllowedException({
            statusCode: HttpStatus.UNAUTHORIZED,
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
      results: images.value.data.map((img) => UploadImagesViewModel.toHttp(img)),
      meta: images.value.meta,
    };
  }
}
