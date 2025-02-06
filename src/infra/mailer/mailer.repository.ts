import { Mail } from '@root/domain/enterprise/entities/mail';

export abstract class MailerRepository {
  abstract sendMail(mailer: Mail): Promise<void>;
  // abstract sendManyMail(mailer: Array<Mail>): Promise<void>;
}
