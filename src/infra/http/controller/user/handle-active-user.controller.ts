import {
  BadRequestException,
  Controller,
  HttpStatus,
  MethodNotAllowedException,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { HandleActiveUserUseCase } from '@root/domain/application/use-cases/user/handle-active-user.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import { SwaggerHandleActiveUserDto } from '../../dto/user/handle-active-user.dto';

@ApiTags('User - Controller')
@Controller('user')
export class HandleActiveUserController {
  constructor(private readonly handleActiveUserUseCase: HandleActiveUserUseCase) {}

  @SwaggerHandleActiveUserDto()
  @Roles({ roles: [UserRoles.Manager] })
  @Patch('/handle-active/:id')
  async handle(@CurrentUser() { sub }: UserPayload, @Param('id') id: string) {
    const user = await this.handleActiveUserUseCase.execute({
      currentUserId: new UniqueEntityId(sub),
      sellerId: new UniqueEntityId(id),
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
      message: 'Success to handle user status',
    };
  }
}
