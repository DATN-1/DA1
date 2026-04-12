import { NextResponse } from 'next/server';
import { createUser, findUserByEmail, createEmailVerificationToken } from '@/app/models/user.model';
import { sendVerificationLinkEmail } from '@/app/lib/mailer';
import crypto from 'crypto';

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
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

    // Generate verification token (24 hours expiry)
    const verificationToken = generateVerificationToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await createEmailVerificationToken(userId, email, verificationToken, expiresAt);

    // Send verification email with link
    try {
      console.log(`Attempting to send verification email to ${email}...`);
      const emailResult = await sendVerificationLinkEmail(email, full_name, verificationToken);
      console.log('✅ Verification email sent successfully:', emailResult);
    } catch (emailError: any) {
      console.error('❌ Failed to send verification email:', emailError.message || emailError);
      console.error('Error details:', emailError);
      // Still return success to avoid blocking registration
      // But log this for admin diagnosis
    }

    return NextResponse.json({
      success: true,
      message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.',
      email,
    });
  } catch (error: any) {
    console.error('register error', error);
    return NextResponse.json({ error: error?.message || 'Lỗi hệ thống khi đăng ký.' }, { status: 500 });
  }
}
