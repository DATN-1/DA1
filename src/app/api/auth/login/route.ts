import { NextResponse } from 'next/server';
import { findUserByEmail } from '@/app/models/user.model';
import crypto from 'crypto';

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Vui lòng nhập email và mật khẩu.' }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Email hoặc mật khẩu không đúng.' }, { status: 401 });
    }

    if (user.status !== 'active') {
      return NextResponse.json({ error: 'Tài khoản chưa kích hoạt hoặc bị chặn.' }, { status: 403 });
    }

    const passwordHash = hashPassword(password);
    if (passwordHash !== user.password) {
      return NextResponse.json({ error: 'Email hoặc mật khẩu không đúng.' }, { status: 401 });
    }

    // Ở đây có thể tạo session/JWT, hiện tại trả về user đơn giản.
    const safeData = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
    };

    return NextResponse.json({ success: true, user: safeData });
  } catch (error: any) {
    console.error('login error', error);
    return NextResponse.json({ error: 'Lỗi hệ thống khi đăng nhập.' }, { status: 500 });
  }
}
