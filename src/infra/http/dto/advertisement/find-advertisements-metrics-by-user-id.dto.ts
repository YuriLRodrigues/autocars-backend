import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

export class FindAdvertisementsMetricsByUserIdResponseDto {
  @ApiProperty({ example: 100, description: 'The number of active advertisements' })
  @IsNumber()
  @IsNotEmpty()
  activesAdvertisements: number;

  @ApiProperty({ example: 25, description: 'The number of reserved advertisements' })
  @IsNumber()
  @IsNotEmpty()
  reservedAdvertisements: number;

  @ApiProperty({ example: 50, description: 'The number of sold advertisements' })
  @IsNumber()
  @IsNotEmpty()
  soldAdvertisements: number;

  @ApiProperty({ example: 50, description: 'The number of total advertisements' })
  @IsNumber()
  @IsNotEmpty()
  totalAdvertisements: number;
}

export const SwaggerFindAdvertisementsMetricsByUserIdDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiBearerAuth()(target, key, descriptor);
    ApiOperation({ operationId: 'findAdvertisementsMetricsByUserId' })(target, key, descriptor);
    ApiResponse({ status: 200, type: FindAdvertisementsMetricsByUserIdResponseDto, description: 'Metrics by user id' })(
      target,
      key,
      descriptor,
    );
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
