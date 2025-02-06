import { Mail } from '@root/domain/enterprise/entities/mail';
import { MailerRepository } from '@root/infra/mailer/mailer.repository';

export class InMemoryMailerRepository implements MailerRepository {
  public mailers: Array<Mail> = [];

  async sendMail(mailer: Mail): Promise<void> {
    this.mailers.push(mailer);

    return;
  }

  async sendManyMail(mailer: Array<Mail>): Promise<void> {
    this.mailers.push(...mailer);

    return;
  }
}
