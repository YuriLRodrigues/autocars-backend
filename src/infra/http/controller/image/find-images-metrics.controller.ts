import { BadRequestException, Controller, Delete, HttpStatus, MethodNotAllowedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { FindImagesMetricsUseCase } from '@root/domain/application/use-cases/image/find-images-metrics.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import { SwaggerFindImageMetricsDto } from '../../dto/images/find-images-metrics.dto';

@ApiTags('Image - Controller')
@Controller('image')
export class FindImagesMetricsController {
  constructor(private readonly imagesMetrics: FindImagesMetricsUseCase) {}

  @SwaggerFindImageMetricsDto()
  @Roles({ roles: [UserRoles.Manager] })
  @Delete('/metrics')
  async handle(@CurrentUser() { sub }: UserPayload) {
    const metrics = await this.imagesMetrics.execute({ userId: new UniqueEntityId(sub) });

    if (metrics.isLeft()) {
      const error = metrics.value;

      switch (error.constructor) {
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
      message: 'Metrics deleted successfully',
    };
  }
}
