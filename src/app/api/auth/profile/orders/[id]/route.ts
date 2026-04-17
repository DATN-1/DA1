import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { findUserByEmail } from '@/app/models/user.model';
import { getOrderById, getOrderItems } from '@/app/models/order.model';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions as any);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await findUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const orderId = Number(params.id);
    if (!orderId) {
       return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    const order = await getOrderById(orderId);
    
    if (!order) {
       return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Verify order belongs to user
    if (order.user_id !== user.id) {
       return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const items = await getOrderItems(orderId);

    return NextResponse.json({
      success: true,
      order: {
          ...order,
          items
      }
    });

  } catch (error: any) {
    console.error('Get user order details error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
