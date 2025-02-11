import { Module } from '@nestjs/common';
import { DatabaseModule } from '@root/infra/database/database.module';

import { FindAdvertisementIsFavoritedUseCase } from './find-advertisement-is-favorited.use-case';
import { FindAllFavoritesByUserIdUseCase } from './find-all-favorites-by-user-id.use-case';
import { FindAllFavoritesUseCase } from './find-all-favorites.use-case';
import { FindDistinctFavoritesCountUseCase } from './find-distinct-favorites-count.use-case';
import { FindFavoritesCountByAdvertisementUseCase } from './find-favorites-count-by-advertisement.use-case';
import { FindFavoritesCountUseCase } from './find-favorites-count.use-case';
import { HandleFavoriteUseCase } from './handle-favorite.use-case';

@Module({
  imports: [DatabaseModule],
  providers: [
    FindAllFavoritesUseCase,
    FindAllFavoritesByUserIdUseCase,
    FindDistinctFavoritesCountUseCase,
    FindFavoritesCountUseCase,
    FindFavoritesCountByAdvertisementUseCase,
    FindAdvertisementIsFavoritedUseCase,
    HandleFavoriteUseCase,
  ],
  exports: [
    FindAllFavoritesUseCase,
    FindAllFavoritesByUserIdUseCase,
    FindDistinctFavoritesCountUseCase,
    FindFavoritesCountUseCase,
    FindFavoritesCountByAdvertisementUseCase,
    FindAdvertisementIsFavoritedUseCase,
    HandleFavoriteUseCase,
  ],
})
export class FavoriteUseCasesModule {}
