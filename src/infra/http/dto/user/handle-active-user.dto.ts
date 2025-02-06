import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';

import { SwaggerBadRequestDto, SwaggerNotAllowedDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

class HandleActiveUserResponseDto {
  @ApiProperty({
    description: 'Api response message according to request',
    example: 'Success to handle user status',
  })
  message: string;
}

export const SwaggerHandleActiveUserDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'handleActiveUser' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiResponse({
      status: 200,
      description: 'Success to handle user status',
      type: HandleActiveUserResponseDto,
    })(target, key, descriptor);
    ApiNotFoundResponse({ status: 404, description: 'Resource not found', type: SwaggerResourceNotFoundDto })(
      target,
      key,
      descriptor,
    );
    ApiForbiddenResponse({ status: 403, description: 'Not allowed', type: SwaggerNotAllowedDto })(
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
