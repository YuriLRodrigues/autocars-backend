import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';

import { Capacity, Doors, Fuel, GearBox, SoldStatus } from '../entities/advertisement.entity';
import { FavoriteDetails } from './favorite-details';

describe('Favorite Details - Value Object', () => {
  it('should be able to create an value object with favorite details data', () => {
    const output = FavoriteDetails.create({
      id: new UniqueEntityId(),
      advertisement: {
        id: new UniqueEntityId(),
        price: 100,
        thumbnailUrl: 'url-test',
        blurHash: 'blur-hash',
        title: 'new title',
        capacity: Capacity.Two,
        doors: Doors.Four,
        fuel: Fuel.Gasoline,
        gearBox: GearBox.Manual,
        km: 10000,
        soldStatus: SoldStatus.Active,
      },
    });

    expect(output.id).toBeInstanceOf(UniqueEntityId);
    expect(output.advertisement.id).toBeInstanceOf(UniqueEntityId);
    expect(output.advertisement.price).toEqual(100);
    expect(output.advertisement.soldStatus).toEqual(SoldStatus.Active);
    expect(output.advertisement.title).toEqual('new title');
    expect(output.advertisement.blurHash).toEqual('blur-hash');
    expect(output.advertisement.capacity).toEqual(Capacity.Two);
    expect(output.advertisement.doors).toEqual(Doors.Four);
    expect(output.advertisement.fuel).toEqual(Fuel.Gasoline);
    expect(output.advertisement.gearBox).toEqual(GearBox.Manual);
    expect(output.advertisement.km).toEqual(10000);
    expect(output.advertisement.thumbnailUrl).toEqual('url-test');
  });
});
