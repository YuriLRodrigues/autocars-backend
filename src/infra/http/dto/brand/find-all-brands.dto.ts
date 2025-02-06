import { ApiBadRequestResponse, ApiOperation } from '@nestjs/swagger';

import { ApiPaginatedResponse } from '../pagination.dto';
import { SwaggerBadRequestDto } from '../swagger.dto';
import { BrandDto } from './brand.dto';

class FindAllBrandsResponseDto extends BrandDto {}

export const SwaggerFindAllBrandsDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'findAllBrands' })(target, key, descriptor);
    ApiPaginatedResponse(FindAllBrandsResponseDto)(target, key, descriptor);
    ApiBadRequestResponse({ status: 400, description: 'Bad request', type: SwaggerBadRequestDto })(
      target,
      key,
      descriptor,
    );
  };
};
