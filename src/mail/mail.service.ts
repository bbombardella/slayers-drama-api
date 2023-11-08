import { Injectable } from '@nestjs/common';
import Mailgun from 'mailgun.js';
import * as formData from 'form-data';
import { ApiConfigService } from '../api-config/api-config.service';
import { IMailgunClient } from 'mailgun.js/Interfaces';
import { MailSend } from './models/mail-send.model';
import { MessagesSendResult } from 'mailgun.js/Types/Messages';

@Injectable()
export class MailService {
  private readonly mailgun: IMailgunClient;

  constructor(private readonly apiConfigService: ApiConfigService) {
    this.mailgun = new Mailgun(formData).client({
      username: this.apiConfigService.mailgun.name,
      key: this.apiConfigService.mailgun.apiKey,
      url: 'https://api.eu.mailgun.net/',
    });
  }

  sendMail(request: MailSend): Promise<MessagesSendResult> {
    return this.mailgun.messages.create(this.apiConfigService.mailgun.domain, {
      from: `Slayer's Drama <mailgun@${this.apiConfigService.mailgun.domain}>`,
      to: request.to,
      subject: request.subject,
      html: request.html,
    });
  }
}
