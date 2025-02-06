import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';

import { AddressEntity } from './address.entity';

describe('Address - Entity', () => {
  it('should be able to create a address as an entity', () => {
    const output = AddressEntity.create({
      city: 'city test',
      country: 'brazil',
      createdAt: new Date(),
      state: 'state test',
      street: 'street test',
      neighborhood: 'neighborhood test',
      userId: new UniqueEntityId(),
      updatedAt: new Date(),
      zipCode: 12345,
    });

    expect(output).toBeInstanceOf(AddressEntity);
    expect(output.id).toBeInstanceOf(UniqueEntityId);
    expect(output.userId).toBeInstanceOf(UniqueEntityId);
    expect(output.street).toEqual('street test');
    expect(output.neighborhood).toEqual('neighborhood test');
    expect(output.city).toEqual('city test');
    expect(output.state).toEqual('state test');
    expect(output.zipCode).toEqual(12345);
    expect(output.country).toEqual('brazil');
    expect(output.createdAt).toBeInstanceOf(Date);
    expect(output.updatedAt).toBeInstanceOf(Date);
  });
});
