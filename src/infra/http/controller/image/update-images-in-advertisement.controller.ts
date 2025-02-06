import {
  BadRequestException,
  Controller,
  HttpStatus,
  MethodNotAllowedException,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { ImageTypeError } from '@root/domain/application/errors/image-type-error';
import { UpdateImageUseCase } from '@root/domain/application/use-cases/image/update-image.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import {
  SwaggerUpdateImagesDto,
  UpdateAdvertisementImagesDto,
} from '../../dto/images/update-images-in-advertisement.dto';

@ApiTags('Image - Controller')
@Controller('image')
export class UpdateImagesController {
  constructor(private readonly updateImage: UpdateImageUseCase) {}

  @SwaggerUpdateImagesDto()
  @Roles({ roles: [UserRoles.Manager, UserRoles.Seller], isAll: false })
  @Post('/update/:advertisementId')
  @UseInterceptors(FilesInterceptor('files'))
  async handle(
    @UploadedFile() { newImages, removedImagesIds }: UpdateAdvertisementImagesDto,
    @Param('advertisementId') advertisementId: string,
    @CurrentUser() { sub }: UserPayload,
  ) {
    const images = await this.updateImage.execute({
      advertisementId: new UniqueEntityId(advertisementId),
      newImages,
      removedImagesIds: removedImagesIds.map((id) => new UniqueEntityId(id)),
      userId: new UniqueEntityId(sub),
    });

    if (images.isLeft()) {
      const error = images.value;

      switch (error.constructor) {
        case ImageTypeError:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: error.message,
          });
        case NotAllowedError:
          throw new MethodNotAllowedException({
            statusCode: HttpStatus.UNAUTHORIZED,
            error: error.message,
          });
        case ResourceNotFoundError:
          throw new NotFoundException({
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
      message: 'Images successfully uploaded and update',
    };
  }
}
