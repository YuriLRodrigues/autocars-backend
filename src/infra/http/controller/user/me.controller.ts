import { BadRequestException, Controller, Get, HttpStatus, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { MeUseCase } from '@root/domain/application/use-cases/user/me.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import { SwaggerMeDto } from '../../dto/user/me.dto';
import { MeViewModel } from '../../view-model/user/me.view-model';

@ApiTags('User - Controller')
@Controller('user')
export class FindMeController {
  constructor(private readonly meUseCase: MeUseCase) {}

  @SwaggerMeDto()
  @Roles({ roles: [UserRoles.Manager, UserRoles.Customer, UserRoles.Seller], isAll: false })
  @Get('/me')
  async handle(@CurrentUser() payload: UserPayload) {
    const { sub } = payload;

    const user = await this.meUseCase.execute({
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

    return MeViewModel.toHttp(user.value);
  }
}
