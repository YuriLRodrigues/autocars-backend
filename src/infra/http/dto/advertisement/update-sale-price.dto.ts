import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

export class UpdateSalePriceDTO {
  @ApiProperty({ required: false, example: 22000, description: 'The sale price of the vehicle' })
  @IsNumber()
  salePrice: number;
}

export const SwaggerUpdateSalePriceDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiBearerAuth()(target, key, descriptor);
    ApiOperation({ operationId: 'updateSalePriceByAdvertisement' })(target, key, descriptor);
    ApiResponse({
      status: 200,
      description: 'Sale price successfully updated',
      type: String,
    })(target, key, descriptor);
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
    ApiParam({
      name: 'id',
      type: String,
      description: 'The ID of the advertisement to be updated',
    })(target, key, descriptor);
  };
};
