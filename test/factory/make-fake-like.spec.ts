import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { LikeEntity } from '@root/domain/enterprise/entities/like.entity';

import { makeFakeLike } from './make-fake-like';

describe('Make Fake Like - Function', () => {
  it('should be able to create a like as an entity', () => {
    const output = makeFakeLike();

    expect(output).toBeInstanceOf(LikeEntity);
    expect(output.advertisementId).toBeInstanceOf(UniqueEntityId);
    expect(output.userId).toBeInstanceOf(UniqueEntityId);
    expect(output.id).toBeInstanceOf(UniqueEntityId);
    expect(output.feedbackId).toBeInstanceOf(UniqueEntityId);
    expect(output.createdAt).toBeInstanceOf(Date);
    expect(output.updatedAt).toBeInstanceOf(Date);
  });
});
