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
import { UpdateAdUseCase } from '@root/domain/application/use-cases/advertisement/update-ad.use-case';
import {
  Capacity,
  Color,
  Doors,
  Fuel,
  GearBox,
  Model,
  SoldStatus,
} from '@root/domain/enterprise/entities/advertisement.entity';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import { SwaggerUpdateAdDto, UpdateAdDTO } from '../../dto/advertisement/update-ad.dto';

@Controller('/advertisement')
@ApiTags('Advertisement - Controller')
export class UpdateAdvertisementController {
  constructor(private readonly updateAdUseCase: UpdateAdUseCase) {}

  @SwaggerUpdateAdDto()
  @Roles({ roles: [UserRoles.Seller, UserRoles.Manager], isAll: false })
  @Patch('/update/:id')
  async handle(
    @Body()
    {
      brandId,
      capacity,
      color,
      description,
      details,
      doors,
      fuel,
      gearBox,
      km,
      localization,
      model,
      newImagesIds,
      removedImagesIds,
      phone,
      price,
      salePrice,
      thumbnailImageId,
      title,
      soldStatus,
      year,
    }: UpdateAdDTO,
    @CurrentUser() payload: UserPayload,
    @Param('id') id: string,
  ) {
    const adUpdated = await this.updateAdUseCase.execute({
      id: new UniqueEntityId(id),
      brandId: new UniqueEntityId(brandId),
      capacity: capacity && Capacity[capacity],
      color: color && Color[color],
      description,
      doors: doors && Doors[doors],
      fuel: fuel && Fuel[fuel],
      gearBox: gearBox && GearBox[gearBox],
      km,
      newImagesIds,
      removedImagesIds,
      localization,
      model: model && Model[model],
      phone,
      price: Number(price) || undefined,
      thumbnailImageId: new UniqueEntityId(thumbnailImageId),
      title,
      userId: new UniqueEntityId(payload.sub),
      year,
      details,
      salePrice: Number(salePrice) || undefined,
      soldStatus: soldStatus && SoldStatus[soldStatus],
    });

    if (adUpdated.isLeft()) {
      const error = adUpdated.value;

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
      message: 'Ad successfully updated',
    };
  }
}
