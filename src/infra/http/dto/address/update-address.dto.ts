import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsNumber, IsString } from 'class-validator';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

export class UpdateAddressBodyDto {
  @ApiProperty({
    description: 'The street of the address',
    example: '123 Main Street',
  })
  @IsString()
  @IsOptional()
  street?: string;

  @ApiProperty({
    description: 'The city of the address',
    example: 'Los Angeles',
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    description: 'The state of the address',
    example: 'California',
  })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({
    description: 'The zip code of the address',
    example: 90001,
  })
  @Transform(({ value }) => {
    const transformedValue = parseInt(value, 10);

    return isNaN(transformedValue) ? undefined : transformedValue;
  })
  @IsNumber()
  @IsOptional()
  zipCode?: number;

  @ApiProperty({
    description: 'The country of the address',
    example: 'United States',
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({
    description: 'The neighborhood of the address',
    example: 'Downtown',
  })
  @IsString()
  @IsOptional()
  neighborhood?: string;
}

class UpdateAddressResponseDto {
  @ApiProperty({
    description: 'Api response message according to request',
    example: 'Address updated successfully',
  })
  message: string;
}

export const SwaggerUpdateAddressDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiBearerAuth()(target, key, descriptor);
    ApiOperation({ operationId: 'updateAddress' })(target, key, descriptor);
    ApiResponse({ status: 201, description: 'Address updated successfully', type: UpdateAddressResponseDto })(
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
