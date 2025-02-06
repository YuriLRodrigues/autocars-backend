import { EmailBadFormattedError } from '@root/domain/application/errors/email-bad-formatted-error';

import { Email } from './email';

describe('Email', () => {
  it('should be able to validate an email', () => {
    const output = Email.create('JohnDoe@hotmail.com');
    expect(output.isRight()).toBeTruthy();
    expect(output.value).toBeInstanceOf(Email);
  });

  it('Should no be able to create an email with a bad format', () => {
    const output = Email.create('JohnDoe');
    expect(output.isLeft()).toBeTruthy();
    expect(output.value).toBeInstanceOf(EmailBadFormattedError);
  });

  it('Should be able to validate email with return type boolean - False', () => {
    const output = Email.validate('JohnDoe@hotmail.com');
    expect(output).toBeTruthy();
  });

  it('Should be able to validate email with return type boolean - False', () => {
    const output = Email.validate('JohnDoe');
    expect(output).toBeFalsy();
  });
});
