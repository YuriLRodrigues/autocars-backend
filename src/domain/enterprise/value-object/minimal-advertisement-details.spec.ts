import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';

import { Doors, Capacity, Fuel, GearBox, SoldStatus, Model } from '../entities/advertisement.entity';
import { MinimalAdvertisementDetails } from './minimal-advertisement-details';

describe('Minimal Ad Details - Value Object', () => {
  it('should be able to create an value object with minimal ad details', () => {
    const output = MinimalAdvertisementDetails.create({
      advertisementId: new UniqueEntityId(),
      brand: {
        brandId: new UniqueEntityId(),
        logoUrl: 'url-test',
        name: 'name test',
      },
      km: 1000,
      price: 100,
      model: Model.SUV,
      salePrice: 120,
      likes: [],
      thumbnailUrl: 'url-test',
      blurHash: 'blur-hash',
      title: 'title test',
      capacity: Capacity.Five,
      soldStatus: SoldStatus.Active,
      doors: Doors.Four,
      fuel: Fuel.Gasoline,
      gearBox: GearBox.Manual,
    });

    expect(output.advertisementId).toBeInstanceOf(UniqueEntityId);
    expect(output.brand.brandId).toBeInstanceOf(UniqueEntityId);
    expect(output.brand.logoUrl).toEqual('url-test');
    expect(output.brand.name).toEqual('name test');
    expect(output.km).toBe(1000);
    expect(output.price).toBe(100);
    expect(output.title).toEqual('title test');
    expect(output.thumbnailUrl).toEqual('url-test');
    expect(output.blurHash).toEqual('blur-hash');
    expect(output.capacity).toEqual(Capacity.Five);
    expect(output.doors).toEqual(Doors.Four);
    expect(output.fuel).toEqual(Fuel.Gasoline);
    expect(output.model).toEqual(Model.SUV);
    expect(output.salePrice).toBe(120);
    expect(output.likes).toEqual([]);
    expect(output.soldStatus).toEqual(SoldStatus.Active);
    expect(output.gearBox).toEqual(GearBox.Manual);
  });
});
