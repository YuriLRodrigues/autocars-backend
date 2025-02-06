import { Module } from '@nestjs/common';
import { DatabaseModule } from '@root/infra/database/database.module';
import { StorageModule } from '@root/infra/storage/storage.module';

import { DeleteImageUseCase } from './delete-image.use-case';
import { FindAllImagesUseCase } from './find-all-images.use-case';
import { FindImagesMetricsUseCase } from './find-images-metrics.use-case';
import { UpdateImageUseCase } from './update-image.use-case';
import { UploadImageUseCase } from './upload-image.use-case';

@Module({
  imports: [DatabaseModule, StorageModule],
  providers: [
    DeleteImageUseCase,
    UpdateImageUseCase,
    UploadImageUseCase,
    FindAllImagesUseCase,
    FindImagesMetricsUseCase,
  ],
  exports: [DeleteImageUseCase, UpdateImageUseCase, UploadImageUseCase, FindAllImagesUseCase, FindImagesMetricsUseCase],
})
export class ImageUseCasesModule {}
