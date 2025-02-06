import { DomainError } from '@root/core/errors/domain-error';

export class EmailNotVerifiedError extends Error implements DomainError {
  constructor(email: string) {
    super(`User with email '${email}' is not verified.`);
    this.name = 'EmailNotVerifiedError';
  }
}
