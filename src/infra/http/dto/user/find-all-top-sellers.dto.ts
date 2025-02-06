import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';

import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../swagger.dto';

export class FindAllTopSellersResponseDto {
  @ApiProperty({
    example: '6f3a7fb7-60e5-4ae9-9e1e-6d0d3ccbd979',
    description: 'The unique user ID',
    type: String,
  })
  id: string;

  @ApiProperty({
    example: 'https://example.com/avatar.png',
    description: 'The URL for the user avatar',
    type: String,
  })
  profileImg: string;

  @ApiProperty({
    example: 'John Doe',
    description: "The user's full name",
    type: String,
  })
  name: string;

  @ApiProperty({
    example: [UserRoles.Seller],
    description: 'The user roles',
  })
  roles: UserRoles[];

  @ApiProperty({
    example: 1500,
    description: 'The total amount of sales made by the user',
    type: Number,
  })
  amountSold: number;

  @ApiProperty({
    example: 300,
    description: 'The total quantity of items sold by the user',
    type: Number,
  })
  quantitySold: number;
}

export const SwaggerFindAllTopSellersDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'findAllTopSellers' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiResponse({
      status: 200,
      description: 'User successfully updated',
      type: FindAllTopSellersResponseDto,
      isArray: true,
    })(target, key, descriptor);
    ApiNotFoundResponse({ status: 404, description: 'Resource not found', type: SwaggerResourceNotFoundDto })(
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
