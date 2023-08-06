import { Service } from 'typedi';
import config from 'config';
import { SendEmailPayload } from '../interfaces';
import nodemailer from 'nodemailer';
import { InternalServerError } from 'http-errors';

@Service()
class EmailService {
  private client: nodemailer.Transporter;

  private async _getEmailClient() {
    if (!this.client) {
      this.client = nodemailer.createTransport({
        service: config.get('email.service'),
        auth: {
          user: config.get<string>('email.auth.user'),
          pass: process.env.EMAIL_PASS,
        },
      });
    }

    return this.client;
  }

  public sendInviteTokenMail = async (email: string, token: string) => {
    try {
      const link = this._buildInvitationTokenLink(token);

      const payload: SendEmailPayload = {
        receiver: email,
        subject: 'Invitation Email',
        text: `Please click this link to get access ${link}`,
      };

      await this.sendMail(payload);
    } catch (e) {
      throw new InternalServerError('Something went wrong while sending email');
    }
  };

  private async sendMail(payload: SendEmailPayload) {
    const client = await this._getEmailClient();

    await client.sendMail({
      from: payload.sender ?? config.get<string>('email.sender'),
      to: payload.receiver,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    });
  }

  /**
   *
   * @param token
   * @returns tokenLink - http(s)://example.com/auth/register?token=${token}
   */
  private _buildInvitationTokenLink(token: string): string {
    return `${config.get('app.base_url')}/${config.get('app.invite_path')}?token=${token}`;
  }
}

export default EmailService;
