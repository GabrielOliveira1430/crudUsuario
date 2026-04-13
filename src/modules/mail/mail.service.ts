import nodemailer, { Transporter } from "nodemailer";

export class MailService {
  private transporter: Transporter;

  constructor(transporter?: Transporter) {
    // 🔒 permite injeção (facilita testes)
    this.transporter =
      transporter ||
      nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
  }

  // 🔐 ENVIO DE CÓDIGO 2FA
  async send2FACode(email: string, code: string) {
    try {
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
    } catch (error) {
      console.error("Erro ao enviar email 2FA:", error);
      throw new Error("Falha ao enviar email de verificação");
    }
  }

  // 📩 EMAIL GENÉRICO
  async sendGenericEmail(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: `"API Segurança" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error("Erro ao enviar email genérico:", error);
      throw new Error("Falha ao enviar email");
    }
  }

  // 🧪 VERIFICAÇÃO SMTP
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error("❌ Erro na conexão SMTP:", error);
      return false;
    }
  }
}