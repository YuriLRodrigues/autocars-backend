import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { FindMetricsUseCase } from '@root/domain/application/use-cases/advertisement/find-metrics.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import { SwaggerFindAdvertisementsMetricsDto } from '../../dto/advertisement/find-advertisements-metrics.dto';

@Controller('/advertisement')
@ApiTags('Advertisement - Controller')
export class FindAdvertisementsMetricsController {
  constructor(private readonly findMetricsUseCase: FindMetricsUseCase) {}

  @SwaggerFindAdvertisementsMetricsDto()
  @Roles({ roles: [UserRoles.Manager] })
  @Get('/admin-metrics')
  async handle(@CurrentUser() payload: UserPayload) {
    const { sub } = payload;

    const metrics = await this.findMetricsUseCase.execute({
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

    return metrics.value;
  }
}
