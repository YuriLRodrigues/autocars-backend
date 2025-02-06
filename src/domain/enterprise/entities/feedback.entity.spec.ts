import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';

import { FeedbackEntity } from './feedback.entity';

describe('Feedback - Entity', () => {
  it('should be able to create a feedback entity', () => {
    const output = FeedbackEntity.create({
      advertisementId: new UniqueEntityId('1'),
      comment: 'Comment Test',
      title: 'Title',
      stars: 5,
      userId: new UniqueEntityId('1'),
    });

    expect(output.advertisementId.toValue()).toEqual('1');
    expect(output.advertisementId).toBeInstanceOf(UniqueEntityId);
    expect(output.userId.toValue()).toEqual('1');
    expect(output.userId).toBeInstanceOf(UniqueEntityId);
    expect(output.stars).toEqual(5);
    expect(output.comment).toEqual('Comment Test');
    expect(output.title).toEqual('Title');
    expect(output.createdAt).toBeInstanceOf(Date);
    expect(output.updatedAt).toBeInstanceOf(Date);
  });
  it('should be able to edit a feedback entity if the entity already created ', () => {
    const entity = FeedbackEntity.create({
      advertisementId: new UniqueEntityId('1'),
      comment: 'Comment Test',
      stars: 5,
      title: 'Title',
      userId: new UniqueEntityId('1'),
    });

    const output = entity.editInfo({
      comment: 'New Comment',
      stars: 1,
    });

    expect(output.comment).toEqual('New Comment');
    expect(output.stars).toBe(1);
  });
});
