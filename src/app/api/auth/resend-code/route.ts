import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { findUserByEmail, createOrReplaceVerificationCode } from '@/app/models/user.model';
import { sendVerificationCodeEmail } from '@/app/lib/mailer';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Thiếu email.' }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Email không tồn tại.' }, { status: 404 });
    }

    if (user.status === 'active') {
      return NextResponse.json({ error: 'Tài khoản đã được kích hoạt.' }, { status: 400 });
    }

    const verificationCode = String(crypto.randomInt(100000, 1000000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await createOrReplaceVerificationCode(user.id, verificationCode, expiresAt, 'verify-account');
    await sendVerificationCodeEmail(email, verificationCode);

    return NextResponse.json({ success: true, message: 'Đã gửi lại mã xác thực vào email.' });
  } catch (error) {
    console.error('resend code error', error);
    return NextResponse.json({ error: (error as Error)?.message || 'Lỗi hệ thống khi gửi lại mã.' }, { status: 500 });
  }
}
