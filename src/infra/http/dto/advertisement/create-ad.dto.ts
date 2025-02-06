import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  OmitType,
} from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { SwaggerBadRequestDto, SwaggerNotAllowedDto, SwaggerResourceNotFoundDto } from '../swagger.dto';
import { AdvertisementDto } from './advertisement.dto';

export class CreateAdBodyDto extends OmitType(AdvertisementDto, ['thumbnailUrl', 'userId'] as const) {
  @ApiProperty({
    example: 'test-url',
    description: 'The thumbnail image ID',
  })
  @IsString()
  @IsNotEmpty()
  thumbnailImageId: string;
}

class CreateAdResponseDto {
  @ApiProperty({
    description: 'Api response message according to request',
    example: 'Advertisement created successfully',
  })
  message: string;
}

export const SwaggerCreateAdDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiBearerAuth()(target, key, descriptor);
    ApiOperation({ operationId: 'createAdvertisement' })(target, key, descriptor);
    ApiResponse({ status: 201, description: 'Advertisement created successfully', type: CreateAdResponseDto })(
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
    ApiForbiddenResponse({ status: 403, description: 'Not allowed', type: SwaggerNotAllowedDto })(
      target,
      key,
      descriptor,
    );
  };
};
