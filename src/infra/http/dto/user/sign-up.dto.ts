import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  PickType,
} from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator';

import { AddressDto } from '../address/address.dto';
import { SwaggerBadRequestDto, SwaggerResourceAlreadyExistsDto } from '../swagger.dto';

enum UserRole {
  Seller = 'Seller',
  Customer = 'Customer',
}

export class SignUpBodyDto extends PickType(AddressDto, [
  'city',
  'country',
  'neighborhood',
  'state',
  'street',
  'zipCode',
]) {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The user email',
    type: String,
  })
  @IsEmail(
    {},
    {
      message: 'The email field is not valid',
    },
  )
  @IsNotEmpty({
    message: 'This field cannot be empty',
  })
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: "The user's full name",
    type: String,
  })
  @IsString({
    message: 'This field must be a string',
  })
  @IsNotEmpty({
    message: 'This field cannot be empty',
  })
  name: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'The user password',
    type: String,
  })
  @IsStrongPassword({
    minLength: 6,
    minNumbers: 1,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  @IsNotEmpty({
    message: 'This field cannot be empty',
  })
  password: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'The username',
    type: String,
  })
  @IsString({
    message: 'This field must be a string',
  })
  @IsNotEmpty({
    message: 'This field cannot be empty',
  })
  username: string;

  @ApiProperty({
    example: 'Customer',
    description: "The user's role",
    type: String,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;
}

class SignUpResponseDto {
  @ApiProperty({
    description: 'Api response message according to request',
    example: 'User created successfully',
  })
  message: string;
}

export const SwaggerSignUpDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'signUp' })(target, key, descriptor);
    ApiResponse({ status: 201, description: 'User created successfully', type: SignUpResponseDto })(
      target,
      key,
      descriptor,
    );
    ApiBadRequestResponse({ status: 400, description: 'Bad request', type: SwaggerBadRequestDto })(
      target,
      key,
      descriptor,
    );
    ApiConflictResponse({ status: 409, description: 'Resource already exists', type: SwaggerResourceAlreadyExistsDto })(
      target,
      key,
      descriptor,
    );
  };
};
