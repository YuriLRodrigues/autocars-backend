import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

enum UserRole {
  Seller = 'Seller',
  Customer = 'Customer',
}

export class UpdateOwnUserBodyDto {
  @ApiProperty({
    example: 'https://example.com/avatar.png',
    description: 'The URL for the user avatar',
    type: String,
    required: false,
  })
  @IsOptional()
  avatar?: string;

  @ApiProperty({
    example: 'John Doe',
    description: "The user's full name",
    required: false,
    type: String,
  })
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'The user email',
    type: String,
    required: false,
  })
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 'johndoe',
    description: 'The username',
    required: false,
    type: String,
  })
  @IsOptional()
  username?: string;

  @ApiProperty({
    example: 'Customer',
    description: "The user's role",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'The role must be a valid UserRole' })
  role?: UserRole;
}

class UpdateOwnUserResponseDto {
  @ApiProperty({
    description: 'Bearer token for authorization',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    type: String,
  })
  @IsString()
  token: string;
}

export const SwaggerUpdateOwnUserDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'updateOwnUser' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiResponse({
      status: 200,
      description: 'User successfully updated and returned token',
      type: UpdateOwnUserResponseDto,
    })(target, key, descriptor);
    ApiNotFoundResponse({ status: 404, description: 'Resource not found', type: SwaggerResourceNotFoundDto })(
      target,
      key,
      descriptor,
    );
    ApiBadRequestResponse({ status: 400, description: 'Bad request', type: SwaggerBadRequestDto })(
      target,
      key,
      descriptor,
    );
  };
};
