import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import {
  Capacity,
  Color,
  Doors,
  Fuel,
  GearBox,
  Model,
  SoldStatus,
} from '@root/domain/enterprise/entities/advertisement.entity';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';
import { MinimalAdvertisementDetailsDto } from './minimal-advertisement-details.dto';

export class UpdateAdDTO {
  @ApiProperty({
    example: ['e5a67153-d256-4721-b791-760fcd581c7b', 'ea34fd256-4721-b791'],
    description: 'The IDs of the advertisement images',
    required: false,
  })
  @IsArray()
  @IsOptional()
  newImagesIds?: string[];

  @ApiProperty({
    example: ['e5a67153-d256-4721-b791-760fcd581c7b', 'ea34fd256-4721-b791'],
    description: 'The IDs of the advertisement images',
    required: false,
  })
  @IsArray()
  @IsOptional()
  removedImagesIds?: string[];

  @ApiProperty({ required: false, example: 10000, description: 'The vehicle’s mileage' })
  @IsNumber()
  @IsOptional()
  km?: number;

  @ApiProperty({ required: false, example: 'City - State', description: 'The location of the advertisement' })
  @IsString()
  @IsOptional()
  localization?: string;

  @ApiProperty({ required: false, example: '(31) 93333-4444', description: 'The contact phone number' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false, example: 'Honda Civic', description: 'The title of the advertisement' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false, example: '123', description: 'The ID of thumbnail image' })
  @IsString()
  @IsOptional()
  thumbnailImageId?: string;

  @ApiProperty({
    required: false,
    example: 'A semi-new car, never crashed...',
    description: 'The advertisement description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false, example: 2024, description: 'The vehicle’s year' })
  @IsNumber()
  @IsOptional()
  year?: number;

  @ApiProperty({
    required: false,
    example: ['feature1', 'feature2'],
    description: 'Additional optional details about the vehicle',
  })
  @IsString({ each: true })
  @IsOptional()
  details?: string[];

  @ApiProperty({
    required: false,
    example: 'e5a67153-d256-4721-b791-760fcd581c7b',
    description: 'The unique identifier of the vehicle’s brand',
  })
  @IsString()
  @IsOptional()
  brandId?: string;

  @ApiProperty({ required: false, enum: Doors, description: 'Number of doors of the vehicle' })
  @IsEnum(Doors)
  @IsOptional()
  doors?: Doors;

  @ApiProperty({ required: false, enum: Model, description: 'The model/type of the vehicle' })
  @IsEnum(Model)
  @IsOptional()
  model?: Model;

  @ApiProperty({ required: false, enum: Color, description: 'The color of the vehicle' })
  @IsEnum(Color)
  @IsOptional()
  color?: Color;

  @ApiProperty({ required: false, example: 25000, description: 'The price of the vehicle' })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ required: false, enum: SoldStatus, description: 'Flag indicating if the vehicle has been sold' })
  @IsEnum(SoldStatus)
  @IsOptional()
  soldStatus?: SoldStatus;

  @ApiProperty({ required: false, example: 22000, description: 'The sale price of the vehicle if it was sold' })
  @IsNumber()
  @IsOptional()
  salePrice?: number;

  @ApiProperty({ required: false, enum: GearBox, description: 'The type of gear transmission in the vehicle' })
  @IsEnum(GearBox)
  @IsOptional()
  gearBox?: GearBox;

  @ApiProperty({ required: false, enum: Fuel, description: 'The type of fuel the vehicle uses' })
  @IsEnum(Fuel)
  @IsOptional()
  fuel?: Fuel;

  @ApiProperty({ required: false, enum: Capacity, description: 'The seating capacity of the vehicle' })
  @IsEnum(Capacity)
  @IsOptional()
  capacity?: Capacity;
}

export const SwaggerUpdateAdDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiBearerAuth()(target, key, descriptor);
    ApiOperation({ operationId: 'updateAdvertisement' })(target, key, descriptor);
    ApiResponse({
      status: 200,
      description: 'Advertisement successfully updated',
      type: MinimalAdvertisementDetailsDto,
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
