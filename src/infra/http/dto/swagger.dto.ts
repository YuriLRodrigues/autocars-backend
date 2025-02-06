import { ApiProperty } from '@nestjs/swagger';

export class SwaggerInactiveResourceErrorDto {
  @ApiProperty({ default: 'Inactive resource' })
  message: string;

  @ApiProperty({ default: 'InactiveResourceError' })
  error: string;

  @ApiProperty({
    default: 401,
  })
  statusCode: number;
}

export class SwaggerNotAllowedDto {
  @ApiProperty({ default: 'Not allowed' })
  message: string;

  @ApiProperty({ default: 'NotAllowedError' })
  error: string;

  @ApiProperty({
    default: 403,
  })
  statusCode: number;
}

export class SwaggerResourceAlreadyExistsDto {
  @ApiProperty({ default: 'Resource already exists' })
  message: string;

  @ApiProperty({ default: 'ResourceAlweadyExistsError' })
  error: string;

  @ApiProperty({
    default: 409,
  })
  statusCode: number;
}

export class SwaggerResourceNotFoundDto {
  @ApiProperty({ default: 'Resource not found' })
  message: string;

  @ApiProperty({ default: 'ResourceNotFoundError' })
  error: string;

  @ApiProperty({
    default: 404,
  })
  statusCode: number;
}

export class SwaggerBadRequestDto {
  @ApiProperty({ default: 'Bad request' })
  message: string;

  @ApiProperty({ default: 'BadRequestError' })
  error: string;

  @ApiProperty({ default: 400 })
  statusCode: number;
}

export class SwaggerUnauthorizedDto {
  @ApiProperty({ default: 'Unauthorized' })
  message: string;

  @ApiProperty({
    default: 401,
  })
  statusCode: number;
}

export class SwaggerInvalidPasswordResetTokenDto {
  @ApiProperty({ default: 'Invalid password to reset token' })
  message: string;

  @ApiProperty({
    default: 401,
  })
  statusCode: number;
}

export class SwaggerExpiredPasswordResetTokenDto {
  @ApiProperty({ default: 'Expired token to change password' })
  message: string;

  @ApiProperty({
    default: 401,
  })
  statusCode: number;
}

export class SwaggerEmailBadFormattedDto {
  @ApiProperty({ default: `The email 'EMAIL' is bad formatted.` })
  message: string;

  @ApiProperty({ default: 'EmailBadFormattedError' })
  error: string;

  @ApiProperty({
    default: 400,
  })
  statusCode: number;
}

export class SwaggerImageTypeErrorDto {
  @ApiProperty({ default: `Unsupported file type: 'FILETYPE'.` })
  message: string;

  @ApiProperty({ default: 'ImageTypeErrorError' })
  error: string;

  @ApiProperty({
    default: 400,
  })
  statusCode: number;
}

export class SwaggerImageSizeErrorDto {
  @ApiProperty({ default: `File size exceeds the maximum limit of 5MB: 'FILESIZE' bytes` })
  message: string;

  @ApiProperty({ default: 'ImageTypeErrorError' })
  error: string;

  @ApiProperty({
    default: 400,
  })
  statusCode: number;
}
