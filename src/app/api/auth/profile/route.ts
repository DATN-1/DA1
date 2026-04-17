import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { findUserByEmail, updateUserProfileById } from '@/app/models/user.model';
import { findAddressByUserId, createOrUpdateAddress } from '@/app/models/address.model';

export async function GET() {
  try {
    const session = await getServerSession(authOptions as any);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await findUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (String(user.id) !== String((session.user as any).id)) {
      return NextResponse.json({ error: 'Session mismatch' }, { status: 401 });
    }

    // Get address information
    const address = await findAddressByUserId(user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        created_at: user.created_at,
      },
      address: address ? {
        recipient_name: address.recipient_name,
        phone: address.phone,
        address_line: address.address_line,
        province_code: address.province_code,
        district_code: address.district_code,
      } : null
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions as any);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { full_name, phone, recipient_name, address_line, province_code, district_code } = await request.json();

    if (!full_name?.trim()) {
      return NextResponse.json({ error: 'Họ và tên là bắt buộc' }, { status: 400 });
    }

    if (!recipient_name?.trim() || !address_line?.trim()) {
      return NextResponse.json({ error: 'Thông tin giao hàng là bắt buộc' }, { status: 400 });
    }

    const user = await findUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (String(user.id) !== String((session.user as any).id)) {
      return NextResponse.json({ error: 'Session mismatch' }, { status: 401 });
    }

    // Update user profile
    await updateUserProfileById({
      userId: user.id,
      full_name: full_name.trim(),
      phone: phone?.trim() || null,
    });

    // Update or create address
    await createOrUpdateAddress(
      user.id,
      recipient_name.trim(),
      phone?.trim() || '',
      address_line.trim(),
      province_code || null,
      district_code || null
    );

    return NextResponse.json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      user: {
        id: user.id,
        full_name: full_name.trim(),
        email: user.email,
        phone: phone?.trim() || null,
        created_at: user.created_at,
      },
      address: {
        recipient_name: recipient_name.trim(),
        phone: phone?.trim() || '',
        address_line: address_line.trim(),
        province_code: province_code || null,
        district_code: district_code || null,
      }
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}