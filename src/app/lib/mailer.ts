import nodemailer from 'nodemailer';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const senderName = process.env.MAIL_FROM_NAME || 'Aromi Candle';
const senderEmail = process.env.MAIL_FROM_EMAIL || process.env.SMTP_USER || 'noreply@example.com';

function isPlaceholder(value: string | undefined) {
  if (!value) {
    return true;
  }

  return value.includes('example.com') || value === 'noreply@example.com';
}

function getSender() {
  if (isPlaceholder(senderEmail)) {
    throw new Error('MAIL_FROM_EMAIL chưa đúng. Hãy điền email sender đã verify trong Brevo vào .env.local');
  }

  return { name: senderName, email: senderEmail };
}

async function sendWithBrevoApi(to: string, subject: string, html: string) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error('BREVO_API_KEY chưa được cấu hình trong .env.local');
  }

  const res = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: getSender(),
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error('❌ Brevo API error:', data);
    throw new Error(data?.message || 'Brevo API gửi email thất bại');
  }

  console.log('✅ Email sent via Brevo API:', data);
  return data;
}

async function sendWithSmtp(to: string, subject: string, html: string) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    throw new Error('Thiếu SMTP_HOST, SMTP_USER hoặc SMTP_PASS trong .env.local để gửi mail bằng SMTP');
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const info = await transporter.sendMail({
    from: `${getSender().name} <${getSender().email}>`,
    to,
    subject,
    html,
  });

  console.log('✅ Email sent via SMTP:', info.messageId);
  return info;
}

async function brevoSend(to: string, subject: string, html: string) {
  const brevoKey = process.env.BREVO_API_KEY?.trim();

  if (brevoKey?.startsWith('xkeysib-')) {
    return sendWithBrevoApi(to, subject, html);
  }

  if (brevoKey?.startsWith('xsmtpsib-')) {
    return sendWithSmtp(to, subject, html);
  }

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return sendWithSmtp(to, subject, html);
  }

  throw new Error('Cấu hình mail chưa hợp lệ. Dùng BREVO_API_KEY bắt đầu bằng xkeysib- hoặc cấu hình SMTP đầy đủ.');
}

async function sendOtpMail(to: string, subject: string, title: string, verificationCode: string, intro: string) {
  const html = `
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
  `;
  return brevoSend(to, subject, html);
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

export async function sendVerificationLinkEmail(to: string, fullName: string, verificationToken: string) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const verificationLink = `${baseUrl}/verify-email?token=${verificationToken}&email=${encodeURIComponent(to)}`;

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;max-width:600px;margin:0 auto;">
      <div style="text-align:center;margin-bottom:2rem;">
        <h1 style="color:#d97706;margin:0;">Xác Thực Email</h1>
      </div>
      <div style="background:#fff;padding:2rem;border-radius:8px;border:1px solid #e5e7eb;">
        <p>Xin chào <strong>${fullName}</strong>,</p>
        <p>Cảm ơn bạn đã đăng ký tài khoản Aromi Candle. Để hoàn tất quá trình đăng ký, vui lòng xác thực email bằng cách nhấp vào nút dưới đây.</p>
        <div style="text-align:center;margin:2rem 0;">
          <a href="${verificationLink}" style="display:inline-block;padding:12px 32px;background:#d97706;color:white;text-decoration:none;border-radius:6px;font-weight:bold;font-size:16px;">
            Xác Thực Email
          </a>
        </div>
        <p style="color:#6b7280;font-size:14px;">Hoặc sao chép link này vào trình duyệt:</p>
        <p style="background:#f3f4f6;padding:12px;border-radius:4px;word-break:break-all;color:#1f2937;font-size:12px;">${verificationLink}</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:2rem 0;">
        <p style="color:#6b7280;font-size:14px;">Link xác thực sẽ hết hiệu lực sau 24 giờ.</p>
        <p style="color:#6b7280;font-size:12px;margin-top:2rem;border-top:1px solid #e5e7eb;padding-top:1rem;">© Aromi Candle. Tất cả các quyền được bảo vệ.</p>
      </div>
    </div>
  `;
  return brevoSend(to, 'Xác thực email và kích hoạt tài khoản Aromi', html);
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

export async function sendContactEmail(params: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  const subjectMap: Record<string, string> = {
    product: 'Thông tin sản phẩm',
    order: 'Đặt hàng',
    support: 'Hỗ trợ',
    other: 'Khác',
  };

  const subjectLabel = subjectMap[params.subject] || params.subject || 'Liên hệ';
  const recipientEmail = process.env.CONTACT_RECEIVE_EMAIL || senderEmail;

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;max-width:600px;margin:0 auto;">
      <div style="background:linear-gradient(135deg,#d97706,#e11d48);padding:24px;border-radius:12px 12px 0 0;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:22px;">📩 Tin nhắn liên hệ mới</h1>
      </div>
      <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:10px 12px;font-weight:600;color:#6b7280;width:140px;vertical-align:top;">Họ và tên:</td>
            <td style="padding:10px 12px;color:#111827;">${params.name}</td>
          </tr>
          <tr style="background:#f9fafb;">
            <td style="padding:10px 12px;font-weight:600;color:#6b7280;vertical-align:top;">Email:</td>
            <td style="padding:10px 12px;color:#111827;"><a href="mailto:${params.email}" style="color:#d97706;">${params.email}</a></td>
          </tr>
          ${params.phone ? `
          <tr>
            <td style="padding:10px 12px;font-weight:600;color:#6b7280;vertical-align:top;">Số điện thoại:</td>
            <td style="padding:10px 12px;color:#111827;">${params.phone}</td>
          </tr>` : ''}
          <tr style="background:#f9fafb;">
            <td style="padding:10px 12px;font-weight:600;color:#6b7280;vertical-align:top;">Chủ đề:</td>
            <td style="padding:10px 12px;color:#111827;">${subjectLabel}</td>
          </tr>
        </table>
        <div style="margin-top:20px;padding:16px;background:#fff7ed;border:1px solid #fdba74;border-radius:8px;">
          <div style="font-weight:600;color:#9a3412;margin-bottom:8px;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Nội dung tin nhắn</div>
          <div style="color:#1f2937;white-space:pre-wrap;">${params.message}</div>
        </div>
        <p style="color:#9ca3af;font-size:12px;margin-top:20px;text-align:center;">Email được gửi từ form liên hệ trên website Aromi Candle</p>
      </div>
    </div>
  `;

  return brevoSend(recipientEmail, `[Liên hệ] ${subjectLabel} - ${params.name}`, html);
}
