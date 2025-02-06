import { ApiProperty } from '@nestjs/swagger';
import { SoldStatus } from '@root/domain/enterprise/entities/advertisement.entity';
import { IsString, IsUrl, IsNumber, IsOptional, IsEnum, IsDate, Length, IsNotEmpty } from 'class-validator';

export class OwnAdvertisementBrandDto {
  @ApiProperty({
    example: 'Yamaha',
    description: 'Name of the brand',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'https://example.com/logo.png',
    description: 'Logo URL of the brand',
  })
  @IsString()
  logoUrl: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440002',
    description: 'Unique identifier of the brand',
  })
  @IsString()
  id: string;
}
export class OwnAdvertisementsDto {
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
  @IsOptional()
  thumbnailUrl?: string;

  @ApiProperty({
    description: 'BlurHash for the image, used for low-quality image preview',
    example: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
  })
  @IsNotEmpty()
  @IsString()
  @Length(5, 255)
  blurHash: string;

  @ApiProperty({
    description: 'Brand details of the advertisement',
  })
  brand: OwnAdvertisementBrandDto;
}
