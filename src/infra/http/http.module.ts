import { Module } from '@nestjs/common';
import { AddressUseCasesModule } from '@root/domain/application/use-cases/address/address-use-cases.module';
import { AdvertisementUseCasesModule } from '@root/domain/application/use-cases/advertisement/advertisement-use-cases.module';
import { BrandUseCasesModule } from '@root/domain/application/use-cases/brand/brand-use-cases.module';
import { FavoriteUseCasesModule } from '@root/domain/application/use-cases/favorite/favorite-use-cases.module';
import { ImageUseCasesModule } from '@root/domain/application/use-cases/image/image-use-cases.module';
import { LikeUseCasesModule } from '@root/domain/application/use-cases/like/like-use-cases.module';
import { UserUseCasesModule } from '@root/domain/application/use-cases/user/user-use-cases.module';

import { UpdateAddressController } from './controller/address/update-address.controller';
import { CreateAdvertisementController } from './controller/advertisemet/create-ad.controller';
import { DeleteAdvertisementController } from './controller/advertisemet/delete-ad.controller';
import { FindAdvertisementByIdController } from './controller/advertisemet/find-ad-by-id.controller';
import { FindAllAdvertisementsByUserIdController } from './controller/advertisemet/find-all-ads-by-user-id.controller';
import { FindAllAdvertisementsController } from './controller/advertisemet/find-all-ads.controller';
import { FindAdvertisementsMetricsByUserIdController } from './controller/advertisemet/find-all-advertisements-metrics-by-user-id.controller';
import { FindAdvertisementsMetricsController } from './controller/advertisemet/find-all-advertisements-metrics.controller';
import { FindAllManagerAdvertisementsController } from './controller/advertisemet/find-all-manager-ads.controller';
import { FindAllOwnAdvertisementsController } from './controller/advertisemet/find-all-own-ads.controller';
import { FindAllSoldAdsController } from './controller/advertisemet/find-all-sold-ads.controller';
import { UpdateAdvertisementController } from './controller/advertisemet/update-ad.controller';
import { CreateBrandController } from './controller/brand/create-brand.controller';
import { DeleteBrandController } from './controller/brand/delete-brand.controller';
import { FindAllBrandsController } from './controller/brand/find-all-brands.controller';
import { UpdateBrandController } from './controller/brand/update-brand.controller';
import { FindAllFavoritesByUserIdController } from './controller/favorite/find-all-favorites-by-user-id.controller';
import { FindAllFavoritesController } from './controller/favorite/find-all-favorites.controller';
import { FindDistinctFavoritesCountController } from './controller/favorite/find-distinct-favorites-count.controller';
import { FindFavoritesCountByAdvertisementController } from './controller/favorite/find-favorites-count-by-advertisement.controller';
import { FindFavoritesCountController } from './controller/favorite/find-favorites-count.controller';
import { HandleFavoriteController } from './controller/favorite/handle-favorite.controller';
import { DeleteImageController } from './controller/image/delete-image.controller';
import { FindAllImagesController } from './controller/image/find-all-images.controller';
import { FindImagesMetricsController } from './controller/image/find-images-metrics.controller';
import { UploadImagesController } from './controller/image/upload-images.controller';
import { FindAdvertisementIsLikedController } from './controller/like/find-advertisement-is-liked.controller';
import { FindAllAdvertisementLikesLikeController } from './controller/like/find-all-advertisement-likes.controller';
import { FindAllFeedbackLikesController } from './controller/like/find-all-feedback-likes.controller';
import { FindFeedbackIsLikedController } from './controller/like/find-feedback-is-liked.controller';
import { HandleAdvertisementLikeController } from './controller/like/handle-advertisement-like.controller';
import { HandleFeedbackLikeController } from './controller/like/handle-feedback-like.controller';
import { DeleteOwnUserController } from './controller/user/delete-own-user.controller';
import { DeleteUserController } from './controller/user/delete-user.controller';
import { FindAllTopSellersController } from './controller/user/find-all-top-sellers.controller';
import { FindAllUsersController } from './controller/user/find-all-users.controller';
import { ForgotPasswordController } from './controller/user/forgot-password.controller';
import { HandleActiveUserController } from './controller/user/handle-active-user.controller';
import { FindMeController } from './controller/user/me.controller';
import { NewPasswordController } from './controller/user/new-password.controller';
import { SignInController } from './controller/user/sign-in.controller';
import { SignUpController } from './controller/user/sign-up.controller';
import { UpdateOwnUserController } from './controller/user/update-own-user.controller';

@Module({
  imports: [
    AdvertisementUseCasesModule,
    UserUseCasesModule,
    ImageUseCasesModule,
    BrandUseCasesModule,
    LikeUseCasesModule,
    AddressUseCasesModule,
    FavoriteUseCasesModule,
  ],
  controllers: [
    CreateAdvertisementController,
    DeleteAdvertisementController,
    FindAdvertisementByIdController,
    FindAllAdvertisementsByUserIdController,
    FindAllOwnAdvertisementsController,
    FindAllManagerAdvertisementsController,
    FindAdvertisementsMetricsByUserIdController,
    FindAdvertisementsMetricsController,
    FindAllAdvertisementsController,
    FindAllSoldAdsController,
    UpdateAdvertisementController,

    HandleActiveUserController,
    DeleteOwnUserController,
    DeleteUserController,
    FindAllTopSellersController,
    FindAllUsersController,
    ForgotPasswordController,
    NewPasswordController,
    SignInController,
    SignUpController,
    FindMeController,
    UpdateOwnUserController,

    DeleteImageController,
    FindAllImagesController,
    FindImagesMetricsController,
    UploadImagesController,

    CreateBrandController,
    UpdateBrandController,
    DeleteBrandController,
    FindAllBrandsController,

    FindAdvertisementIsLikedController,
    FindAllAdvertisementLikesLikeController,
    HandleAdvertisementLikeController,
    FindFeedbackIsLikedController,
    FindAllFeedbackLikesController,
    HandleFeedbackLikeController,

    UpdateAddressController,

    FindAllFavoritesByUserIdController,
    FindAllFavoritesController,
    FindDistinctFavoritesCountController,
    FindFavoritesCountByAdvertisementController,
    FindFavoritesCountController,
    HandleFavoriteController,
  ],
})
export class HttpModule {}
