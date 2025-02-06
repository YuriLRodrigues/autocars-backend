import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Mail } from '@root/domain/enterprise/entities/mail';

import { MailerRepository } from '../mailer.repository';

@Injectable()
export class NodeMailerRepository implements MailerRepository {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(mailer: Mail): Promise<void> {
    await this.mailerService.sendMail({
      from: process.env.NODE_MAILER_FROM,
      to: 'autocars.project@gmail.com',
      subject: mailer.subject,
      html: mailer.body,
    });
  }
}
