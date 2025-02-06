import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { InMemoryEnvService } from '@root/infra/env/in-memory-env.service';
import { makeFakePasswordResetToken } from 'test/factory/make-fake-password-reset-token';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryLikeAdvertisementRepository } from 'test/repositories/in-memory-like-advertisement-repository';
import { InMemoryMailerRepository } from 'test/repositories/in-memory-mailer.repository';
import { InMemoryPasswordResetTokensRepository } from 'test/repositories/in-memory-password-reset-tokens.repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { EmailBadFormattedError } from '../../errors/email-bad-formatted-error';
import { ForgotPasswordUseCase } from './forgot-password.use-case';

describe('Forgot Password - Use Case', () => {
  let sut: ForgotPasswordUseCase;
  let inMemoryPasswordResetTokensRepository: InMemoryPasswordResetTokensRepository;
  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryAdvertisementRepository: InMemoryAdvertisementRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryLikeAdvertisementRepository: InMemoryLikeAdvertisementRepository;
  let inMemoryMailerRepository: InMemoryMailerRepository;
  let inMemoryEnvService: InMemoryEnvService;
  let inMemoryImageRepository: InMemoryImageRepository;
  let inMemoryAddressRepository: InMemoryAddressRepository;

  beforeEach(() => {
    inMemoryBrandRepository = new InMemoryBrandRepository();
    inMemoryImageRepository = new InMemoryImageRepository();
    inMemoryAddressRepository = new InMemoryAddressRepository();
    inMemoryUserRepository = new InMemoryUserRepository(inMemoryAdvertisementRepository);
    inMemoryLikeAdvertisementRepository = new InMemoryLikeAdvertisementRepository();
    inMemoryAdvertisementRepository = new InMemoryAdvertisementRepository(
      inMemoryBrandRepository,
      inMemoryLikeAdvertisementRepository,
      inMemoryUserRepository,
      inMemoryImageRepository,
      inMemoryAddressRepository,
    );
    inMemoryEnvService = new InMemoryEnvService({ APP_URL_AUTOCARS: 'http://localhost:3000' });
    inMemoryMailerRepository = new InMemoryMailerRepository();
    inMemoryPasswordResetTokensRepository = new InMemoryPasswordResetTokensRepository();

    sut = new ForgotPasswordUseCase(
      inMemoryPasswordResetTokensRepository,
      inMemoryUserRepository,
      inMemoryMailerRepository,
      inMemoryEnvService,
    );
  });

  it('should be able to forgot password', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({ email: user.email });

    expect(output.isRight()).toBe(true);
    expect(inMemoryPasswordResetTokensRepository.items).toHaveLength(1);
    expect(inMemoryPasswordResetTokensRepository.items[0].email).toBe(user.email);
    expect(inMemoryMailerRepository.mailers).toHaveLength(1);
    expect(inMemoryMailerRepository.mailers[0].userId.toValue()).toEqual(user.id.toValue());
  });

  it('should not be able to forgot password with invalid email', async () => {
    const output = await sut.execute({ email: 'invalid_email' });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(EmailBadFormattedError);
  });

  it('should not be able to send forgot password token if user not found', async () => {
    const user = makeFakeUser();
    const output = await sut.execute({ email: user.email });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it('should be able to send forgot password token if user already has a token', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const passwordResetToken = makeFakePasswordResetToken({ email: user.email });
    inMemoryPasswordResetTokensRepository.sendToken(passwordResetToken);

    const output = await sut.execute({ email: user.email });

    expect(output.isRight()).toBe(true);
    expect(inMemoryPasswordResetTokensRepository.items).toHaveLength(1);
    expect(inMemoryMailerRepository.mailers).toHaveLength(1);
    expect(inMemoryMailerRepository.mailers[0].userId.toValue()).toEqual(user.id.toValue());
    expect(inMemoryPasswordResetTokensRepository.items[0].token).not.toBe(passwordResetToken.token);
  });
});
