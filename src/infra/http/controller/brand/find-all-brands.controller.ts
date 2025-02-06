import {
  BadRequestException,
  ConflictException,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceAlreadyExistsError } from '@root/core/errors/resource-already-exists-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { FindAllBrandsUseCase } from '@root/domain/application/use-cases/brand/find-all-brands.use-case';
import { Public } from '@root/infra/auth/public';

import { SwaggerFindAllBrandsDto } from '../../dto/brand/find-all-brands.dto';
import { PaginationDto } from '../../dto/pagination.dto';
import { BrandViewModel } from '../../view-model/brand/brand.view-model';

@Controller('/brand')
@ApiTags('Brand - Controller')
export class FindAllBrandsController {
  constructor(private readonly findAllBrandsUseCase: FindAllBrandsUseCase) {}

  @SwaggerFindAllBrandsDto()
  @Public()
  @Get()
  async handle(@Query() query: PaginationDto) {
    const { limit, page } = query;

    const brands = await this.findAllBrandsUseCase.execute({ limit: Number(limit) || 1000, page: Number(page) || 1 });

    if (brands.isLeft()) {
      const error = brands.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            error: error.message,
          });
        case NotAllowedError:
          throw new UnauthorizedException({
            statusCode: HttpStatus.UNAUTHORIZED,
            error: error.message,
          });
        case ResourceAlreadyExistsError:
          throw new ConflictException({
            statusCode: HttpStatus.CONFLICT,
            error: error.message,
          });
        default:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Internal API error',
          });
      }
    }

    return {
      results: brands.value.data.map(BrandViewModel.toHttp),
      meta: brands.value.meta,
    };
  }
}
