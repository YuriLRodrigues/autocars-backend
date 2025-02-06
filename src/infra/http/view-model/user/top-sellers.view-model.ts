import { TopSellerDetails } from '@root/domain/enterprise/value-object/top-seller-details';

export class TopSellersViewModel {
  static toHttp(topSellers: TopSellerDetails) {
    return {
      id: topSellers.id.toValue(),
      profileImg: topSellers.profileImg,
      name: topSellers.name,
      roles: topSellers.roles,
      amountSold: topSellers.amountSold,
      quantitySold: topSellers.quantitySold,
    };
  }
}
