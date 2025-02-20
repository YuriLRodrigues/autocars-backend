import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { UpdateSalePriceUseCase } from '@root/domain/application/use-cases/advertisement/update-sale-price.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import { SwaggerUpdateSalePriceDto, UpdateSalePriceDTO } from '../../dto/advertisement/update-sale-price.dto';

@Controller('/advertisement')
@ApiTags('Advertisement - Controller')
export class UpdateSalePriceController {
  constructor(private readonly updateSalePriceUseCase: UpdateSalePriceUseCase) {}

  @SwaggerUpdateSalePriceDto()
  @Roles({ roles: [UserRoles.Seller, UserRoles.Manager], isAll: false })
  @Patch('/update/sale-price/:id')
  async handle(
    @Body() { salePrice }: UpdateSalePriceDTO,
    @CurrentUser() payload: UserPayload,
    @Param('id') id: string,
  ) {
    const { sub } = payload;

    const salePriceUpdated = await this.updateSalePriceUseCase.execute({
      id: new UniqueEntityId(id),
      salePrice,
      userId: new UniqueEntityId(sub),
    });

    if (salePriceUpdated.isLeft()) {
      const error = salePriceUpdated.value;

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

    return {
      message: 'Sale price successfully updated',
    };
  }
}
