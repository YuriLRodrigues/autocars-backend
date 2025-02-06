import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import {
  PasswordResetToken,
  PasswordResetTokenProps,
} from '@root/domain/enterprise/entities/password-reset-token.entity';

type Overrides = Partial<PasswordResetTokenProps>;

export function makeFakePasswordResetToken(data = {} as Overrides) {
  const email = faker.internet.email();
  const token = new UniqueEntityId();
  const createdAt = faker.date.past();
  const updatedAt = faker.date.recent();

  const props: PasswordResetTokenProps = {
    email: data.email || email,
    token: data.token || token,
    createdAt: data.createdAt || createdAt,
    updatedAt: data.updatedAt || updatedAt,
  };

  const passwordResetToken = PasswordResetToken.create(props);

  return passwordResetToken;
}
