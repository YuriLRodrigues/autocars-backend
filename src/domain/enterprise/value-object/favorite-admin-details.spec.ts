import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';

import { SoldStatus } from '../entities/advertisement.entity';
import { FavoriteAdminDetails } from './favorite-admin-details';

describe('Favorite Admin Details - Value Object', () => {
  it('should be able to create an value object with favorite admin details data', () => {
    const output = FavoriteAdminDetails.create({
      advertisement: {
        status: SoldStatus.Active,
        id: new UniqueEntityId(),
        price: 100,
        thumbnailUrl: 'url-test',
        blurHash: 'blur-hash',
        title: 'new title',
      },
      createdAt: new Date(),
      favoritesCount: 10,
      id: new UniqueEntityId(),
      user: {
        avatar: 'url-test',
        id: new UniqueEntityId(),
        name: 'name test',
      },
    });

    expect(output.advertisement.id).toBeInstanceOf(UniqueEntityId);
    expect(output.advertisement.status).toEqual(SoldStatus.Active);
    expect(output.advertisement.price).toEqual(100);
    expect(output.advertisement.blurHash).toEqual('blur-hash');
    expect(output.advertisement.thumbnailUrl).toEqual('url-test');
    expect(output.advertisement.title).toEqual('new title');
    expect(output.user.id).toBeInstanceOf(UniqueEntityId);
    expect(output.user.name).toEqual('name test');
    expect(output.user.avatar).toEqual('url-test');
  });
});
