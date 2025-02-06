import { Entity } from '@root/core/domain/entity/entity';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Optional } from '@root/core/logic/Optional';

export type PasswordResetTokenProps = {
  email: string;
  token: UniqueEntityId;
  createdAt: Date;
  updatedAt?: Date;
};

export class PasswordResetToken extends Entity<PasswordResetTokenProps> {
  get email() {
    return this.props.email;
  }

  get token() {
    return this.props.token;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt || new Date();
  }

  static create(props: Optional<PasswordResetTokenProps, 'createdAt' | 'token'>, id?: UniqueEntityId) {
    const passwordResetToken = new PasswordResetToken(
      {
        email: props.email,
        token: props.token || new UniqueEntityId(),
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
      },
      id,
    );

    return passwordResetToken;
  }
}
