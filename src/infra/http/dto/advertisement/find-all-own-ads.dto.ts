import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { SoldStatus } from '@root/domain/enterprise/entities/advertisement.entity';
import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { ApiPaginatedResponse, PaginationDto } from '../pagination.dto';
import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';
import { OwnAdvertisementsDto } from './own-advertisement.dto';

export class FindAllOwnAdsQueryDto extends PaginationDto {
  @ApiProperty({
    description: 'Filter advertisements by title',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Filter advertisements by sold status',
    enum: SoldStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(SoldStatus)
  soldStatus?: SoldStatus;

  @ApiProperty({
    description: 'Filter advertisements by price',
    required: false,
    type: Number,
  })
  @Transform(({ value }) => {
    const transformedValue = parseInt(value, 10);

    return isNaN(transformedValue) ? undefined : transformedValue;
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({
    description: 'Sort advertisements by creation date in ascending or descending order',
    enum: ['asc', 'desc'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  createdAt?: 'asc' | 'desc';

  @ApiProperty({
    description: 'Filter advertisements created from this start date (ISO 8601 format)',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'Filter advertisements created up to this end date (ISO 8601 format)',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'Filter advertisements by brand ID',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  brandId?: string;
}

export const SwaggerFindAllOwnAdsDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiBearerAuth()(target, key, descriptor);
    ApiOperation({ operationId: 'findAllOwnAdvertisements' })(target, key, descriptor);
    ApiPaginatedResponse(OwnAdvertisementsDto)(target, key, descriptor);
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
