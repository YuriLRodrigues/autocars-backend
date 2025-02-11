import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
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
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

class AddressDto {
  @ApiProperty({ example: '123 Main St', description: 'The street address of the user' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ example: 'Springfield', description: 'The city of the user' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 12345, description: 'The ZIP code of the user' })
  @IsNumber()
  @IsNotEmpty()
  zipCode: number;
}

class UserDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'https://avatar-test.googleapis.com/',
    description: 'The user avatar',
    type: String,
  })
  @IsString({
    message: 'This field must be a string',
  })
  @IsOptional()
  avatar?: string;

  @ApiProperty({ example: 'e5a67153-d256-4721-b791-760fcd581c7b', description: 'The unique identifier of the user' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'The address of the user', type: AddressDto })
  @IsNotEmpty()
  address: AddressDto;
}

class ImageDto {
  @ApiProperty({ example: 'https://example.com/image.jpg', description: 'The URL of the image' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    description: 'BlurHash for the image, used for low-quality image preview',
    example: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
  })
  @IsNotEmpty()
  @IsString()
  blurHash: string;
}

class BrandDto {
  @ApiProperty({ example: 'e5a67153-d256-4721-b791-760fcd581c7b', description: 'The unique identifier of the brand' })
  @IsString()
  @IsNotEmpty()
  brandId: string;

  @ApiProperty({ example: 'Honda', description: 'The name of the brand' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'https://example.com/brand-logo.jpg', description: 'The URL of the brand logo' })
  @IsString()
  @IsNotEmpty()
  logoUrl: string;
}

export class FindAdByIdResponseDto {
  @ApiProperty({ example: 10000, description: 'The mileage of the vehicle' })
  @IsNumber()
  @IsNotEmpty()
  km: number;

  @ApiProperty({ example: 'City - State', description: 'The location of the advertisement' })
  @IsString()
  @IsNotEmpty()
  localization: string;

  @ApiProperty({ example: '(31) 93333-4444', description: 'The contact phone number' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Honda Civic', description: 'The title of the advertisement' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Well-maintained car...', description: 'The description of the advertisement' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 2024, description: 'The year of the vehicle' })
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @ApiProperty({ example: ['Feature1', 'Feature2'], description: 'Optional additional details about the vehicle' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  details?: string[];

  @ApiProperty({ enum: Doors, description: 'The number of doors of the vehicle' })
  @IsEnum(Doors)
  @IsNotEmpty()
  doors: Doors;

  @ApiProperty({ enum: Model, description: 'The model/type of the vehicle' })
  @IsEnum(Model)
  @IsNotEmpty()
  model: Model;

  @ApiProperty({ enum: Color, description: 'The color of the vehicle' })
  @IsEnum(Color)
  @IsNotEmpty()
  color: Color;

  @ApiProperty({ example: 25000, description: 'The price of the vehicle' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ enum: SoldStatus, description: 'The sold status of the vehicle' })
  @IsEnum(SoldStatus)
  @IsNotEmpty()
  soldStatus: SoldStatus;

  @ApiProperty({ example: 20000, description: 'The sale price of the vehicle (if applicable)' })
  @IsNumber()
  @IsOptional()
  salePrice?: number;

  @ApiProperty({ enum: GearBox, description: 'The type of gearbox in the vehicle' })
  @IsEnum(GearBox)
  @IsNotEmpty()
  gearBox: GearBox;

  @ApiProperty({ enum: Fuel, description: 'The type of fuel of the vehicle' })
  @IsEnum(Fuel)
  @IsNotEmpty()
  fuel: Fuel;

  @ApiProperty({ enum: Capacity, description: 'The seating capacity of the vehicle' })
  @IsEnum(Capacity)
  @IsNotEmpty()
  capacity: Capacity;

  @ApiProperty({
    example: [{ url: 'https://example.com/image.jpg' }],
    description: 'Array of image URLs',
    type: [ImageDto],
  })
  @IsArray()
  @IsNotEmpty()
  images: ImageDto[];

  @ApiProperty({ description: 'Details about the vehicle brand', type: BrandDto })
  @IsNotEmpty()
  brand: BrandDto;

  @ApiProperty({ description: 'Details about the user who created the advertisement', type: UserDto })
  @IsNotEmpty()
  user: UserDto;

  @ApiProperty({ example: '2024-01-01T00:00:00Z', description: 'The creation date of the advertisement' })
  @IsNotEmpty()
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-02T00:00:00Z',
    description: 'The last update date of the advertisement (if applicable)',
  })
  @IsOptional()
  updatedAt?: Date;
}

export const SwaggerFindAdByIdDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiBearerAuth()(target, key, descriptor);
    ApiOperation({ operationId: 'findAdById' })(target, key, descriptor);
    ApiResponse({ status: 200, description: 'Advertisement found successfully', type: FindAdByIdResponseDto })(
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
