import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

export const SwaggerFindAllAdvertisementLikesDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'findAllAdvertisementLikes' })(target, key, descriptor);
    ApiResponse({ status: 200, description: 'Total likes count in advertisement', type: Number })(
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
