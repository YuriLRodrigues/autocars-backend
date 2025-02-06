import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';

import {
  SwaggerBadRequestDto,
  SwaggerImageSizeErrorDto,
  SwaggerImageTypeErrorDto,
  SwaggerNotAllowedDto,
} from '../swagger.dto';

class Upload {
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

export const SwaggerUploadImagesDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'uploadImages' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiResponse({
      status: 201,
      description: 'Images successfully uploaded',
      isArray: true,
      type: Upload,
    })(target, key, descriptor);
    ApiBadRequestResponse({
      status: 400,
      description: `Unsupported file type: 'FILETYPE'`,
      type: SwaggerImageTypeErrorDto,
    })(target, key, descriptor);
    ApiBadRequestResponse({
      status: 400,
      description: `File size exceeds the maximum limit of 5MB: 'FILESIZE' bytes`,
      type: SwaggerImageSizeErrorDto,
    })(target, key, descriptor);
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
