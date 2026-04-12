import { NextResponse } from 'next/server';
import { findValidEmailToken, deleteEmailToken, updateUserStatusById, findUserByEmail } from '@/app/models/user.model';

export async function POST(request: Request) {
  try {
    const { token, email } = await request.json();
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!token || !normalizedEmail) {
      return NextResponse.json({ error: 'Token và email là bắt buộc.' }, { status: 400 });
    }

    // Find and validate the token
    const emailToken = await findValidEmailToken(token, normalizedEmail);
    if (!emailToken) {
      return NextResponse.json({ error: 'Link xác thực không hợp lệ hoặc đã hết hạn.' }, { status: 400 });
    }

    // Find user and verify status
    const user = await findUserByEmail(normalizedEmail);
    if (!user) {
      return NextResponse.json({ error: 'Tài khoản không tồn tại.' }, { status: 404 });
    }

    // Activate the user account
    await updateUserStatusById(user.id, 'active');

    // Delete the used token
    await deleteEmailToken(token);

    return NextResponse.json({
      success: true,
      message: 'Email đã được xác thực thành công. Tài khoản của bạn đã được kích hoạt.',
      email: normalizedEmail,
    });
  } catch (error: any) {
    console.error('verify-token error', error);
    return NextResponse.json({ error: error?.message || 'Lỗi hệ thống khi xác thực email.' }, { status: 500 });
  }
}
