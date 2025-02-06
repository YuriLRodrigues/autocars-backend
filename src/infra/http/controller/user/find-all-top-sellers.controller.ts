import { BadRequestException, Controller, Get, HttpStatus, MethodNotAllowedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { FindAllTopSellersUseCase } from '@root/domain/application/use-cases/user/find-all-top-sellers.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import { SwaggerFindAllTopSellersDto } from '../../dto/user/find-all-top-sellers.dto';
import { TopSellersViewModel } from '../../view-model/user/top-sellers.view-model';

@Controller('/user')
@ApiTags('User - Controller')
export class FindAllTopSellersController {
  constructor(private readonly findAllTopSellers: FindAllTopSellersUseCase) {}

  @SwaggerFindAllTopSellersDto()
  @Roles({ roles: [UserRoles.Manager] })
  @Get('/top-sellers')
  async findAll(@CurrentUser() payload: UserPayload) {
    const { sub } = payload;

    const ads = await this.findAllTopSellers.execute({
      userId: new UniqueEntityId(sub),
    });

    if (ads.isLeft()) {
      const error = ads.value;

      switch (error.constructor) {
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

    return ads.value.map(TopSellersViewModel.toHttp);
  }
}
