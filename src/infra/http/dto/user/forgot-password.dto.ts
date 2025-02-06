import { ApiOperation, ApiProperty, ApiResponse, PickType } from '@nestjs/swagger';

import { SwaggerBadRequestDto, SwaggerEmailBadFormattedDto, SwaggerResourceNotFoundDto } from '../swagger.dto';
import { UserDto } from './user.dto';

export class ForgotPasswordBodyDto extends PickType(UserDto, ['email']) {}

class ForgotResponseDto {
  @ApiProperty({
    default: 'Password recovery sent to your email',
  })
  message: string;
}

export const SwaggerForgotPasswordDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'forgotPassword' })(target, key, descriptor);
    ApiResponse({
      status: 200,
      description: 'Password recovery sent to your email',
      type: ForgotResponseDto,
    })(target, key, descriptor);
    ApiResponse({ status: 404, description: `Resource not found`, type: SwaggerResourceNotFoundDto })(
      target,
      key,
      descriptor,
    );
    ApiResponse({
      status: 400,
      description: `The email 'EMAIL' is bad formatted.`,
      type: SwaggerEmailBadFormattedDto,
    })(target, key, descriptor);
    ApiResponse({ status: 400, description: 'Bad request', type: SwaggerBadRequestDto })(target, key, descriptor);
  };
};
