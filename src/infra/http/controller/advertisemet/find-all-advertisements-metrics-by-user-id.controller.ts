import { BadRequestException, Controller, Get, HttpStatus, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { FindMetricsByUserIdUseCase } from '@root/domain/application/use-cases/advertisement/find-metrics-by-user-id.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import { SwaggerFindAdvertisementsMetricsByUserIdDto } from '../../dto/advertisement/find-advertisements-metrics-by-user-id.dto';

@Controller('/advertisement')
@ApiTags('Advertisement - Controller')
export class FindAdvertisementsMetricsByUserIdController {
  constructor(private readonly findMetricsByUserIdUseCase: FindMetricsByUserIdUseCase) {}

  @SwaggerFindAdvertisementsMetricsByUserIdDto()
  @Roles({ roles: [UserRoles.Seller, UserRoles.Manager], isAll: false })
  @Get('/owner-metrics')
  async handle(@CurrentUser() payload: UserPayload) {
    const { sub } = payload;

    const metrics = await this.findMetricsByUserIdUseCase.execute({
      userId: new UniqueEntityId(sub),
    });

    if (metrics.isLeft()) {
      const error = metrics.value;

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

    return metrics.value;
  }
}
