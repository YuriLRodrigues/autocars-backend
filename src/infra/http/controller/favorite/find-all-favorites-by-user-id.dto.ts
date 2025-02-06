import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { Capacity, Doors, Fuel, GearBox, SoldStatus } from '@root/domain/enterprise/entities/advertisement.entity';
import { IsString, IsNumber, IsNotEmpty, IsUrl, Length } from 'class-validator';

import { ApiPaginatedResponse } from '../../dto/pagination.dto';
import { SwaggerBadRequestDto, SwaggerResourceNotFoundDto } from '../../dto/swagger.dto';

class FavoritesAdvertisementDto {
  @ApiProperty({
    description: 'Unique identifier of the advertisement',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ description: 'Title of the advertisement', example: 'Toyota Corolla 2022' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Thumbnail URL of the advertisement', example: 'https://example.com/image.jpg' })
  @IsNotEmpty()
  @IsUrl()
  thumbnailUrl: string;

  @ApiProperty({
    description: 'BlurHash for the image, used for low-quality image preview',
    example: 'LEHV6nWB2yk8pyo0adR*.7kCMdnj',
  })
  @IsNotEmpty()
  @IsString()
  @Length(5, 255)
  blurHash: string;

  @ApiProperty({ description: 'Price of the advertisement', example: 85000 })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Kilometers driven', example: 15000 })
  @IsNotEmpty()
  @IsNumber()
  km: number;

  @ApiProperty({ example: Doors.Four, description: 'Number of doors' })
  @IsNotEmpty()
  @IsString()
  doors: string;

  @ApiProperty({ example: GearBox.Automatic, description: 'Gearbox type' })
  @IsNotEmpty()
  @IsString()
  gearBox: string;

  @ApiProperty({ example: Fuel.Flex, description: 'Fuel type' })
  @IsNotEmpty()
  @IsString()
  fuel: string;

  @ApiProperty({ example: Capacity.Five, description: 'Vehicle capacity' })
  @IsNotEmpty()
  @IsString()
  capacity: string;

  @ApiProperty({ example: SoldStatus.Reserved, description: 'Status of the advertisement' })
  @IsNotEmpty()
  @IsString()
  soldStatus: string;
}

export class FindAllFavoritesByUserIdResponseDto {
  @ApiProperty({ description: 'Unique identifier of the favorites' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Details of the advertisement related to the favorite' })
  advertisement: FavoritesAdvertisementDto;
}

export const SwaggerFindAllFavoritesByUserIdDto = () => {
  return function (target: any, key: any, descriptor: any) {
    ApiOperation({ operationId: 'findAllFavoritesByUserId' })(target, key, descriptor);
    ApiBearerAuth()(target, key, descriptor);
    ApiPaginatedResponse(FindAllFavoritesByUserIdResponseDto)(target, key, descriptor);
    ApiBadRequestResponse({ status: 400, description: 'Bad request', type: SwaggerBadRequestDto })(
      target,
      key,
      descriptor,
    );
    ApiNotFoundResponse({ status: 404, description: 'Not found', type: SwaggerResourceNotFoundDto })(
      target,
      key,
      descriptor,
    );
  };
};
