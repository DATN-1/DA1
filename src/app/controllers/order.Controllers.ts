import { updateOrderStatusService, getAllOrdersService, createOrderService } from '@/app/services/order.Service';

export async function createOrderController(req: Request) {
  try {
    const { items, ...orderData } = await req.json();
    const order_code = `ORD${Date.now()}`;
    const newOrderId = await createOrderService({ ...orderData, order_code }, items || []);
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
  const orders = await getAllOrdersService();
  return Response.json(orders);
}