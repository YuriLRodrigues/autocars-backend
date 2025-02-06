import { DomainError } from '@root/core/errors/domain-error';

export class InvalidPasswordResetTokenError extends Error implements DomainError {
  constructor(token: string) {
    super(`Password reset token '${token}' is invalid.`);
    this.name = 'InvalidPasswordResetTokenError';
  }
}
