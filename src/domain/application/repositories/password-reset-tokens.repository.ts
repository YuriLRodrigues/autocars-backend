import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { AsyncMaybe } from '@root/core/logic/Maybe';
import { PasswordResetToken } from '@root/domain/enterprise/entities/password-reset-token.entity';

export abstract class PasswordResetTokensRepository {
  abstract sendToken(passwordResetToken: PasswordResetToken): Promise<void>;
  abstract findByToken(token: UniqueEntityId): AsyncMaybe<PasswordResetToken>;
  abstract findByEmail(email: string): AsyncMaybe<PasswordResetToken>;
  abstract deleteToken(passwordResetToken: PasswordResetToken): Promise<void>;
}
