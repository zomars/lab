import {
  createTransport,
  SentMessageInfo,
} from 'nodemailer';

interface ISmtpClientMail {
  subject: string;
  body: string;
  html?: string;
  to?: string;
}

const {
  NETLIFY_FASTMAIL_TO_EMAIL,
  NETLIFY_FASTMAIL_FROM_EMAIL,
  NETLIFY_FASTMAIL_SMTP_PASSWORD,
  NETLIFY_FASTMAIL_SMTP_USERNAME,
} = process.env;

export function send(
  mail: ISmtpClientMail,
): Promise<SentMessageInfo> {
  const transport = createTransport({
    host: 'smtp.fastmail.com',
    port: 465,
    secure: true,
    auth: {
      user: NETLIFY_FASTMAIL_SMTP_USERNAME,
      pass: NETLIFY_FASTMAIL_SMTP_PASSWORD,
    },
  } as unknown);

  const {
    to,
    subject,
    body,
    html,
  } = mail;

  const fromEmail = NETLIFY_FASTMAIL_FROM_EMAIL;
  const toEmail = NETLIFY_FASTMAIL_TO_EMAIL;

  return transport.sendMail({
    from: `amlab netlify <${ fromEmail }>`,
    to: to || toEmail,
    subject,
    text: body,
    html,
  });
}
