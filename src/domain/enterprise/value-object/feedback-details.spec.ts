import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';

import { FeedbackDetails } from './feedback-details';

describe('Feedback Details - Value Object', () => {
  it('should be able to create a new feedback details with value object', () => {
    const output = FeedbackDetails.create({
      comment: 'Comment Test',
      id: new UniqueEntityId('1'),
      stars: 5,
      title: 'Title',
      user: {
        id: new UniqueEntityId('1'),
        name: 'User name test',
        avatar: 'avatar.jpg',
        blurHash: '#testblurhash',
      },
      totalLikes: 10,
      createdAt: new Date('2022-01-01'),
    });

    expect(output.id).toBeInstanceOf(UniqueEntityId);
    expect(output.user.id).toBeInstanceOf(UniqueEntityId);
    expect(output.title).toEqual('Title');
    expect(output.comment).toEqual('Comment Test');
    expect(output.stars).toEqual(5);
    expect(output.totalLikes).toEqual(10);
    expect(output.user.name).toEqual('User name test');
    expect(output.user.avatar).toEqual('avatar.jpg');
    expect(output.user.blurHash).toEqual('#testblurhash');
    expect(output.createdAt).toBeInstanceOf(Date);
  });
});
