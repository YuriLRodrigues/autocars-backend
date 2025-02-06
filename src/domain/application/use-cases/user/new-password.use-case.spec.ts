import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { makeFakePasswordResetToken } from 'test/factory/make-fake-password-reset-token';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryLikeAdvertisementRepository } from 'test/repositories/in-memory-like-advertisement-repository';
import { InMemoryPasswordResetTokensRepository } from 'test/repositories/in-memory-password-reset-tokens.repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { ExpiredPasswordResetTokenError } from '../../errors/expired-password-reset-token.error';
import { InvalidPasswordResetTokenError } from '../../errors/invalid-password-reset-token.error';
import { NewPasswordUseCase } from './new-password.use-case';

describe('New Password - Use Case', () => {
  let sut: NewPasswordUseCase;
  let inMemoryPasswordResetTokensRepository: InMemoryPasswordResetTokensRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryAdvertisementRepository: InMemoryAdvertisementRepository;
  let inMemoryLikeAdvertisementRepository: InMemoryLikeAdvertisementRepository;
  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryImageRepository: InMemoryImageRepository;
  let inMemoryAddressRepository: InMemoryAddressRepository;

  beforeEach(() => {
    inMemoryBrandRepository = new InMemoryBrandRepository();
    inMemoryImageRepository = new InMemoryImageRepository();
    inMemoryAddressRepository = new InMemoryAddressRepository();
    inMemoryPasswordResetTokensRepository = new InMemoryPasswordResetTokensRepository();
    inMemoryUserRepository = new InMemoryUserRepository(inMemoryAdvertisementRepository);
    inMemoryLikeAdvertisementRepository = new InMemoryLikeAdvertisementRepository();
    inMemoryAdvertisementRepository = new InMemoryAdvertisementRepository(
      inMemoryBrandRepository,
      inMemoryLikeAdvertisementRepository,
      inMemoryUserRepository,
      inMemoryImageRepository,
      inMemoryAddressRepository,
    );
    inMemoryUserRepository = new InMemoryUserRepository(inMemoryAdvertisementRepository);
    const hash = new FakeHasher();
    sut = new NewPasswordUseCase(inMemoryPasswordResetTokensRepository, inMemoryUserRepository, hash);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to change password', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const passwordResetToken = makeFakePasswordResetToken({ email: user.email, createdAt: new Date() });
    inMemoryPasswordResetTokensRepository.sendToken(passwordResetToken);

    const output = await sut.execute({
      token: passwordResetToken.token,
      newPassword: 'new-password',
    });

    expect(output.isRight()).toBeTruthy();
    expect(inMemoryUserRepository.users[0].password).toBe('new-password-hashed');
  });

  it('should not be able to change password with invalid token', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const passwordResetToken = makeFakePasswordResetToken({ email: user.email, createdAt: new Date() });
    inMemoryPasswordResetTokensRepository.sendToken(passwordResetToken);

    const output = await sut.execute({
      token: new UniqueEntityId(),
      newPassword: 'new-password',
    });

    expect(output.isLeft()).toBeTruthy();
    expect(output.value).toBeInstanceOf(InvalidPasswordResetTokenError);
  });

  it('should not be able to change password with invalid user', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const passwordResetToken = makeFakePasswordResetToken({ email: user.email, createdAt: new Date() });
    inMemoryPasswordResetTokensRepository.sendToken(passwordResetToken);

    inMemoryUserRepository.users = [];

    const output = await sut.execute({
      token: passwordResetToken.token,
      newPassword: 'new-password',
    });

    expect(output.isLeft()).toBeTruthy();
    expect(output.value).toBeInstanceOf(InvalidPasswordResetTokenError);
  });

  it('should not be able to change password with invalid expired token', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    vi.setSystemTime(new Date(2024, 2, 2, 8, 0, 0));
    const passwordResetToken = makeFakePasswordResetToken({ email: user.email, createdAt: new Date() });
    inMemoryPasswordResetTokensRepository.sendToken(passwordResetToken);
    vi.setSystemTime(new Date(2024, 2, 2, 8, 8, 0));

    const output = await sut.execute({
      token: passwordResetToken.token,
      newPassword: 'new-password',
    });

    expect(output.isLeft()).toBeTruthy();
    expect(output.value).toBeInstanceOf(ExpiredPasswordResetTokenError);
    expect(inMemoryPasswordResetTokensRepository.items).toHaveLength(0);
  });
});
