import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiResponse,
} from '@nestjs/swagger';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { IsEmail, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

export class MeUserDto {
  @ApiProperty({ description: 'User ID', example: 'uuid-v4' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'User roles', example: [UserRoles.Seller] })
  @IsEnum(UserRoles)
  roles: UserRoles[];

  @ApiProperty({ description: 'User name', example: 'John Doe' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'User image BlurHash', example: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH' })
  @IsOptional()
  @IsString()
  blurHash?: string;

  @ApiPropertyOptional({ description: 'User avatar URL', example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User username', example: 'johndoe' })
  @IsString()
  username: string;
}

export class MeAddressDto {
  @ApiProperty({ description: 'Address ID', example: 'uuid-v4' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Street name', example: 'Flower Street' })
  @IsString()
  street: string;

  @ApiProperty({ description: 'City name', example: 'New York' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'State code', example: 'NY' })
  @IsString()
  state: string;

  @ApiProperty({ description: 'Postal code (ZIP)', example: 10001 })
  @IsNumber()
  zipCode: number;

  @ApiProperty({ description: 'Country', example: 'United States' })
  @IsString()
  country: string;

  @ApiProperty({ description: 'Neighborhood name', example: 'Downtown' })
  @IsString()
  neighborhood: string;
}

export class MeUserWithAddressDto {
  @ApiProperty({ description: 'User information' })
  user: MeUserDto;

  @ApiProperty({ description: 'User address' })
  address: MeAddressDto;
}

export class MeDto {
  @ApiProperty({ description: 'Informações do usuário' })
  user: MeUserDto;

  @ApiProperty({ description: 'Endereço do usuário' })
  address: MeAddressDto;
}

export const SwaggerMeDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'me' })(target, key, descriptor);
    ApiResponse({ status: 200, description: 'Profile details', type: MeDto })(target, key, descriptor);
    ApiNotFoundResponse({ status: 404, description: 'Resource not found', type: SwaggerResourceNotFoundDto });
    ApiBadRequestResponse({ status: 400, description: 'Bad request', type: SwaggerBadRequestDto })(
      target,
      key,
      descriptor,
    );
  };
};
