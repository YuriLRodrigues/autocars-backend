import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { AsyncMaybe, Maybe } from '@root/core/logic/Maybe';
import { PasswordResetTokensRepository } from '@root/domain/application/repositories/password-reset-tokens.repository';
import { PasswordResetToken } from '@root/domain/enterprise/entities/password-reset-token.entity';

export class InMemoryPasswordResetTokensRepository implements PasswordResetTokensRepository {
  public items: PasswordResetToken[] = [];

  async sendToken(passwordResetToken: PasswordResetToken): Promise<void> {
    this.items.push(passwordResetToken);
  }

  async findByToken(token: UniqueEntityId): AsyncMaybe<PasswordResetToken> {
    const passwordResetToken = this.items.find((item) => item.token.equals(token));

    if (!passwordResetToken) return Maybe.none();

    return Maybe.some(passwordResetToken);
  }

  async findByEmail(email: string): AsyncMaybe<PasswordResetToken> {
    const passwordResetToken = this.items.find((item) => item.email === email);

    if (!passwordResetToken) return Maybe.none();

    return Maybe.some(passwordResetToken);
  }

  async deleteToken(passwordResetToken: PasswordResetToken): Promise<void> {
    this.items = this.items.filter((item) => !item.equals(passwordResetToken));
  }
}
