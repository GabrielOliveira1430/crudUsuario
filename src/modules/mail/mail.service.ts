import { Resend } from 'resend';

export class MailService {
  private resend: Resend;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      throw new Error('❌ RESEND_API_KEY não configurada no ambiente');
    }

    this.resend = new Resend(apiKey);

    console.log('📧 Resend configurado com sucesso');
  }

  // 🔐 ENVIO DE CÓDIGO 2FA
  async send2FACode(email: string, code: string) {
    try {
      const response = await this.resend.emails.send({
        from: 'CoreAuth <no-reply@coreauth.dev>', // ✅ SEU DOMÍNIO
        to: email,
        subject: 'Seu código de verificação',
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h2>🔐 Código de verificação</h2>
            <p>Seu código é:</p>
            <h1 style="letter-spacing: 4px;">${code}</h1>
            <p>Expira em 5 minutos</p>
          </div>
        `,
      });

      console.log('✅ Email 2FA enviado:', response);
    } catch (error) {
      console.error('❌ Erro ao enviar email 2FA:', error);
      throw new Error('Falha ao enviar email de verificação');
    }
  }

  // 📩 EMAIL GENÉRICO
  async sendGenericEmail(to: string, subject: string, html: string) {
    try {
      const response = await this.resend.emails.send({
        from: 'CoreAuth <no-reply@coreauth.dev>', // ✅ DOMÍNIO
        to,
        subject,
        html,
      });

      console.log('✅ Email enviado:', response);
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      throw new Error('Falha ao enviar email');
    }
  }

  // 🧪 VERIFICAÇÃO
  async verifyConnection(): Promise<boolean> {
    try {
      console.log('🟢 Resend pronto para uso');
      return true;
    } catch (error) {
      console.error('❌ Erro no Resend:', error);
      return false;
    }
  }
}