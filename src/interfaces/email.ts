export interface SendEmailPayload {
  sender?: string;
  receiver: string;
  subject: string;
  text: string;
  html?: string;
}
