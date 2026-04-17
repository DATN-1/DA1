import { updateOrderStatusService, getAllOrdersService, createOrderService } from '@/app/services/order.Service';

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function createOrderController(req: Request) {
  try {
    const session = await getServerSession(authOptions as any);
    const userId = session?.user ? (session.user as any).id : null;

    const { items, ...orderData } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return Response.json({ success: false, error: 'Đơn hàng không có sản phẩm nào' }, { status: 400 });
    }

    const order_code = `ORD${Date.now()}`;
    // Store user_id from session so the customer sees it in their history
    const newOrderId = await createOrderService({ ...orderData, order_code, user_id: userId }, items);
    return Response.json({ success: true, orderId: newOrderId, order_code });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
export async function updateOrderStatus(req: Request) {
  const { id, status, payment_status } = await req.json();
  if (!id) return Response.json({ success: false, error: 'Missing orderId' });
  await updateOrderStatusService(id, status, payment_status);
  return Response.json({ success: true });
}

export async function getAllOrdersController() {
  try {
    const orders = await getAllOrdersService();
    return Response.json(orders);
  } catch (error: any) {
    console.error('[getAllOrdersController] Error:', error?.message, error?.stack);
    return Response.json({ success: false, error: error?.message ?? 'Unknown error' }, { status: 500 });
  }
}