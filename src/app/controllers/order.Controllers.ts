import { updateOrderStatusService } from '@/app/services/order.Service';

export async function updateOrderStatus(req: Request, orderId: number) {
  const { status } = await req.json();
  await updateOrderStatusService(orderId, status);
  return Response.json({ success: true });
}