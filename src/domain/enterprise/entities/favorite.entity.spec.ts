import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';

import { FavoriteEntity } from './favorite.entity';

describe('Favorite - Entity', () => {
  it('should be able to create a favorite as an entity', () => {
    const output = FavoriteEntity.create({
      advertisementId: new UniqueEntityId('1'),
      userId: new UniqueEntityId('1'),
    });

    expect(output.id).toBeInstanceOf(UniqueEntityId);
    expect(output.userId).toBeInstanceOf(UniqueEntityId);
    expect(output.createdAt).toBeInstanceOf(Date);
    expect(output.updatedAt).toBeInstanceOf(Date);
  });
});
