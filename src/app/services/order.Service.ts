import { getOrderById, updateStatus } from '@/app/models/order.model';
import { incrementSoldCount } from '@/app/models/product.model';

export async function updateOrderStatusService(orderId: number, newStatus: string): Promise<void> {
  const order = await getOrderById(orderId);

  if (!order) throw new Error('Order not found');

  if (order.status !== 'delivered' && newStatus === 'delivered') {
    await incrementSoldCount(orderId);
  }

  await updateStatus(orderId, newStatus);
}