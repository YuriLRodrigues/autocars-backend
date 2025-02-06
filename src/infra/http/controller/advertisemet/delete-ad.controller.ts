import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { DeleteAdUseCase } from '@root/domain/application/use-cases/advertisement/delete-ad.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import { SwaggerDeletedAdDto } from '../../dto/advertisement/delete-ad.dto';

@Controller('/advertisement')
@ApiTags('Advertisement - Controller')
export class DeleteAdvertisementController {
  constructor(private readonly deleteAdUseCase: DeleteAdUseCase) {}

  @SwaggerDeletedAdDto()
  @Roles({ roles: [UserRoles.Seller, UserRoles.Manager], isAll: false })
  @HttpCode(200)
  @Delete('/:id')
  async handle(@Param('id') id: string, @CurrentUser() payload: UserPayload) {
    const ad = await this.deleteAdUseCase.execute({
      advertisementId: new UniqueEntityId(id),
      userId: new UniqueEntityId(payload.sub),
    });

    if (ad.isLeft()) {
      const error = ad.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            error: error.message,
          });
        case NotAllowedError:
          throw new UnauthorizedException({
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
      message: 'Ad successfully deleted',
    };
  }
}
