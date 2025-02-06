import {
  BadRequestException,
  Controller,
  Delete,
  HttpStatus,
  NotFoundException,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { DeleteBrandUseCase } from '@root/domain/application/use-cases/brand/delete-brand.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import { SwaggerDeleteBrandDto } from '../../dto/brand/delete-brand.dto';

@Controller('/brand')
@ApiTags('Brand - Controller')
export class DeleteBrandController {
  constructor(private readonly deleteBrandUseCase: DeleteBrandUseCase) {}

  @SwaggerDeleteBrandDto()
  @Roles({ roles: [UserRoles.Manager] })
  @Delete('delete/:id')
  async handle(@Param('id') id: string, @CurrentUser() { sub }: UserPayload) {
    const brand = await this.deleteBrandUseCase.execute({
      id: new UniqueEntityId(id),
      userId: new UniqueEntityId(sub),
    });

    if (brand.isLeft()) {
      const error = brand.value;

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
      message: 'Brand successfully deleted',
    };
  }
}
