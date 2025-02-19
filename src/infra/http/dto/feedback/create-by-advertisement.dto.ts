import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { IsNumber, IsString, Max, Min } from 'class-validator';

import { SwaggerBadRequestDto } from '../swagger.dto';

export class CreateFeedbackByAdIdBodyDto {
  @ApiProperty({ description: 'Feedback comment', example: 'Great product!', maxLength: 500 })
  @IsString()
  comment: string;

  @ApiProperty({ description: 'Title of the feedback', example: 'Amazing quality!' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Star rating given by the user', example: 5, minimum: 1, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  stars: number;
}

class CreateFeedbackByAdResponseDto {
  @ApiProperty({
    description: 'Api response message according to request',
    example: 'Feedback successfully created',
  })
  message: string;
}

export const SwaggerCreateFeedbackByAdIdDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'createFeedbackByAdId' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiResponse({ type: CreateFeedbackByAdResponseDto, status: 201, description: 'Feedback created' })(
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
