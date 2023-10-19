import { Injectable } from '@nestjs/common';
import Mailgun from 'mailgun.js';
import * as formData from 'form-data'
import { ApiConfigService } from '../api-config/api-config.service';
import { IMailgunClient } from 'mailgun.js/Interfaces';

@Injectable()
export class MailgunService {
  private readonly mailgun: IMailgunClient;

  constructor(private readonly apiConfigService: ApiConfigService) {
    this.mailgun = new Mailgun(formData).client({
      username: this.apiConfigService.mailgun.name,
      key: this.apiConfigService.mailgun.apiKey,
    });

    this.mailgun.messages
      .create('sandbox1d3ec4c0370b4e44817849d7ae403d03.mailgun.org', {
        from: "SlayersDrama <mailgun@sandbox1d3ec4c0370b4e44817849d7ae403d03.mailgun.org>",
        to: ['bastien.bc@outlook.fr'],
        subject: 'Hi Gurl',
        text: 'Testing some Mailgun awesomeness!',
        html: '<h1>Testing some Mailgun awesomeness!</h1>',
      })
      .then((msg) => console.log(msg)) // logs response data
      .catch((err) => console.log(err));
  }
}
