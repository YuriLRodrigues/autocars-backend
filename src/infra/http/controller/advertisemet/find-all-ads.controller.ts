import { BadRequestException, Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { FindAllAdsUseCase } from '@root/domain/application/use-cases/advertisement/find-all-ads.use-case';
import { Public } from '@root/infra/auth/public';

import { FindAllAdsQueryDto, SwaggerFindAllAdsDto } from '../../dto/advertisement/find-all-ads.dto';
import { MinimalAdvertisementDetailsViewModel } from '../../view-model/advertisement/minimal-advertisement-details.view-model';

@Controller('/advertisement')
@ApiTags('Advertisement - Controller')
export class FindAllAdvertisementsController {
  constructor(private readonly findAllAdsUseCase: FindAllAdsUseCase) {}

  @SwaggerFindAllAdsDto()
  @Public()
  @Get('/all')
  async handle(@Query() query: FindAllAdsQueryDto) {
    const { brandId, color, createdAt, fuel, km, limit, model, page, price, soldStatus, title, year } = query;

    const ads = await this.findAllAdsUseCase.execute({
      limit: Number(limit) || 12,
      page: Number(page) || 1,
      search: {
        brandId: brandId ? new UniqueEntityId(brandId) : undefined,
        color,
        createdAt,
        fuel,
        km,
        model,
        price,
        soldStatus,
        title,
        year,
      },
    });

    if (ads.isLeft()) {
      const error = ads.value;

      switch (error.message) {
        default:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Internal API error',
          });
      }
    }

    return {
      results: ads.value.data.map((ad) => MinimalAdvertisementDetailsViewModel.toHttp(ad)),
      meta: ads.value.meta,
    };
  }
}
