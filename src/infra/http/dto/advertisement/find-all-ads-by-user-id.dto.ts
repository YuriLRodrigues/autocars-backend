import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOperation } from '@nestjs/swagger';

import { ApiPaginatedResponse } from '../pagination.dto';
import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';
import { UserAdvertisementsDto } from './user-advertisement.dto';

export const SwaggerFindAllAdsByUserIdDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiBearerAuth()(target, key, descriptor);
    ApiOperation({ operationId: 'findAllAdvertisementsByUserId' })(target, key, descriptor);
    ApiPaginatedResponse(UserAdvertisementsDto)(target, key, descriptor);
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
