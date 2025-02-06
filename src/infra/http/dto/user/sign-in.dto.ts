import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

import { SwaggerBadRequestDto, SwaggerResourceAlreadyExistsDto } from '../swagger.dto';

class SignInResponseDto {
  @ApiProperty({
    description: 'Bearer token for authorization',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    type: String,
  })
  @IsString()
  token: string;
}

export class SignInBodyDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The user email',
    type: String,
  })
  @IsEmail(
    {},
    {
      message: 'Field email is not valid',
    },
  )
  @IsNotEmpty({
    message: 'This field cannot be empty',
  })
  email: string;

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
}

export const SwaggerSignInDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'signIn' })(target, key, descriptor);
    ApiBody({
      type: SignInBodyDto,
      description: 'Body to sign in',
    })(target, key, descriptor);
    ApiResponse({ status: 200, description: 'User successfully authenticated', type: SignInResponseDto })(
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
