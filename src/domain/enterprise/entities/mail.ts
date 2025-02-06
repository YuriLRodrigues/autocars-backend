import { Entity } from '@root/core/domain/entity/entity';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Optional } from '@root/core/logic/Optional';

export enum MailType {
  // VERIFY_EMAIL = 'VERIFY_EMAIL',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  REGISTER = 'REGISTER',
}

type MailProps = {
  email: string;
  subject: string;
  body: string;
  userId?: UniqueEntityId;
  type: MailType;
  createdAt: Date;
};

export class Mail extends Entity<MailProps> {
  get email() {
    return this.props.email;
  }

  get subject() {
    return this.props.subject;
  }

  get body() {
    return this.props.body;
  }

  get type() {
    return this.props.type;
  }

  get userId() {
    return this.props.userId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(props: Optional<MailProps, 'createdAt'>, id?: UniqueEntityId): Mail {
    return new Mail(
      {
        email: props.email,
        subject: props.subject,
        body: props.body,
        type: props.type,
        userId: props.userId || null,
        createdAt: props.createdAt || new Date(),
      },
      id,
    );
  }
}
