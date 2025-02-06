import { BadRequestException, Controller, Get, HttpStatus, NotFoundException, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { FindAllOwnAdsUseCase } from '@root/domain/application/use-cases/advertisement/find-all-own-ads.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import { FindAllOwnAdsQueryDto, SwaggerFindAllOwnAdsDto } from '../../dto/advertisement/find-all-own-ads.dto';
import { OwnAdvertisementViewModel } from '../../view-model/advertisement/own-advertisement.view-model';

@Controller('/advertisement')
@ApiTags('Advertisement - Controller')
export class FindAllOwnAdvertisementsController {
  constructor(private readonly findAllOwnAdsUseCase: FindAllOwnAdsUseCase) {}

  @SwaggerFindAllOwnAdsDto()
  @Get('/all/own')
  @Roles({ roles: [UserRoles.Seller, UserRoles.Manager], isAll: false })
  async handle(@CurrentUser() payload: UserPayload, @Query() query: FindAllOwnAdsQueryDto) {
    const { limit, page, createdAt, endDate, price, soldStatus, startDate, title, brandId } = query;
    const { sub } = payload;

    const ads = await this.findAllOwnAdsUseCase.execute({
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
        default:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Internal API error',
          });
      }
    }

    return {
      results: ads.value.data.map(OwnAdvertisementViewModel.toHttp),
      meta: ads.value.meta,
    };
  }
}
