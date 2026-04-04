import nodemailer from "nodemailer";

export class MailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async send2FACode(email: string, code: string) {
    await this.transporter.sendMail({
      from: `"API Segurança" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Seu código de verificação",
      html: `
        <h2>Código de verificação</h2>
        <p>Seu código é:</p>
        <h1>${code}</h1>
        <p>Expira em 5 minutos</p>
      `,
    });
  }
}