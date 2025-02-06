import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { IsString } from 'class-validator';

import {
  SwaggerBadRequestDto,
  SwaggerNotAllowedDto,
  SwaggerResourceAlreadyExistsDto,
  SwaggerResourceNotFoundDto,
} from '../swagger.dto';

export class CreateBrandBodyDto {
  @ApiProperty({
    example: '1234',
    description: 'The ID of the image to be used as the logo',
  })
  @IsString()
  logoId: string;

  @ApiProperty({
    example: 'Honda',
    description: 'The name of the brand',
  })
  @IsString()
  name: string;
}

class CreateBrandResponseDto {
  @ApiProperty({
    description: 'Api response message according to request',
    example: 'Brand successfully created',
  })
  message: string;
}

export const SwaggerCreateBrandDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiBearerAuth()(target, key, descriptor);
    ApiOperation({ operationId: 'createBrand' })(target, key, descriptor);
    ApiResponse({ status: 201, description: 'Brand successfully created', type: CreateBrandResponseDto })(
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
    ApiConflictResponse({ status: 409, description: 'Resource already exists', type: SwaggerResourceAlreadyExistsDto })(
      target,
      key,
      descriptor,
    );
  };
};
