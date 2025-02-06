import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpStatus,
  NotFoundException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceAlreadyExistsError } from '@root/core/errors/resource-already-exists-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { CreateBrandUseCase } from '@root/domain/application/use-cases/brand/create-brand.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import { CreateBrandBodyDto, SwaggerCreateBrandDto } from '../../dto/brand/create-brand.dto';

@Controller('/brand')
@ApiTags('Brand - Controller')
export class CreateBrandController {
  constructor(private readonly createBrandUseCase: CreateBrandUseCase) {}

  @SwaggerCreateBrandDto()
  @Roles({ roles: [UserRoles.Manager] })
  @Post()
  async handle(@Body() { logoId, name }: CreateBrandBodyDto, @CurrentUser() { sub }: UserPayload) {
    const brand = await this.createBrandUseCase.execute({
      logoId: new UniqueEntityId(logoId),
      name,
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
        case ResourceAlreadyExistsError:
          throw new ConflictException({
            statusCode: HttpStatus.CONFLICT,
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
      message: 'Brand successfully created',
    };
  }
}
