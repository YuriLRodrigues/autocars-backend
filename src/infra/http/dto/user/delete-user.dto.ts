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

class DeleteUserResponseDto {
  @ApiProperty({
    description: 'Api response message according to request',
    example: 'User successfully deleted',
  })
  message: string;
}

export const SwaggerDeleteUserDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'deleteUser' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    // ApiParam({
    //   name: 'User to be delete',
    //   example: '/1',
    //   description: 'Id of user to be deleted',
    // })(target, key, descriptor);
    ApiResponse({
      status: 200,
      description: 'User successfully deleted',
      type: DeleteUserResponseDto,
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
