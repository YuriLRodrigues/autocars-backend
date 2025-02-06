import { Module } from '@nestjs/common';
import { DatabaseModule } from '@root/infra/database/database.module';

import { FindAdvertisementIsLikedUseCase } from './find-advertisement-is-liked.use-case';
import { FindAllAdvertisementLikesUseCase } from './find-all-advertisement-likes.use-case';
import { FindAllFeedbackLikesUseCase } from './find-all-feedback-likes.use-case';
import { FindFeedbackIsLikedUseCase } from './find-feedback-is-liked.use-case';
import { HandleAdvertisementLikeUseCase } from './handle-advertisement-like.use-case';
import { HandleFeedbackLikeUseCase } from './handle-feedback-like.use-case';

@Module({
  imports: [DatabaseModule],
  providers: [
    FindAdvertisementIsLikedUseCase,
    FindAllAdvertisementLikesUseCase,
    FindAllFeedbackLikesUseCase,
    FindFeedbackIsLikedUseCase,
    HandleAdvertisementLikeUseCase,
    HandleFeedbackLikeUseCase,
  ],
  exports: [
    FindFeedbackIsLikedUseCase,
    FindAllFeedbackLikesUseCase,
    FindAdvertisementIsLikedUseCase,
    FindAllAdvertisementLikesUseCase,
    HandleFeedbackLikeUseCase,
    HandleAdvertisementLikeUseCase,
  ],
})
export class LikeUseCasesModule {}
