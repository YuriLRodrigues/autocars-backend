import { BadRequestException, Controller, Get, HttpStatus, MethodNotAllowedException, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { FindAllUsersUseCase } from '@root/domain/application/use-cases/user/find-all-users.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import { FindAllUsersQueryDto, SwaggerFindAllUsersDto } from '../../dto/user/find-all-users.dto';
import { UserViewModel } from '../../view-model/user/user.view-model';

@ApiTags('User - Controller')
@Controller('user')
export class FindAllUsersController {
  constructor(private readonly findAllUsersUseCase: FindAllUsersUseCase) {}

  @SwaggerFindAllUsersDto()
  @Roles({ roles: [UserRoles.Manager] })
  @Get('/find-all')
  async handle(@Query() query: FindAllUsersQueryDto, @CurrentUser() payload: UserPayload) {
    const { page, limit, createdAt, name, role, status, title } = query;
    const { sub } = payload;

    const users = await this.findAllUsersUseCase.execute({
      limit: Number(limit) || 9,
      page: Number(page) || 1,
      id: new UniqueEntityId(sub),
      createdAt,
      name,
      role,
      status,
      title,
    });

    if (users.isLeft()) {
      const error = users.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new MethodNotAllowedException({
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
      results: users.value.data.map(UserViewModel.toHttp),
      meta: users.value.meta,
    };
  }
}
