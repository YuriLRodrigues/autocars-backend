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
import { FindAllSoldsAdsUseCase } from '@root/domain/application/use-cases/advertisement/find-all-sold-ads.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import { FindAllSoldAdsQueryDto, SwaggerFindAllSoldAdsDto } from '../../dto/advertisement/find-all-sold-ads.dto';

@Controller('/advertisement')
@ApiTags('Advertisement - Controller')
export class FindAllSoldAdsController {
  constructor(private readonly findAllSoldAdsUseCase: FindAllSoldsAdsUseCase) {}

  @SwaggerFindAllSoldAdsDto()
  @Roles({ roles: [UserRoles.Seller, UserRoles.Manager], isAll: false })
  @Get('/sold-ads')
  async handle(@Query() query: FindAllSoldAdsQueryDto, @CurrentUser() payload: UserPayload) {
    const { sub } = payload;
    const { referenceDate, isManager } = query;

    const ads = await this.findAllSoldAdsUseCase.execute({
      referenceDate: referenceDate || 1,
      userId: new UniqueEntityId(sub),
      isManager,
    });

    if (ads.isLeft()) {
      const error = ads.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new MethodNotAllowedException({
            statusCode: HttpStatus.FORBIDDEN,
            error: error.message,
          });
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
      results: ads.value,
    };
  }
}
