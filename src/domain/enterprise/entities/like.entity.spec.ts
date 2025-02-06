import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';

import { LikeEntity } from './like.entity';

describe('Like - Entity', () => {
  it('should be able to create a like in advertisement as an entity', () => {
    const output = LikeEntity.create({
      userId: new UniqueEntityId('1'),
      advertisementId: new UniqueEntityId('1'),
    });

    expect(output.id).toBeInstanceOf(UniqueEntityId);
    expect(output.advertisementId).toBeInstanceOf(UniqueEntityId);
    expect(output.userId).toBeInstanceOf(UniqueEntityId);
    expect(output.feedbackId).toBeNull();
    expect(output.createdAt).toBeInstanceOf(Date);
    expect(output.updatedAt).toBeInstanceOf(Date);
  });

  it('should be able to create a like in feedback as an entity', () => {
    const output = LikeEntity.create({
      userId: new UniqueEntityId('1'),
      advertisementId: new UniqueEntityId('1'),
      feedbackId: new UniqueEntityId('1'),
    });

    expect(output.id).toBeInstanceOf(UniqueEntityId);
    expect(output.advertisementId).toBeInstanceOf(UniqueEntityId);
    expect(output.advertisementId.toValue()).toEqual('1');
    expect(output.userId).toBeInstanceOf(UniqueEntityId);
    expect(output.userId.toValue()).toEqual('1');
    expect(output.feedbackId).toBeInstanceOf(UniqueEntityId);
    expect(output.feedbackId.toValue()).toEqual('1');
    expect(output.createdAt).toBeInstanceOf(Date);
    expect(output.updatedAt).toBeInstanceOf(Date);
  });
});
