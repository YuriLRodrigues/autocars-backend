import { ApiBadRequestResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SwaggerBadRequestDto } from '../swagger.dto';

export const SwaggerFindFavoritesCountByAdvertisementDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'findFavoritesCountByAdvertisement' })(target, key, descriptor);
    ApiResponse({ status: 200, description: 'Total count of favorites by ad', type: Number })(target, key, descriptor);
    ApiBadRequestResponse({ status: 400, description: 'Bad request', type: SwaggerBadRequestDto })(
      target,
      key,
      descriptor,
    );
  };
};
