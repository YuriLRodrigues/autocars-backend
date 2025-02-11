import {
  BadRequestException,
  Controller,
  HttpStatus,
  MethodNotAllowedException,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ImageTypeError } from '@root/domain/application/errors/image-type-error';
import { UploadImageUseCase } from '@root/domain/application/use-cases/image/upload-image.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import { SwaggerUploadImagesDto } from '../../dto/images/upload-images.dto';
import { UploadImagesViewModel } from '../../view-model/image/upload-images.view-model';

@ApiTags('Image - Controller')
@Controller('image')
export class UploadImagesController {
  constructor(private readonly uploadImage: UploadImageUseCase) {}

  @SwaggerUploadImagesDto()
  @UseInterceptors(FilesInterceptor('files', 6))
  @Roles({ roles: [UserRoles.Manager, UserRoles.Customer, UserRoles.Seller], isAll: false })
  @Post('/upload')
  async handle(@CurrentUser() payload: UserPayload, @UploadedFiles() files: Array<Express.Multer.File>) {
    const { sub } = payload;

    const images = await this.uploadImage.execute({
      images: files.map((file) => {
        return {
          fileName: file.filename,
          fileSize: file.size,
          fileType: file.mimetype,
          body: file.buffer,
        };
      }),
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
        default:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Internal API error',
          });
      }
    }

    return images.value.map((img) => UploadImagesViewModel.toHttp(img));
  }
}
