import { PasswordResetToken as PasswordResetTokenPrisma, Prisma } from '@prisma/client';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { PasswordResetToken } from '@root/domain/enterprise/entities/password-reset-token.entity';

export class PasswordResetTokenMappers {
  static toDomain(data: PasswordResetTokenPrisma): PasswordResetToken {
    return PasswordResetToken.create(
      {
        email: data.email,
        token: new UniqueEntityId(data.token),
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      },
      new UniqueEntityId(data.id),
    );
  }

  static toPersistence(data: PasswordResetToken): Prisma.PasswordResetTokenCreateInput {
    return {
      id: data.id.toValue(),
      email: data.email,
      token: data.token.toValue(),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }
}
