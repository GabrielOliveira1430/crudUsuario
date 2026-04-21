import nodemailer, { Transporter } from "nodemailer";

export class MailService {
  private transporter: Transporter;

  constructor(transporter?: Transporter) {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    // 🔍 DEBUG (muito importante em produção)
    console.log("📧 SMTP CONFIG:");
    console.log("HOST:", host);
    console.log("PORT:", port);
    console.log("USER:", user);
    console.log("PASS:", pass ? "********" : "NÃO DEFINIDO");

    // 🚨 VALIDAÇÃO (evita cair em localhost sem perceber)
    if (!host || !port || !user || !pass) {
      throw new Error("❌ SMTP não configurado corretamente no ambiente");
    }

    this.transporter =
      transporter ||
      nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true para 465, false para 587
        auth: {
          user,
          pass,
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

      console.log("✅ Email 2FA enviado para:", email);
    } catch (error) {
      console.error("❌ Erro ao enviar email 2FA:", error);

      // 🔥 NÃO derruba o login por causa do email (produção)
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

      console.log("✅ Email enviado para:", to);
    } catch (error) {
      console.error("❌ Erro ao enviar email genérico:", error);
      throw new Error("Falha ao enviar email");
    }
  }

  // 🧪 VERIFICAÇÃO SMTP
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log("🟢 SMTP conectado com sucesso");
      return true;
    } catch (error) {
      console.error("❌ Erro na conexão SMTP:", error);
      return false;
    }
  }
}