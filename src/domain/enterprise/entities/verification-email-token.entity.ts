import { Entity } from '@root/core/domain/entity/entity';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Optional } from '@root/core/logic/Optional';

type VerificationEmailTokenProps = {
  email: string;
  token: UniqueEntityId;
  createdAt: Date;
  updatedAt?: Date;
};

export class VerificationEmailToken extends Entity<VerificationEmailTokenProps> {
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

  static create(props: Optional<VerificationEmailTokenProps, 'createdAt' | 'token'>, id?: UniqueEntityId) {
    const verificationEmailToken = new VerificationEmailToken(
      {
        email: props.email,
        token: props.token || new UniqueEntityId(),
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
      },
      id,
    );

    return verificationEmailToken;
  }
}
