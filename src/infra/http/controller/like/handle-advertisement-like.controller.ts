import { BadRequestException, Controller, HttpStatus, NotFoundException, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { HandleAdvertisementLikeUseCase } from '@root/domain/application/use-cases/like/handle-advertisement-like.use-case';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import { SwaggerHandleAdvertisementLikeDto } from '../../dto/like/handle-advertisement-like.dto';

@ApiTags('Like - Controller')
@Controller('/like')
export class HandleAdvertisementLikeController {
  constructor(private readonly handleAdvertisement: HandleAdvertisementLikeUseCase) {}

  @SwaggerHandleAdvertisementLikeDto()
  @Roles({ roles: [UserRoles.Customer, UserRoles.Manager, UserRoles.Seller], isAll: false })
  @Patch('ad/handle-like/:id')
  async handle(@Param('id') id: string, @CurrentUser() { sub }: UserPayload) {
    const likeAd = await this.handleAdvertisement.execute({
      advertisementId: new UniqueEntityId(id),
      userId: new UniqueEntityId(sub),
    });

    if (likeAd.isLeft()) {
      const error = likeAd.value;

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
      message: 'Like added to advertisement',
    };
  }
}
