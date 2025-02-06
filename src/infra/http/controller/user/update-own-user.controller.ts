import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpStatus,
  MethodNotAllowedException,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceAlreadyExistsError } from '@root/core/errors/resource-already-exists-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { UpdateOwnUserUseCase } from '@root/domain/application/use-cases/user/update-own-user.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';

import { SwaggerUpdateOwnUserDto, UpdateOwnUserBodyDto } from '../../dto/user/update-own-user.dto';

@ApiTags('User - Controller')
@Controller('user')
export class UpdateOwnUserController {
  constructor(private readonly updateOwnUserUseCase: UpdateOwnUserUseCase) {}

  @SwaggerUpdateOwnUserDto()
  @Patch('/update-own')
  async handle(@Body() body: UpdateOwnUserBodyDto, @CurrentUser() { sub }: UserPayload) {
    const { avatar, name, username, email, role } = body;

    const user = await this.updateOwnUserUseCase.execute({
      id: new UniqueEntityId(sub),
      avatar,
      name,
      username,
      email,
      role: UserRoles[role],
    });

    if (user.isLeft()) {
      const error = user.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            error: error.message,
          });
        case NotAllowedError:
          throw new MethodNotAllowedException({
            statusCode: HttpStatus.METHOD_NOT_ALLOWED,
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

    return { token: user.value };
  }
}
