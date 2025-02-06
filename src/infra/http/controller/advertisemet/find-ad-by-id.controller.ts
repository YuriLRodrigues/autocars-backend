import { BadRequestException, Controller, Get, HttpStatus, NotFoundException, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { FindAdByIdUseCase } from '@root/domain/application/use-cases/advertisement/find-ad-by-id.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { Roles } from '@root/infra/auth/roles';

import { SwaggerFindAdByIdDto } from '../../dto/advertisement/find-ad-by-id.dto';
import { AdvertisementDetailsViewModel } from '../../view-model/advertisement/advertisement-details.view-model';

@Controller('/advertisement')
@ApiTags('Advertisement - Controller')
export class FindAdvertisementByIdController {
  constructor(private readonly findAdByIdUseCase: FindAdByIdUseCase) {}

  @SwaggerFindAdByIdDto()
  @Roles({ roles: [UserRoles.Seller, UserRoles.Manager, UserRoles.Customer], isAll: false })
  @Get('/details/:id')
  async handle(@Param('id') id: string) {
    const advertisement = await this.findAdByIdUseCase.execute({
      id: new UniqueEntityId(id),
    });

    if (advertisement.isLeft()) {
      const error = advertisement.value;

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

    return AdvertisementDetailsViewModel.toHttp(advertisement.value);
  }
}
