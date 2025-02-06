import { ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';

import { ApiPaginatedResponse } from '../pagination.dto';
import { SwaggerBadRequestDto, SwaggerNotAllowedDto } from '../swagger.dto';

class FindAllImagesResponseDto {
  @ApiProperty({ description: 'Unique identifier of the image', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'URL of the uploaded image', example: 'https://example.com/uploads/image.png' })
  @IsString()
  url: string;

  @ApiProperty({ description: 'Creation date of the image', example: '2024-12-18T12:00:00Z' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'Last update date of the image', example: '2024-12-18T12:30:00Z' })
  @IsDate()
  updatedAt: Date;
}

export const SwaggerFindAllImagesDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'findAllImages' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiPaginatedResponse(FindAllImagesResponseDto)(target, key, descriptor);
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
