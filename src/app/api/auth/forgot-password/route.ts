import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createOrReplaceVerificationCode, findUserByEmail } from '@/app/models/user.model';
import { sendPasswordResetCodeEmail } from '@/app/lib/mailer';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Vui lòng nhập email.' }, { status: 400 });
    }

    const user = await findUserByEmail(String(email).trim());
    if (!user) {
      return NextResponse.json({ error: 'Email không tồn tại trong hệ thống.' }, { status: 404 });
    }

    if (user.status !== 'active') {
      return NextResponse.json({ error: 'Tài khoản chưa được kích hoạt. Vui lòng xác thực tài khoản trước.' }, { status: 403 });
    }

    const verificationCode = String(crypto.randomInt(100000, 1000000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await createOrReplaceVerificationCode(user.id, verificationCode, expiresAt, 'reset-password');
    await sendPasswordResetCodeEmail(user.email, verificationCode);

    return NextResponse.json({
      success: true,
      message: 'Mã OTP đặt lại mật khẩu đã được gửi về email của bạn.',
    });
  } catch (error: any) {
    console.error('forgot password error', error);
    return NextResponse.json({ error: error?.message || 'Lỗi hệ thống khi gửi OTP.' }, { status: 500 });
  }
}