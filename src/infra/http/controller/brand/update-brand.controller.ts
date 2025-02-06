import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { UpdateBrandUseCase } from '@root/domain/application/use-cases/brand/update-brand.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import { SwaggerUpdateBrandDto, UpdateBrandBodyDto } from '../../dto/brand/update-brand.dto';

@Controller('/brand')
@ApiTags('Brand - Controller')
export class UpdateBrandController {
  constructor(private readonly updateBrandUseCase: UpdateBrandUseCase) {}

  @SwaggerUpdateBrandDto()
  @Roles({ roles: [UserRoles.Manager] })
  @Patch('/:id')
  async handle(
    @Body() { logoId, name }: UpdateBrandBodyDto,
    @Param('id') id: string,
    @CurrentUser() { sub }: UserPayload,
  ) {
    const brands = await this.updateBrandUseCase.execute({
      id: new UniqueEntityId(id),
      userId: new UniqueEntityId(sub),
      logoId: logoId ? new UniqueEntityId(logoId) : undefined,
      name,
    });

    if (brands.isLeft()) {
      const error = brands.value;

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
      message: 'Brand successfully updated',
    };
  }
}
