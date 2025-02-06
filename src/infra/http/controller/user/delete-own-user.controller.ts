import { BadRequestException, Controller, Delete, HttpStatus, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { DeleteOwnUserUseCase } from '@root/domain/application/use-cases/user/delete-own-user.use-case';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';

import { SwaggerDeleteOwnUserDto } from '../../dto/user/delete-own-user.dto';

@ApiTags('User - Controller')
@Controller('user')
export class DeleteOwnUserController {
  constructor(private readonly deleteOwnUserUseCase: DeleteOwnUserUseCase) {}

  @SwaggerDeleteOwnUserDto()
  @Delete('/own')
  async deleteOwn(@CurrentUser() { sub }: UserPayload) {
    const user = await this.deleteOwnUserUseCase.execute({
      id: new UniqueEntityId(sub),
    });

    if (user.isLeft()) {
      const error = user.value;

      switch (error.constructor) {
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
      message: 'Your user has been successfully deleted',
    };
  }
}
