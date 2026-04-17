import { NextResponse } from 'next/server';
import { sendContactEmail } from '@/app/lib/mailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Vui lòng nhập họ và tên' }, { status: 400 });
    }
    if (!email?.trim()) {
      return NextResponse.json({ error: 'Vui lòng nhập email' }, { status: 400 });
    }
    if (!message?.trim()) {
      return NextResponse.json({ error: 'Vui lòng nhập nội dung tin nhắn' }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: 'Email không hợp lệ' }, { status: 400 });
    }

    await sendContactEmail({
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || '',
      subject: subject?.trim() || 'Không có chủ đề',
      message: message.trim(),
    });

    return NextResponse.json({ success: true, message: 'Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất.' });
  } catch (error: any) {
    console.error('[Contact API Error]', error?.message || error);
    return NextResponse.json(
      { error: error?.message || 'Không thể gửi tin nhắn. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
