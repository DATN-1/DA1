import { createTransport } from 'nodemailer';

async function sendOtpMail(to: string, subject: string, title: string, verificationCode: string, intro: string) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  if (!smtpUser || !smtpPass || !smtpHost) {
    throw new Error('SMTP chưa được cấu hình. Vui lòng thiết lập SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.');
  }

  const transporter = createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  return transporter.sendMail({
    from: 'Aromi Candle <no-reply@aromi.local>',
    to,
    subject,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;max-width:520px;margin:0 auto;">
        <h2 style="margin-bottom:12px;color:#d97706;">${title}</h2>
        <p>${intro}</p>
        <div style="margin:24px 0;padding:18px 20px;background:#fff7ed;border:1px solid #fdba74;border-radius:12px;text-align:center;">
          <div style="font-size:12px;letter-spacing:1px;color:#9a3412;text-transform:uppercase;">Mã OTP</div>
          <div style="font-size:28px;font-weight:700;letter-spacing:6px;color:#111827;">${verificationCode}</div>
        </div>
        <p>Mã có hiệu lực trong 10 phút.</p>
        <p>Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email.</p>
      </div>
    `,
  });
}

export async function sendVerificationCodeEmail(to: string, verificationCode: string) {
  return sendOtpMail(
    to,
    'Kích hoạt tài khoản Aromi',
    'Xác thực tài khoản',
    verificationCode,
    'Xin chào, đây là mã OTP để kích hoạt tài khoản Aromi của bạn.'
  );
}

export async function sendPasswordResetCodeEmail(to: string, verificationCode: string) {
  return sendOtpMail(
    to,
    'Đặt lại mật khẩu Aromi',
    'Khôi phục mật khẩu',
    verificationCode,
    'Bạn đã yêu cầu đặt lại mật khẩu. Hãy dùng mã OTP bên dưới để tiếp tục.'
  );
}
