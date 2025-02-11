import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

class AdvertisementDto {
  @ApiProperty({ description: 'Unique identifier of the advertisement' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Title of the advertisement' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Thumbnail URL of the advertisement' })
  @IsString()
  thumbnailUrl: string;

  @ApiProperty({
    description: 'BlurHash for the image, used for low-quality image preview',
    example: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
  })
  @IsNotEmpty()
  @IsString()
  blurHash: string;

  @ApiProperty({ description: 'Price of the advertisement' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Status of the advertisement (e.g., SOLD, AVAILABLE)' })
  @IsString()
  status: string;
}

class UserDto {
  @ApiProperty({ description: 'Unique identifier of the user' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Name of the user' })
  @IsString()
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
}

export class FavoriteDetailsDto {
  @ApiProperty({ description: 'Unique identifier of the favorite details' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Details of the advertisement related to the favorite' })
  @Type(() => AdvertisementDto)
  advertisement: AdvertisementDto;

  @ApiProperty({ description: 'Details of the user who favorited the advertisement' })
  @Type(() => UserDto)
  user: UserDto;

  @ApiProperty({ description: 'Count of users who have favorited this advertisement' })
  @IsNumber()
  favoritesCount: number;

  @ApiProperty({ description: 'Date when the favorite was created' })
  @IsDate()
  createdAt: Date;
}
