import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';

import { Mail, MailType } from './mail';

describe('Mail - Entity', () => {
  it('should be able to create a mail as an entity', () => {
    const output = Mail.create({
      body: 'body-test',
      email: 'email@example.com',
      subject: 'Subject Test',
      userId: new UniqueEntityId('1'),
      type: MailType.FORGOT_PASSWORD,
      createdAt: new Date(),
    });

    expect(output.email).toEqual('email@example.com');
    expect(output.subject).toEqual('Subject Test');
    expect(output.body).toEqual('body-test');
    expect(output.type).toEqual(MailType.FORGOT_PASSWORD);
    expect(output.userId).toBeInstanceOf(UniqueEntityId);
    expect(output.userId.toValue()).toEqual('1');
    expect(output.createdAt).toBeInstanceOf(Date);
  });
});
