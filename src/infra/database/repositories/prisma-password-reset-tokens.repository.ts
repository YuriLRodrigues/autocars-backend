import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { AsyncMaybe, Maybe } from '@root/core/logic/Maybe';
import { PasswordResetTokensRepository } from '@root/domain/application/repositories/password-reset-tokens.repository';
import { PasswordResetToken } from '@root/domain/enterprise/entities/password-reset-token.entity';

import { PasswordResetTokenMappers } from '../mappers/password-reset-token.mappers';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaPasswordResetTokensRepository implements PasswordResetTokensRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async sendToken(passwordResetToken: PasswordResetToken): Promise<void> {
    const raw = PasswordResetTokenMappers.toPersistence(passwordResetToken);

    await this.prismaService.passwordResetToken.create({ data: raw });
  }

  async findByToken(token: UniqueEntityId): AsyncMaybe<PasswordResetToken> {
    const passwordResetToken = await this.prismaService.passwordResetToken.findFirst({
      where: {
        token: token.toValue(),
      },
    });

    if (!passwordResetToken) return Maybe.none();

    return Maybe.some(PasswordResetTokenMappers.toDomain(passwordResetToken));
  }

  async findByEmail(email: string): AsyncMaybe<PasswordResetToken> {
    const passwordResetToken = await this.prismaService.passwordResetToken.findFirst({
      where: {
        email: email,
      },
    });

    if (!passwordResetToken) return Maybe.none();

    return Maybe.some(PasswordResetTokenMappers.toDomain(passwordResetToken));
  }

  async deleteToken(passwordResetToken: PasswordResetToken): Promise<void> {
    await this.prismaService.passwordResetToken.delete({
      where: {
        id: passwordResetToken.id.toValue(),
      },
    });
  }
}
