import {
  BadRequestException,
  Controller,
  Delete,
  HttpStatus,
  MethodNotAllowedException,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { DeleteImageUseCase } from '@root/domain/application/use-cases/image/delete-image.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import { SwaggerDeleteImageDto } from '../../dto/images/delete-image.dto';

@ApiTags('Image - Controller')
@Controller('image')
export class DeleteImageController {
  constructor(private readonly deleteImage: DeleteImageUseCase) {}

  @SwaggerDeleteImageDto()
  @Roles({ roles: [UserRoles.Manager, UserRoles.Seller] })
  @Delete('/:id')
  async handle(@Param('id') id: string, @CurrentUser() { sub }: UserPayload) {
    const image = await this.deleteImage.execute({ id: new UniqueEntityId(id), userId: new UniqueEntityId(sub) });

    if (image.isLeft()) {
      const error = image.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new MethodNotAllowedException({
            statusCode: HttpStatus.UNAUTHORIZED,
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
      message: 'Image deleted successfully',
    };
  }
}
