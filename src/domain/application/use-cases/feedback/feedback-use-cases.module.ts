import { Module } from '@nestjs/common';
import { DatabaseModule } from '@root/infra/database/database.module';

import { CreateFeedbackUseCase } from './create-feedback.use-case';
import { DeleteFeedbackUseCase } from './delete-feedback.use-case';
import { FindAllByAdvertisementIdUseCase } from './find-all-by-advertisement-id.use-case';
import { UpdateFeedbackUseCase } from './update-feedback.use-case';

@Module({
  imports: [DatabaseModule],
  providers: [CreateFeedbackUseCase, DeleteFeedbackUseCase, FindAllByAdvertisementIdUseCase, UpdateFeedbackUseCase],
  exports: [CreateFeedbackUseCase, DeleteFeedbackUseCase, FindAllByAdvertisementIdUseCase, UpdateFeedbackUseCase],
})
export class FeedbackUseCasesModule {}
