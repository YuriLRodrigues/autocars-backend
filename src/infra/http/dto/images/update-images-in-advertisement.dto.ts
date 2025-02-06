import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

import {
  SwaggerBadRequestDto,
  SwaggerImageSizeErrorDto,
  SwaggerImageTypeErrorDto,
  SwaggerNotAllowedDto,
  SwaggerResourceNotFoundDto,
} from '../swagger.dto';

class UpdateImagesResponseDto {
  @ApiProperty({
    example: 'Image(s) successfully updated',
    description: 'Api response message according to request',
  })
  @IsString()
  message: string;
}

class NewImageDto {
  @ApiProperty({
    description: 'The name of the file',
    example: 'image1.jpg',
  })
  @IsString()
  fileName: string;

  @ApiProperty({
    description: 'The type of the file (MIME type)',
    example: 'image/jpeg',
  })
  @IsString()
  fileType: string;

  @ApiProperty({
    description: 'The size of the file in bytes',
    example: 102400,
  })
  @IsNumber()
  fileSize: number;

  @ApiProperty({
    description: 'The buffer content of the file',
    example: '817 72 6215 16 122',
  })
  @IsString()
  body: Buffer;
}

export class UpdateAdvertisementImagesDto {
  @ApiProperty({
    description: 'Array of new images to be uploaded',
    type: [NewImageDto],
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NewImageDto)
  newImages: NewImageDto[];

  @ApiProperty({
    description: 'Array of IDs of images to be removed',
    example: ['id1', 'id2'],
    type: [String],
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  removedImagesIds: string[];
}

export const SwaggerUpdateImagesDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'uploadImages' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiResponse({
      status: 201,
      description: 'Image(s) successfully updated',
      type: UpdateImagesResponseDto,
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
