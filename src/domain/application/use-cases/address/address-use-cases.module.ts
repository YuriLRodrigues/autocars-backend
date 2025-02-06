import { Module } from '@nestjs/common';
import { DatabaseModule } from '@root/infra/database/database.module';

import { UpdateAddressUseCase } from './update-address.use-case';

@Module({
  imports: [DatabaseModule],
  providers: [UpdateAddressUseCase],
  exports: [UpdateAddressUseCase],
})
export class AddressUseCasesModule {}
