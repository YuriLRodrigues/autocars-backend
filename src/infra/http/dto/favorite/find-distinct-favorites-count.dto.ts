import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SwaggerBadRequestDto } from '../swagger.dto';

export const SwaggerFindDistinctFavoritesCountDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'findDistinctFavoritesCount' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiResponse({ status: 200, description: 'Total count of favorites (distinct/no repeat)', type: Number })(
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
