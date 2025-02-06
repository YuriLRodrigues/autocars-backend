import { BadRequestException, Body, Controller, HttpStatus, NotFoundException, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { UpdateAddressUseCase } from '@root/domain/application/use-cases/address/update-address.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import { SwaggerUpdateAddressDto, UpdateAddressBodyDto } from '../../dto/address/update-address.dto';

@ApiTags('Address - Controller')
@Controller('/address')
export class UpdateAddressController {
  constructor(private readonly updateAddress: UpdateAddressUseCase) {}

  @SwaggerUpdateAddressDto()
  @Roles({ roles: [UserRoles.Customer, UserRoles.Manager, UserRoles.Seller], isAll: false })
  @Patch()
  async handle(
    @Body() { city, country, state, street, neighborhood, zipCode }: UpdateAddressBodyDto,
    @CurrentUser() payload: UserPayload,
  ) {
    const { sub } = payload;

    const address = await this.updateAddress.execute({
      userId: new UniqueEntityId(sub),
      city,
      country,
      neighborhood,
      state,
      street,
      zipCode,
    });

    if (address.isLeft()) {
      const error = address.value;

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
      message: 'Address updated successfully',
    };
  }
}
