import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  MethodNotAllowedException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { CreateAdUseCase } from '@root/domain/application/use-cases/advertisement/create-ad.use-case';
import { Capacity, Color, Doors, Fuel, GearBox, Model } from '@root/domain/enterprise/entities/advertisement.entity';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import { CreateAdBodyDto, SwaggerCreateAdDto } from '../../dto/advertisement/create-ad.dto';

@Controller('/advertisement')
@ApiTags('Advertisement - Controller')
export class CreateAdvertisementController {
  constructor(private readonly createAdUseCase: CreateAdUseCase) {}

  @SwaggerCreateAdDto()
  @HttpCode(200)
  @Roles({ roles: [UserRoles.Seller, UserRoles.Manager], isAll: false })
  @Post()
  async handle(
    @Body()
    {
      imagesIds,
      brandId,
      capacity,
      color,
      description,
      doors,
      fuel,
      gearBox,
      km,
      localization,
      model,
      phone,
      price,
      thumbnailImageId,
      title,
      year,
      details,
    }: CreateAdBodyDto,
    @CurrentUser() payload: UserPayload,
  ) {
    const advertisement = await this.createAdUseCase.execute({
      imagesIds: imagesIds.map((id) => new UniqueEntityId(id)),
      brandId: new UniqueEntityId(brandId),
      capacity: Capacity[capacity],
      color: Color[color],
      description,
      doors: Doors[doors],
      fuel: Fuel[fuel],
      gearBox: GearBox[gearBox],
      km,
      localization,
      model: Model[model],
      phone,
      price,
      thumbnailImageId: new UniqueEntityId(thumbnailImageId),
      title,
      userId: new UniqueEntityId(payload.sub),
      year,
      details,
    });

    if (advertisement.isLeft()) {
      const error = advertisement.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            error: error.message,
          });
        case NotAllowedError:
          throw new MethodNotAllowedException({
            statusCode: HttpStatus.FORBIDDEN,
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
      message: 'Advertisement created successfully',
    };
  }
}
