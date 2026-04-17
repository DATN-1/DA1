import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { findUserByEmail } from '@/app/models/user.model';
import { getOrdersByUserId, getOrderItems } from '@/app/models/order.model';

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

    const orders = await getOrdersByUserId(user.id);
    
    // Giống Shopee, chúng ta cần fetch cả các items của order để hiển thị trong lịch sử mua hàng
    const ordersWithItems = await Promise.all(orders.map(async (order) => {
      const items = await getOrderItems(order.id!);
      return {
        ...order,
        items
      };
    }));

    return NextResponse.json({
      success: true,
      orders: ordersWithItems
    });
  } catch (error: any) {
    console.error('Get user orders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
