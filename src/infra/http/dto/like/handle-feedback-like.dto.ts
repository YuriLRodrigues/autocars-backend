import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

class HandleFeedbackLikeResponseDto {
  @ApiProperty({
    description: 'Api response message according to request',
    example: 'Like added to feedback',
  })
  message: string;
}

export const SwaggerHandleFeedbackLikeDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiBearerAuth()(target, key, descriptor);
    ApiOperation({ operationId: 'handleFeedbackLike' })(target, key, descriptor);
    ApiResponse({ status: 201, description: 'Like added to feedback', type: HandleFeedbackLikeResponseDto })(
      target,
      key,
      descriptor,
    );
    ApiNotFoundResponse({ status: 404, description: 'Resource Not Found', type: SwaggerResourceNotFoundDto })(
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
