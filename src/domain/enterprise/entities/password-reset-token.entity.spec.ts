import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';

import { PasswordResetToken } from './password-reset-token.entity';

describe('Passoword Reset Token - Entity', () => {
  it('should be able to create a passoword reset token', () => {
    const output = PasswordResetToken.create({ email: 'johnDoe@hotmail.com' });
    expect(output).instanceOf(PasswordResetToken);
    expect(output.id).not.toBeUndefined();
    expect(output.email).toBe('johnDoe@hotmail.com');
    expect(output.token).toBeDefined();
    expect(output.createdAt).instanceOf(Date);
    expect(output.updatedAt).instanceOf(Date);
  });

  it('should be able to create a passoword reset token with id', () => {
    const id = new UniqueEntityId();
    const output = PasswordResetToken.create({ email: 'johndoe@htomail.com' }, id);
    expect(output.id).toBe(id);
  });
});
