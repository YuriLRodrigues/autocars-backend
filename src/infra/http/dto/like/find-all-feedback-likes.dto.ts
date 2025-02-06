import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

export const SwaggerFindAllFeedbackLikesDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'findAllFeedbackLikes' })(target, key, descriptor);
    ApiResponse({ status: 200, description: 'Total likes count in feedback', type: Number })(target, key, descriptor);
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
