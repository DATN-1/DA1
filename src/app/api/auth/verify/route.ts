import { NextResponse } from 'next/server';
import {
  findUserByEmail,
  findValidVerificationCode,
  deleteVerificationCodeByUserId,
  updateUserStatusById,
} from '@/app/models/user.model';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();
    if (!email || !code) {
      return NextResponse.json({ error: 'Thiếu email hoặc mã xác thực.' }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Email không tồn tại.' }, { status: 404 });
    }

    const verification = await findValidVerificationCode(user.id, String(code), 'verify-account');
    if (!verification) {
      return NextResponse.json({ error: 'Mã xác thực không đúng hoặc đã hết hạn.' }, { status: 400 });
    }

    await updateUserStatusById(user.id, 'active');
    await deleteVerificationCodeByUserId(user.id, 'verify-account');

    return NextResponse.json({ success: true, message: 'Tài khoản đã được kích hoạt. Bạn có thể đăng nhập ngay.' });
  } catch (error: any) {
    console.error('verify error', error);
    return NextResponse.json({ error: 'Lỗi hệ thống khi xác thực.' }, { status: 500 });
  }
}
