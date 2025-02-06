import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Either, left, right } from '@root/core/logic/Either';
import dayjs from 'dayjs';

import { HashGenerator } from '../../cryptography/hash-generator';
import { ExpiredPasswordResetTokenError } from '../../errors/expired-password-reset-token.error';
import { InvalidPasswordResetTokenError } from '../../errors/invalid-password-reset-token.error';
import { PasswordResetTokensRepository } from '../../repositories/password-reset-tokens.repository';
import { UserRepository } from '../../repositories/user.repository';

type InputProps = {
  token: UniqueEntityId;
  newPassword: string;
};

type OutputProps = Either<InvalidPasswordResetTokenError | ExpiredPasswordResetTokenError, null>;

@Injectable()
export class NewPasswordUseCase {
  constructor(
    private readonly passwordResetTokensRepository: PasswordResetTokensRepository,
    private readonly userRepository: UserRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute(data: InputProps): Promise<OutputProps> {
    const { token, newPassword } = data;

    const { isNone: invalidPasswordResetToken, value: passwordResetToken } =
      await this.passwordResetTokensRepository.findByToken(token);

    if (invalidPasswordResetToken()) return left(new InvalidPasswordResetTokenError(token.toValue()));

    const isExpired = dayjs().diff(passwordResetToken.createdAt, 'minutes') > 5;

    if (isExpired) {
      await this.passwordResetTokensRepository.deleteToken(passwordResetToken);

      return left(new ExpiredPasswordResetTokenError(token.toValue()));
    }

    const { isNone: userNotFound, value: user } = await this.userRepository.findByEmail({
      email: passwordResetToken.email,
    });

    if (userNotFound()) return left(new InvalidPasswordResetTokenError(token.toValue()));

    const passwordHashed = await this.hashGenerator.hash(newPassword);

    user.password = passwordHashed;

    await Promise.all([
      this.userRepository.save({ user }),
      this.passwordResetTokensRepository.deleteToken(passwordResetToken),
    ]);

    return right(null);
  }
}
