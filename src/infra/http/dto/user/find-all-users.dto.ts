import { ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { ApiPaginatedResponse, PaginationDto } from '../pagination.dto';
import { SwaggerBadRequestDto, SwaggerNotAllowedDto } from '../swagger.dto';
import { UserDto } from './user.dto';

export class FindAllUsersQueryDto extends PaginationDto {
  @ApiProperty({
    description: 'The ordering of the createdAt field, either "asc" or "desc"',
    enum: ['asc', 'desc'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  createdAt?: 'asc' | 'desc';

  @ApiProperty({
    description: 'The ordering of the name field, either "asc" or "desc"',
    enum: ['asc', 'desc'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  name?: 'asc' | 'desc';

  @ApiProperty({
    description: 'The ordering of the createdAt field, either "asc" or "desc"',
    enum: UserRoles,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRoles)
  role?: UserRoles;

  @ApiProperty({
    description: 'The status of the field, either "ACTIVE" or "INACTIVE"',
    enum: ['ACTIVE', 'INACTIVE'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['ACTIVE', 'INACTIVE'])
  status?: 'ACTIVE' | 'INACTIVE';

  @ApiProperty({
    description: 'The title of the username, either "ACTIVE" or "INACTIVE"',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  title?: string;
}

export class FindAllUsers extends UserDto {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: 'e2a8077f-5b32-44d6-9469-f2b1b7c022e1',
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}

export const SwaggerFindAllUsersDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiBearerAuth()(target, key, descriptor);
    ApiOperation({ operationId: 'findAllUsers' })(target, key, descriptor);
    ApiPaginatedResponse(FindAllUsers)(target, key, descriptor);
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
