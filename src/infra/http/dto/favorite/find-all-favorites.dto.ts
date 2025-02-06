import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { ApiPaginatedResponse } from '../pagination.dto';
import { SwaggerBadRequestDto } from '../swagger.dto';
import { FavoriteDetailsDto } from './favorite-admin-details.dto';

export class FindAllFavoritesResponseDto extends FavoriteDetailsDto {}

export const SwaggerFindAllFavoritesDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'findAllFavorites' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiPaginatedResponse(FindAllFavoritesResponseDto)(target, key, descriptor);
    ApiBadRequestResponse({ status: 400, description: 'Bad request', type: SwaggerBadRequestDto })(
      target,
      key,
      descriptor,
    );
  };
};
