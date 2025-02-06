import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';

import { BrandEntity } from './brand.entity';

describe('Brand - Entity', () => {
  it('should be able to create a brand as an entity', () => {
    const output = BrandEntity.create({
      logoUrl: 'url-test',
      name: 'Brand Test',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(output.id).toBeInstanceOf(UniqueEntityId);
    expect(output.logoUrl).toBe('url-test');
    expect(output.name).toBe('Brand Test');
    expect(output.createdAt).toBeInstanceOf(Date);
    expect(output.updatedAt).toBeInstanceOf(Date);
  });

  it('should be able to edit a brand if entity already created', () => {
    const entity = BrandEntity.create({
      logoUrl: 'url-test',
      name: 'Brand Test',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const output = entity.editInfo({
      logoUrl: 'new-url',
      name: 'New Brand Name Test',
    });

    expect(output.logoUrl).toBe('new-url');
    expect(output.name).toEqual('New Brand Name Test');
  });
});
