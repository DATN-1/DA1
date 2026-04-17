import { NextResponse } from 'next/server';
import { getOrdersByUserId, getOrderItems } from '@/app/models/order.model';
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions as any);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = (session.user as any).id;
        if (!userId) {
            return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
        }

        const orders = await getOrdersByUserId(userId);
        
        // Fetch order items for each order
        const ordersWithItems = await Promise.all(orders.map(async (order) => {
            const items = await getOrderItems(order.id!);
            return { ...order, items };
        }));

        return NextResponse.json(ordersWithItems);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        return NextResponse.json({ error: 'Failed to fetch user orders' }, { status: 500 });
    }
}
