import { Module } from '@nestjs/common';
import { Uploader } from '@root/domain/application/repositories/uploader.repository';

import { EnvModule } from '../env/env.module';
import { MinioStorage } from './minio.storage';

@Module({
  imports: [EnvModule],
  providers: [{ provide: Uploader, useClass: MinioStorage }],
  exports: [Uploader],
})
export class StorageModule {}
