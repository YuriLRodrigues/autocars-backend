import { Module } from '@nestjs/common';
import { DatabaseModule } from '@root/infra/database/database.module';

import { CreateBrandUseCase } from './create-brand.use-case';
import { DeleteBrandUseCase } from './delete-brand.use-case';
import { FindAllBrandsUseCase } from './find-all-brands.use-case';
import { UpdateBrandUseCase } from './update-brand.use-case';

@Module({
  imports: [DatabaseModule],
  providers: [CreateBrandUseCase, DeleteBrandUseCase, FindAllBrandsUseCase, UpdateBrandUseCase],
  exports: [CreateBrandUseCase, DeleteBrandUseCase, FindAllBrandsUseCase, UpdateBrandUseCase],
})
export class BrandUseCasesModule {}
