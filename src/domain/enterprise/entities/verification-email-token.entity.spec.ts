import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';

import { VerificationEmailToken } from './verification-email-token.entity';

describe('Verification Email Token - Entity', () => {
  it('should be able to create a verification email token', () => {
    const output = VerificationEmailToken.create({
      email: 'JohnDoe@hotmail.com',
      token: new UniqueEntityId(),
    });

    expect(output).instanceOf(VerificationEmailToken);
    expect(output.id).not.toBeUndefined();
    expect(output.email).toBe('JohnDoe@hotmail.com');
    expect(output.token).not.toBeUndefined();
    expect(output.createdAt).instanceOf(Date);
    expect(output.updatedAt).instanceOf(Date);
  });

  it('should be able to create a verification email token with id', () => {
    const id = new UniqueEntityId();

    const output = VerificationEmailToken.create(
      {
        email: 'JohnDoe@hotmail.com',
        token: new UniqueEntityId(),
      },
      id,
    );

    expect(output.id).toBe(id);
  });
});
