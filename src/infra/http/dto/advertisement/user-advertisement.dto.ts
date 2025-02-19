import { ApiProperty } from '@nestjs/swagger';
import {
  Capacity,
  Doors,
  Fuel,
  GearBox,
  Model,
  SoldStatus,
} from '@root/domain/enterprise/entities/advertisement.entity';
import { IsString, IsUrl, IsNumber, IsOptional, IsEnum, IsDate } from 'class-validator';

class UserByIdDto {
  @ApiProperty({ example: 'https://example.com/profile.jpg', description: 'URL of the user profile image' })
  @IsUrl()
  profileImg: string;

  @ApiProperty({ example: 'john_doe', description: 'Username of the user' })
  @IsString()
  username: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Unique identifier of the user' })
  @IsString()
  id: string;
}

class AdvertisementByUserIdDto {
  @ApiProperty({ example: '2024-12-12T10:00:00.000Z', description: 'Creation date of the advertisement' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'Unique identifier of the advertisement',
  })
  @IsString()
  id: string;

  @ApiProperty({ example: 'Mountain Bike for Sale', description: 'Title of the advertisement' })
  @IsString()
  title: string;

  @ApiProperty({ example: 1000, description: 'Price of the advertisement' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 900, description: 'Sale price of the advertisement' })
  @IsOptional()
  @IsNumber()
  salePrice?: number;

  @ApiProperty({
    example: SoldStatus.Active,
    description: 'Status of the advertisement (available, sold, reserved)',
    enum: SoldStatus,
  })
  @IsEnum(SoldStatus)
  soldStatus: SoldStatus;

  @ApiProperty({
    description: 'Vehicle mileage',
    type: Number,
  })
  @IsNumber()
  km: number;

  @ApiProperty({
    description: 'Advertisement thumbnail URL',
    type: String,
  })
  @IsString()
  thumbnailUrl: string;

  @ApiProperty({
    description: 'BlurHash for the image, used for low-quality image preview',
    example: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
  })
  @IsString()
  blurHash: string;

  @ApiProperty({
    description: 'Vehicle capacity',
    enum: Capacity,
  })
  @IsEnum(Capacity)
  capacity: Capacity;

  @ApiProperty({
    description: 'Number of doors',
    enum: Doors,
  })
  @IsEnum(Doors)
  doors: Doors;

  @ApiProperty({
    description: 'Fuel type',
    enum: Fuel,
  })
  @IsEnum(Fuel)
  fuel: Fuel;

  @ApiProperty({
    description: 'Gearbox type',
    enum: GearBox,
  })
  @IsEnum(GearBox)
  gearBox: GearBox;

  @ApiProperty({
    description: 'Model type',
    enum: Model,
  })
  @IsEnum(Model)
  model: Model;
}

export class AdvertisementsByUserDto {
  @ApiProperty({ type: () => UserByIdDto, description: 'Details of the user' })
  user: UserByIdDto;

  @ApiProperty({ type: () => AdvertisementByUserIdDto, description: 'Details of the advertisement' })
  advertisement: AdvertisementByUserIdDto;
}
