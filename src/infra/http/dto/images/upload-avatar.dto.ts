import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import {
  SwaggerBadRequestDto,
  SwaggerImageSizeErrorDto,
  SwaggerImageTypeErrorDto,
  SwaggerResourceNotFoundDto,
} from '../swagger.dto';

export class AvatarDto {
  @ApiProperty({
    description: 'BlurHash representation of the avatar image',
    example: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
  })
  @IsString()
  @IsNotEmpty()
  blurHash: string;

  @ApiProperty({
    description: 'URL of the avatar image',
    example: 'https://example.com/avatar.png',
  })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    description: 'Unique identifier of the avatar',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}

export const SwaggerUploadAvatarDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'uploadAvatar' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiResponse({
      status: 201,
      description: 'Avatar successfully uploaded',
      type: AvatarDto,
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
