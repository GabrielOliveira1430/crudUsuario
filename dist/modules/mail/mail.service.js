"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class MailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    async send2FACode(email, code) {
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
exports.MailService = MailService;
