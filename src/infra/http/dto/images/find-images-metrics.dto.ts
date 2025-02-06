import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

import { SwaggerBadRequestDto, SwaggerNotAllowedDto } from '../swagger.dto';

class FindImageMetricsResponseDto {
  @ApiProperty({
    description: 'Total number of images',
    example: 150,
  })
  @IsNumber()
  totalCount: number;

  @ApiProperty({
    description: 'Total number of images used in advertisements',
    example: 120,
  })
  @IsNumber()
  totalInAdvertisements: number;

  @ApiProperty({
    description: 'Total number of thumbnails',
    example: 20,
  })
  @IsNumber()
  totalThumbnails: number;

  @ApiProperty({
    description: 'Total number of unused images',
    example: 10,
  })
  @IsNumber()
  totalUnused: number;
}

export const SwaggerFindImageMetricsDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'findImageMetrics' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiResponse({
      status: 200,
      description: 'Metrics successfully found',
      type: FindImageMetricsResponseDto,
    })(target, key, descriptor);
    ApiForbiddenResponse({ status: 403, description: 'Not allowed', type: SwaggerNotAllowedDto })(
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
