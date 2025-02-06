import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';

import { SoldStatus } from '../entities/advertisement.entity';
import { UserAdvertisements } from './user-advertisements';

describe('User Advertisement - Value Object', () => {
  it('should be able to create an value object with user advertisement data', () => {
    const output = UserAdvertisements.create({
      advertisement: {
        createdAt: new Date(),
        id: new UniqueEntityId(),
        price: 100,
        soldStatus: SoldStatus.Active,
        title: 'new title',
        salePrice: 80,
      },
      user: {
        id: new UniqueEntityId(),
        username: 'name test',
        profileImg: 'url-test',
      },
    });

    expect(output.advertisement.id).toBeInstanceOf(UniqueEntityId);
    expect(output.advertisement.price).toEqual(100);
    expect(output.advertisement.price).toEqual(100);
    expect(output.advertisement.soldStatus).toEqual(SoldStatus.Active);
    expect(output.advertisement.title).toEqual('new title');
    expect(output.advertisement.salePrice).toEqual(80);
    expect(output.user.id).toBeInstanceOf(UniqueEntityId);
    expect(output.user.username).toEqual('name_test');
    expect(output.user.profileImg).toEqual('url-test');
  });
});
