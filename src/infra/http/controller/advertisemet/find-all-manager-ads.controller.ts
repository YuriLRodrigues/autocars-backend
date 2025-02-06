import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  MethodNotAllowedException,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { FindAllManagerAdsUseCase } from '@root/domain/application/use-cases/advertisement/find-all-manager-ads.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import {
  FindAllManagerAdsQueryDto,
  SwaggerFindAllManagerAdsDto,
} from '../../dto/advertisement/find-all-manager-ads.dto';
import { ManagerAdvertisementViewModel } from '../../view-model/advertisement/manager-advertisement.view-model';

@Controller('/advertisement')
@ApiTags('Advertisement - Controller')
export class FindAllManagerAdvertisementsController {
  constructor(private readonly findAllManagerAdsUseCase: FindAllManagerAdsUseCase) {}

  @SwaggerFindAllManagerAdsDto()
  @Get('/all/manager')
  @Roles({ roles: [UserRoles.Manager] })
  async handle(@CurrentUser() payload: UserPayload, @Query() query: FindAllManagerAdsQueryDto) {
    const { limit, page, createdAt, endDate, price, soldStatus, startDate, title, brandId } = query;
    const { sub } = payload;

    const ads = await this.findAllManagerAdsUseCase.execute({
      limit: Number(limit) || 9,
      page: Number(page) || 1,
      userId: new UniqueEntityId(sub),
      search: {
        createdAt,
        endDate,
        price: Number(price) || undefined,
        soldStatus,
        startDate,
        title,
        brandId: brandId ? new UniqueEntityId(brandId) : undefined,
      },
    });

    if (ads.isLeft()) {
      const error = ads.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            error: error.message,
          });
        case NotAllowedError:
          throw new MethodNotAllowedException({
            statusCode: HttpStatus.METHOD_NOT_ALLOWED,
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
      results: ads.value.data.map(ManagerAdvertisementViewModel.toHttp),
      meta: ads.value.meta,
    };
  }
}
