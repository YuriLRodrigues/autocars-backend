import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

import {
  SwaggerBadRequestDto,
  SwaggerExpiredPasswordResetTokenDto,
  SwaggerInvalidPasswordResetTokenDto,
} from '../swagger.dto';

export class NewPasswordBodyDto {
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
  newPassword: string;
}

export class NewPasswordQueryDto {
  @ApiProperty({
    description: 'The reset or authorization token for the new password',
    example: '6f3a7fb7-60e5-4ae9-9e1e-6d0d3ccbd979',
    type: String,
  })
  @IsString({ message: 'The token field must be a string' })
  @IsNotEmpty({ message: 'The token field is required' })
  token: string;
}

class NewPasswordResponseDto {
  @ApiProperty({
    description: 'Api response message according to request',
    example: 'Password changed successfully',
  })
  message: string;
}

export const SwaggerNewPasswordDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'newPassword' })(target, key, descriptor);
    ApiBody({
      type: NewPasswordBodyDto,
      description: 'Body to change password',
    })(target, key, descriptor);
    ApiResponse({ status: 200, description: 'Password changed successfully', type: NewPasswordResponseDto })(
      target,
      key,
      descriptor,
    );
    ApiUnauthorizedResponse({
      status: 401,
      description: 'Expired token to change password',
      type: SwaggerExpiredPasswordResetTokenDto,
    })(target, key, descriptor);
    ApiUnauthorizedResponse({
      status: 401,
      description: 'Invalid password to reset token',
      type: SwaggerInvalidPasswordResetTokenDto,
    })(target, key, descriptor);
    ApiBadRequestResponse({ status: 400, description: 'Bad request', type: SwaggerBadRequestDto })(
      target,
      key,
      descriptor,
    );
  };
};
