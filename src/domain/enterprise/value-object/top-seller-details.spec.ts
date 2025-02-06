import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';

import { TopSellerDetails } from './top-seller-details';

describe('Top Sellers Details - Value Object', () => {
  it('should be able to create an value object with top sellers details data', () => {
    const output = TopSellerDetails.create({
      amountSold: 10,
      id: new UniqueEntityId(),
      name: 'name test',
      profileImg: 'url-test',
      quantitySold: 5,
    });

    expect(output.id).toBeInstanceOf(UniqueEntityId);
    expect(output.amountSold).toEqual(10);
    expect(output.name).toEqual('name test');
    expect(output.profileImg).toEqual('url-test');
    expect(output.quantitySold).toEqual(5);
  });
});
