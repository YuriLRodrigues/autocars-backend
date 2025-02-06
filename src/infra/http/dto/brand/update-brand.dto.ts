import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { SwaggerBadRequestDto, SwaggerNotAllowedDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

export class UpdateBrandBodyDto {
  @ApiProperty({
    example: '1234',
    description: 'The ID of the image to be used as the logo',
    required: false,
  })
  @IsString()
  @IsOptional()
  logoId?: string;

  @ApiProperty({
    example: 'Honda',
    description: 'The name of the brand',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;
}

class UpdateBrandResponseDto {
  @ApiProperty({
    description: 'Api response message according to request',
    example: 'Brand successfully updated',
  })
  message: string;
}

export const SwaggerUpdateBrandDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiBearerAuth()(target, key, descriptor);
    ApiOperation({ operationId: 'updateBrand' })(target, key, descriptor);
    ApiResponse({ status: 201, description: 'Brand successfully updated', type: UpdateBrandResponseDto })(
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
