import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsOptional, IsUrl } from 'class-validator';

export class BrandDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'Unique identifier of the brand' })
  @IsString()
  id: string;

  @ApiProperty({
    example: 'Honda',
    description: 'The name of the brand',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'https://example.com/logo.png',
    description: 'The URL of the brand logo',
  })
  @IsString()
  @IsUrl()
  logoUrl: string;

  @ApiProperty({
    example: '2024-12-23T10:20:30Z',
    description: 'The creation date of the brand',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    example: '2024-12-24T12:00:00Z',
    description: 'The last update date of the brand',
    required: false,
  })
  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
