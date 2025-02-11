import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

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
  @IsObject()
  advertisement: AdvertisementDto;

  @ApiProperty({ description: 'Details of the user who favorited the advertisement' })
  @IsObject()
  user: UserDto;

  @ApiProperty({ description: 'Count of users who have favorited this advertisement' })
  @IsNumber()
  favoritesCount: number;

  @ApiProperty({ description: 'Date when the favorite was created' })
  @IsDate()
  createdAt: Date;
}
