import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiResponse,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

class SoldAds {
  @ApiProperty({
    type: Number,
    description: 'Sale price of ad',
    example: 10,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  salePrice?: number;

  @ApiProperty({
    type: Number,
    description: 'Price of ad',
    example: 10,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    type: Date,
    description: 'Updated time of ad',
    example: new Date(),
    required: true,
  })
  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
}

class FindAllSoldAdsResponseDto {
  @ApiProperty({
    type: SoldAds,
    isArray: true,
    description: 'All data of sold soldAds',
  })
  results: SoldAds[];
}

export class FindAllSoldAdsQueryDto {
  @ApiPropertyOptional({
    type: Number,
    example: '9',
    default: 1,
    description: 'Limit of data to be returned from the API',
  })
  @Transform(({ value }) => {
    const transformedValue = parseInt(value, 10);

    return isNaN(transformedValue) ? undefined : transformedValue;
  })
  @IsOptional()
  referenceDate?: number = 1;

  @ApiProperty({
    description: 'Indicates if the search is for an admin user (manager) or not',
    example: true,
  })
  @Transform(({ value }) => {
    return value ? (value === 'true' ? true : false) : false;
  })
  @IsOptional()
  @IsBoolean()
  isManager?: boolean = false;
}

export const SwaggerFindAllSoldAdsDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiBearerAuth()(target, key, descriptor);
    ApiOperation({ operationId: 'findAllSoldAds' })(target, key, descriptor);
    ApiResponse({ status: 200, type: FindAllSoldAdsResponseDto, description: 'Sold Ads' })(target, key, descriptor);
    ApiNotFoundResponse({ status: 404, description: 'Resource Not Found', type: SwaggerResourceNotFoundDto })(
      target,
      key,
      descriptor,
    );
    ApiBadRequestResponse({ status: 400, description: 'Bad request', type: SwaggerBadRequestDto })(
      target,
      key,
      descriptor,
    );
  };
};
