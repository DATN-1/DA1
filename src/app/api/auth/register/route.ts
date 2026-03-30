import { NextResponse } from 'next/server';
import { createUser, findUserByEmail, createOrReplaceVerificationCode } from '@/app/models/user.model';
import { sendVerificationCodeEmail } from '@/app/lib/mailer';
import crypto from 'crypto';

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: Request) {
  try {
    const { full_name, email, password, confirm_password } = await request.json();
    if (!full_name || !email || !password || !confirm_password) {
      return NextResponse.json({ error: 'Vui lòng điền đầy đủ thông tin.' }, { status: 400 });
    }

    if (password !== confirm_password) {
      return NextResponse.json({ error: 'Mật khẩu không khớp.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Mật khẩu phải có ít nhất 6 ký tự.' }, { status: 400 });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'Email đã được sử dụng.' }, { status: 409 });
    }

    const passwordHash = hashPassword(password);
    const insertResult = await createUser(full_name, email, passwordHash) as { insertId: number };
    const userId = insertResult.insertId;

    const verificationCode = String(crypto.randomInt(100000, 1000000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await createOrReplaceVerificationCode(userId, verificationCode, expiresAt, 'verify-account');

    const emailInfo = await sendVerificationCodeEmail(email, verificationCode);
    console.log('Verification email sent', emailInfo);

    return NextResponse.json({
      success: true,
      message: 'Đăng ký thành công. Vui lòng kiểm tra email để lấy mã kích hoạt.',
      email,
    });
  } catch (error: any) {
    console.error('register error', error);
    return NextResponse.json({ error: error?.message || 'Lỗi hệ thống khi đăng ký.' }, { status: 500 });
  }
}
