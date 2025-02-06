import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDate } from 'class-validator';

export class AddressDto {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: 'e2a8077f-5b32-44d6-9469-f2b1b7c022e1',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'The street of the address',
    example: '123 Main Street',
  })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({
    description: 'The city of the address',
    example: 'Los Angeles',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'The state of the address',
    example: 'California',
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    description: 'The zip code of the address',
    example: 90001,
  })
  @Transform(({ value }) => {
    const transformedValue = parseInt(value, 10);

    return isNaN(transformedValue) ? undefined : transformedValue;
  })
  @IsNumber()
  @IsNotEmpty()
  zipCode: number;

  @ApiProperty({
    description: 'The country of the address',
    example: 'United States',
  })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    description: 'The neighborhood of the address',
    example: 'Downtown',
  })
  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @ApiProperty({
    description: 'The date when the address was created',
    example: '2024-12-23T14:45:00Z',
  })
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the address was last updated',
    example: '2024-12-23T15:00:00Z',
    required: false,
  })
  @IsDate()
  @IsOptional()
  updatedAt?: Date;
}
