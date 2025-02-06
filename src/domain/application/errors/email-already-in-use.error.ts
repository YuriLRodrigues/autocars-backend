import { DomainError } from '@root/core/errors/domain-error';

export class EmailAlreadyInUseError extends Error implements DomainError {
  constructor(email: string) {
    super(`The email '${email}' is already in use.`);
    this.name = 'EmailAlreadyInUseError';
  }
}
