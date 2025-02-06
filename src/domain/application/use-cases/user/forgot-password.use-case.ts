import { Injectable } from '@nestjs/common';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';
import { Mail, MailType } from '@root/domain/enterprise/entities/mail';
import { PasswordResetToken } from '@root/domain/enterprise/entities/password-reset-token.entity';
import { Email } from '@root/domain/enterprise/value-object/email';
import { EnvService } from '@root/infra/env/env.service';
import { MailerRepository } from '@root/infra/mailer/mailer.repository';
import { forgotPasswordTemplate } from '@root/infra/mailer/templates/forgot-password';

import { EmailBadFormattedError } from '../../errors/email-bad-formatted-error';
import { PasswordResetTokensRepository } from '../../repositories/password-reset-tokens.repository';
import { UserRepository } from '../../repositories/user.repository';

type InputProps = {
  email: string;
};

type OutputProps = Either<EmailBadFormattedError | ResourceNotFoundError, null>;

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    private readonly passwordResetTokensRepository: PasswordResetTokensRepository,
    private readonly userRepository: UserRepository,
    private readonly mailerRepository: MailerRepository,
    private readonly envService: EnvService,
  ) {}

  async execute(data: InputProps): Promise<OutputProps> {
    const { email } = data;

    const isInvalidEmail = !Email.validate(email);

    if (isInvalidEmail) return left(new EmailBadFormattedError(email));

    const { isNone: userNotFound, value: user } = await this.userRepository.findByEmail({ email });

    if (userNotFound()) return left(new ResourceNotFoundError());

    const { isSome: passwordResetTokenAlreadySent, value: alreadyExistsPasswordResetToken } =
      await this.passwordResetTokensRepository.findByEmail(email);

    if (passwordResetTokenAlreadySent()) {
      await this.passwordResetTokensRepository.deleteToken(alreadyExistsPasswordResetToken);
    }

    const passwordResetToken = PasswordResetToken.create({ email: user.email });

    await this.passwordResetTokensRepository.sendToken(passwordResetToken);

    const redirect = new URL('/auth/new-password', this.envService.get('APP_URL_AUTOCARS'));
    redirect.searchParams.set('recovery-password-token', passwordResetToken.token.toValue());

    const mail = Mail.create({
      userId: user.id,
      email: passwordResetToken.email,
      type: MailType.FORGOT_PASSWORD,
      subject: 'Recuperação de senha',
      body: forgotPasswordTemplate({
        url: redirect.toString(),
        name: user.name,
      }),
    });

    await this.mailerRepository.sendMail(mail);

    return right(null);
  }
}
