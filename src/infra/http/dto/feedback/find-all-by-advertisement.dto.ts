import { ApiBadRequestResponse, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

import { ApiPaginatedResponse } from '../pagination.dto';
import { SwaggerBadRequestDto } from '../swagger.dto';

export class UserDto {
  @ApiProperty({ description: 'Unique identifier of the user', format: 'uuid' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'User avatar URL', required: false })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ description: 'Blur hash for the avatar image', required: false })
  @IsOptional()
  @IsString()
  blurHash?: string;

  @ApiProperty({ description: 'User full name' })
  @IsString()
  name: string;
}

export class FeedbackDetailsDto {
  @ApiProperty({ description: 'Unique identifier of the feedback', format: 'uuid' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Title of the feedback', format: 'uuid' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'User who provided the feedback' })
  @Type(() => UserDto)
  user: UserDto;

  @ApiProperty({ description: 'Date when the feedback was created', type: Date })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'Star rating given by the user', example: 5 })
  @IsNumber()
  stars: number;

  @ApiProperty({ description: 'User comment' })
  @IsString()
  comment: string;

  @ApiProperty({ description: 'Total number of likes on this feedback', example: 10 })
  @IsNumber()
  totalLikes: number;
}

export const SwaggerFindAllFeedbacksByAdIdDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'findAllFeedbacksByAdId' })(target, key, descriptor);
    ApiPaginatedResponse(FeedbackDetailsDto)(target, key, descriptor);
    ApiBadRequestResponse({ status: 400, description: 'Bad request', type: SwaggerBadRequestDto })(
      target,
      key,
      descriptor,
    );
  };
};
