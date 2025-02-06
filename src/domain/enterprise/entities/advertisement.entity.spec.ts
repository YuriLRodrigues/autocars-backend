import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';

import { AdvertisementEntity, Capacity, Color, Doors, Fuel, GearBox, Model, SoldStatus } from './advertisement.entity';

describe('Advertisement - Entity', () => {
  it('should be able to create a ad as an entity', () => {
    const output = AdvertisementEntity.create({
      brandId: new UniqueEntityId(),
      capacity: Capacity.Two,
      color: Color.Black,
      description: 'description test',
      doors: Doors.Two,
      fuel: Fuel.Gasoline,
      gearBox: GearBox.Automatic,
      km: 100,
      localization: 'MG',
      model: Model.Sedan,
      phone: '31322332',
      price: 50000,
      thumbnailUrl: 'url-test',
      title: 'Title Test',
      userId: new UniqueEntityId(),
      year: 2024,
      details: ['detalhe: batido', 'lateral: arranhada'],
      salePrice: null,
      soldStatus: SoldStatus.Active,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(output.brandId).toBeInstanceOf(UniqueEntityId);
    expect(output.capacity).toEqual(Capacity.Two);
    expect(output.color).toEqual(Color.Black);
    expect(output.description).toBe('description test');
    expect(output.doors).toEqual(Doors.Two);
    expect(output.fuel).toEqual(Fuel.Gasoline);
    expect(output.gearBox).toEqual(GearBox.Automatic);
    expect(output.km).toBe(100);
    expect(output.localization).toBe('MG');
    expect(output.model).toEqual(Model.Sedan);
    expect(output.phone).toBe('31322332');
    expect(output.price).toBe(50000);
    expect(output.thumbnailUrl).toBe('url-test');
    expect(output.title).toEqual('Title Test');
    expect(output.userId).toBeInstanceOf(UniqueEntityId);
    expect(output.year).toEqual(2024);
    expect(output.details).toEqual(['detalhe: batido', 'lateral: arranhada']);
    expect(output.salePrice).toBe(null);
    expect(output.soldStatus).toBe(SoldStatus.Active);
    expect(output.createdAt).toBeInstanceOf(Date);
    expect(output.updatedAt).toBeInstanceOf(Date);
  });
});
