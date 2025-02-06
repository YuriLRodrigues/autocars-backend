import { BadRequestException, Controller, Get, HttpStatus, NotFoundException, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { FindAllAdsByUserIdUseCase } from '@root/domain/application/use-cases/advertisement/find-all-ads-by-user-id.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { Roles } from '@root/infra/auth/roles';

import { SwaggerFindAllAdsByUserIdDto } from '../../dto/advertisement/find-all-ads-by-user-id.dto';
import { PaginationDto } from '../../dto/pagination.dto';
import { UserAdvertisementViewModel } from '../../view-model/advertisement/user-advertisement.view-model';

@Controller('/advertisement')
@ApiTags('Advertisement - Controller')
export class FindAllAdvertisementsByUserIdController {
  constructor(private readonly findAllAdsByUserIdUseCase: FindAllAdsByUserIdUseCase) {}

  @SwaggerFindAllAdsByUserIdDto()
  @Get('/all/owner/:userId')
  @Roles({ roles: [UserRoles.Seller, UserRoles.Manager, UserRoles.Customer], isAll: false })
  async handle(@Query() query: PaginationDto, @Param('userId') userId: string) {
    const { limit, page } = query;

    const ads = await this.findAllAdsByUserIdUseCase.execute({
      limit: Number(limit) || 9,
      page: Number(page) || 1,
      userId: new UniqueEntityId(userId),
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
      results: ads.value.data.map((ad) => UserAdvertisementViewModel.toHttp(ad)),
      meta: ads.value.meta,
    };
  }
}
