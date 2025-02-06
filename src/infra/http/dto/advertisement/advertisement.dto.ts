import { ApiProperty } from '@nestjs/swagger';
import { Capacity, Color, Doors, Fuel, GearBox, Model } from '@root/domain/enterprise/entities/advertisement.entity';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AdvertisementDto {
  @ApiProperty({
    example: ['e5a67153-d256-4721-b791-760fcd581c7b', 'ea34fd256-4721-b791'],
    description: 'The IDs of the advertisement images',
  })
  @IsArray()
  @IsNotEmpty()
  imagesIds: string[];

  @ApiProperty({ example: 10000, description: 'The vehicle mileage' })
  @Transform(({ value }) => {
    const transformedValue = parseInt(value, 10);

    return isNaN(transformedValue) ? undefined : transformedValue;
  })
  @IsNumber()
  @IsNotEmpty()
  km: number;

  @ApiProperty({
    example: 'City - State',
    description: 'The location of the advertisement',
  })
  @IsString()
  @IsNotEmpty()
  localization: string;

  @ApiProperty({
    example: '(31) 93333-4444',
    description: 'The contact phone number',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Honda Civic', description: 'The title of the advertisement' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'test-url',
    description: 'The thumbnail URL',
  })
  @IsString()
  @IsNotEmpty()
  thumbnailUrl: string;

  @ApiProperty({
    example: 'e5a67153-d256-4721-b791-760fcd581c7b',
    description: 'The unique identifier of the user who posted the advertisement',
  })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    example: 'Used car, never crashed...',
    description: 'The description of the advertisement',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 2024, description: 'The year of the vehicle' })
  @Transform(({ value }) => {
    const transformedValue = parseInt(value, 10);

    return isNaN(transformedValue) ? undefined : transformedValue;
  })
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @ApiProperty({
    example: ['feature1', 'feature2'],
    description: 'Optional additional details about the vehicle',
  })
  @IsString({ each: true })
  @IsOptional()
  details?: string[];

  @ApiProperty({
    example: 'e5a67153-d256-4721-b791-760fcd581c7b',
    description: 'The unique identifier of the vehicle brand',
  })
  @IsString()
  @IsNotEmpty()
  brandId: string;

  @ApiProperty({ enum: Doors, description: 'The number of doors of the vehicle' })
  @IsEnum(Doors)
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
  @Transform(({ value }) => {
    const transformedValue = parseInt(value, 10);

    return isNaN(transformedValue) ? undefined : transformedValue;
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ enum: GearBox, description: 'The type of gearbox in the vehicle' })
  @IsEnum(GearBox)
  @IsNotEmpty()
  gearBox: GearBox;

  @ApiProperty({ enum: Fuel, description: 'The type of fuel used by the vehicle' })
  @IsEnum(Fuel)
  @IsNotEmpty()
  fuel: Fuel;

  @ApiProperty({ enum: Capacity, description: 'The seating capacity of the vehicle' })
  @IsEnum(Capacity)
  @IsNotEmpty()
  capacity: Capacity;
}
