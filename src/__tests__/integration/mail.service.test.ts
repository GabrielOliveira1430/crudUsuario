import { MailService } from '../../modules/mail/mail.service';

describe('MailService', () => {
  let sendMailMock: jest.Mock;
  let verifyMock: jest.Mock;
  let mailService: MailService;

  beforeEach(() => {
    sendMailMock = jest.fn();
    verifyMock = jest.fn();

    const transporterMock: any = {
      sendMail: sendMailMock,
      verify: verifyMock,
    };

    mailService = new MailService(transporterMock);
  });

  it('should send 2FA email', async () => {
    sendMailMock.mockResolvedValue(true);

    await mailService.send2FACode('test@email.com', '123456');

    expect(sendMailMock).toHaveBeenCalledTimes(1);
  });

  it('should throw error if 2FA email fails', async () => {
    sendMailMock.mockRejectedValue(new Error('SMTP error'));

    await expect(
      mailService.send2FACode('test@email.com', '123456')
    ).rejects.toThrow('Falha ao enviar email de verificação');
  });

  it('should send generic email', async () => {
    sendMailMock.mockResolvedValue(true);

    await mailService.sendGenericEmail(
      'test@email.com',
      'Teste',
      '<p>Olá</p>'
    );

    expect(sendMailMock).toHaveBeenCalledTimes(1);
  });

  it('should throw error if generic email fails', async () => {
    sendMailMock.mockRejectedValue(new Error('SMTP error'));

    await expect(
      mailService.sendGenericEmail(
        'test@email.com',
        'Teste',
        '<p>Olá</p>'
      )
    ).rejects.toThrow('Falha ao enviar email');
  });

  it('should return true if smtp is valid', async () => {
    verifyMock.mockResolvedValue(true);

    const result = await mailService.verifyConnection();

    expect(result).toBe(true);
  });

  it('should return false if smtp fails', async () => {
    verifyMock.mockRejectedValue(new Error('SMTP error'));

    const result = await mailService.verifyConnection();

    expect(result).toBe(false);
  });
});