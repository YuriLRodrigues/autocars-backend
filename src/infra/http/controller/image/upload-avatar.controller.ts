import {
  BadRequestException,
  Controller,
  HttpStatus,
  NotFoundException,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { ImageTypeError } from '@root/domain/application/errors/image-type-error';
import { UploadAvatarUseCase } from '@root/domain/application/use-cases/image/upload-avatar.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import { SwaggerUploadAvatarDto } from '../../dto/images/upload-avatar.dto';

@ApiTags('Image - Controller')
@Controller('image')
export class UploadAvatarController {
  constructor(private readonly uploadAvatar: UploadAvatarUseCase) {}

  @SwaggerUploadAvatarDto()
  @UseInterceptors(FilesInterceptor('files', 1))
  @Roles({ roles: [UserRoles.Manager, UserRoles.Customer, UserRoles.Seller], isAll: false })
  @Post('/upload/avatar')
  async handle(@CurrentUser() payload: UserPayload, @UploadedFiles() files: Array<Express.Multer.File>) {
    const { sub } = payload;

    const avatar = await this.uploadAvatar.execute({
      avatar: {
        fileName: files[0].filename,
        fileSize: files[0].size,
        fileType: files[0].mimetype,
        body: files[0].buffer,
      },
      userId: new UniqueEntityId(sub),
    });

    if (avatar.isLeft()) {
      const error = avatar.value;
      switch (error.constructor) {
        case ImageTypeError:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: error.message,
          });
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
      blurHash: avatar.value.blurHash,
      url: avatar.value.url,
      id: avatar.value.id,
    };
  }
}
