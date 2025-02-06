import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { FeedbackEntity } from '@root/domain/enterprise/entities/feedback.entity';

import { makeFakeFeedback } from './make-fake-feedback';

describe('Make Fake Feedback - Function', () => {
  it('should be able to create a feedback as an entity', () => {
    const output = makeFakeFeedback();

    expect(output).toBeInstanceOf(FeedbackEntity);
    expect(output.advertisementId).toBeInstanceOf(UniqueEntityId);
    expect(output.userId).toBeInstanceOf(UniqueEntityId);
    expect(output.id).toBeInstanceOf(UniqueEntityId);
    expect(output.stars).toBeDefined();
    expect(output.comment).toBeDefined();
    expect(output.createdAt).toBeInstanceOf(Date);
    expect(output.updatedAt).toBeInstanceOf(Date);
  });
});
