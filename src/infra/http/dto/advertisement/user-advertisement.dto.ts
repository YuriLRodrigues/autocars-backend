import { ApiProperty } from '@nestjs/swagger';
import { SoldStatus } from '@root/domain/enterprise/entities/advertisement.entity';
import { IsString, IsUrl, IsNumber, IsOptional, IsEnum, IsDate } from 'class-validator';

class UserDto {
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

class AdvertisementDto {
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

  @ApiProperty({ example: 'https://example.com/profile.jpg', description: 'URL of the ad thumbnail' })
  @IsUrl()
  thumbnail: string;
}

export class UserAdvertisementsDto {
  @ApiProperty({ type: () => UserDto, description: 'Details of the user' })
  user: UserDto;

  @ApiProperty({ type: () => AdvertisementDto, description: 'Details of the advertisement' })
  advertisement: AdvertisementDto;
}
