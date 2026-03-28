import { NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  deleteVerificationCodeByUserId,
  findUserByEmail,
  findValidVerificationCode,
  updateUserPasswordById,
} from '@/app/models/user.model';

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: Request) {
  try {
    const { email, code, password, confirm_password } = await request.json();

    if (!email || !code || !password || !confirm_password) {
      return NextResponse.json({ error: 'Vui lòng điền đầy đủ email, OTP và mật khẩu mới.' }, { status: 400 });
    }

    if (password !== confirm_password) {
      return NextResponse.json({ error: 'Mật khẩu xác nhận không khớp.' }, { status: 400 });
    }

    if (String(password).length < 6) {
      return NextResponse.json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự.' }, { status: 400 });
    }

    const user = await findUserByEmail(String(email).trim());
    if (!user) {
      return NextResponse.json({ error: 'Email không tồn tại trong hệ thống.' }, { status: 404 });
    }

    const verification = await findValidVerificationCode(user.id, String(code).trim(), 'reset-password');
    if (!verification) {
      return NextResponse.json({ error: 'Mã OTP không đúng hoặc đã hết hạn.' }, { status: 400 });
    }

    await updateUserPasswordById(user.id, hashPassword(String(password)));
    await deleteVerificationCodeByUserId(user.id, 'reset-password');

    return NextResponse.json({
      success: true,
      message: 'Đổi mật khẩu thành công. Bạn có thể đăng nhập ngay.',
    });
  } catch (error: any) {
    console.error('reset password error', error);
    return NextResponse.json({ error: error?.message || 'Lỗi hệ thống khi đổi mật khẩu.' }, { status: 500 });
  }
}