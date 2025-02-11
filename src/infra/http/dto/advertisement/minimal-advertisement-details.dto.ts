import { ApiProperty } from '@nestjs/swagger';
import {
  Capacity,
  Doors,
  Fuel,
  GearBox,
  Model,
  SoldStatus,
} from '@root/domain/enterprise/entities/advertisement.entity';
import { LikeEntity } from '@root/domain/enterprise/entities/like.entity';
import { IsInt, IsString, IsOptional, IsEnum, IsNumber, IsNotEmpty } from 'class-validator';

export class MinimalAdvertisementDetailsDto {
  @ApiProperty({
    description: 'Brand logo URL',
    type: String,
  })
  @IsString()
  logoUrl: string;

  @ApiProperty({
    description: 'Brand name',
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Unique brand ID',
    type: String,
  })
  @IsString()
  brandId: string;

  @ApiProperty({
    description: 'Vehicle mileage',
    type: Number,
  })
  @IsInt()
  km: number;

  @ApiProperty({
    description: 'Vehicle price',
    type: Number,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Vehicle sale price',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  salePrice?: number;

  @ApiProperty({
    description: 'Advertisement title',
    type: String,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Unique advertisement ID',
    type: String,
  })
  @IsString()
  advertisementId: string;

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
  @IsNotEmpty()
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
    description: 'Status of advertisement',
    enum: SoldStatus,
  })
  @IsEnum(SoldStatus)
  soldStatus: SoldStatus;

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

  @ApiProperty({
    description: 'Advertisement likes',
    type: [LikeEntity],
    required: false,
  })
  @IsOptional()
  likes?: LikeEntity[];
}
