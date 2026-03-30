import { NextResponse } from 'next/server';
import {
  createSocialUser,
  findUserByEmail,
  updateUserProfileById,
} from '@/app/models/user.model';

type SocialProvider = 'google' | 'facebook';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const provider = String(body?.provider || '').toLowerCase() as SocialProvider;
    const email = String(body?.email || '').trim().toLowerCase();
    const full_name = String(body?.full_name || '').trim();
    const avatar = body?.avatar ? String(body.avatar) : null;

    if (!['google', 'facebook'].includes(provider)) {
      return NextResponse.json({ error: 'Nhà cung cấp đăng nhập không hợp lệ.' }, { status: 400 });
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email không hợp lệ.' }, { status: 400 });
    }

    if (!full_name) {
      return NextResponse.json({ error: 'Vui lòng nhập họ tên.' }, { status: 400 });
    }

    let user = await findUserByEmail(email);

    if (!user) {
      const insertResult = (await createSocialUser({
        full_name,
        email,
        avatar,
      })) as { insertId?: number };

      if (!insertResult?.insertId) {
        return NextResponse.json({ error: 'Không thể tạo tài khoản social.' }, { status: 500 });
      }

      user = await findUserByEmail(email);
    } else {
      await updateUserProfileById({
        userId: user.id,
        full_name: full_name || user.full_name,
        avatar: avatar || user.avatar,
        status: 'active',
      });
      user = await findUserByEmail(email);
    }

    if (!user) {
      return NextResponse.json({ error: 'Không thể lấy thông tin tài khoản.' }, { status: 500 });
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      provider,
    };

    return NextResponse.json({
      success: true,
      user: safeUser,
      message: `Đăng nhập bằng ${provider === 'google' ? 'Google' : 'Facebook'} thành công.`,
    });
  } catch (error: any) {
    console.error('social auth error', error);
    return NextResponse.json({ error: 'Lỗi hệ thống khi đăng nhập social.' }, { status: 500 });
  }
}
