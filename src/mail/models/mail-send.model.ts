export interface MailSend {
  to?: string | string[];
  subject?: string;
  html: string;
}
