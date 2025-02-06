import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { makeFakeLike } from 'test/factory/make-fake-like';

import { FeedbackDetails } from './feedback-details';

describe('Feedback Details - Value Object', () => {
  it('should be able to create a new feedback details with value object', () => {
    const output = FeedbackDetails.create({
      comment: 'Comment Test',
      feedbackId: new UniqueEntityId('1'),
      likes: [makeFakeLike()],
      stars: 5,
      user: {
        name: 'user name test',
        userId: new UniqueEntityId('1'),
      },
    });

    expect(output.feedbackId).toBeInstanceOf(UniqueEntityId);
    expect(output.feedbackId.toValue()).toEqual('1');
    expect(output.userId).toBeInstanceOf(UniqueEntityId);
    expect(output.userId.toValue()).toEqual('1');
    expect(output.userName).toEqual('user name test');
    expect(output.comment).toEqual('Comment Test');
    expect(output.likes).toHaveLength(1);
    expect(output.stars).toEqual(5);
  });
});
