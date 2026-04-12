import { getOrderById, updateStatus, getAllOrders, createOrder, createOrderItems, getOrderItems } from '@/app/models/order.model';
import { incrementSoldCount } from '@/app/models/product.model';
import { Order } from '@/app/type/orderType';

export async function createOrderService(orderData: Partial<Order>, items: any[]) {
  const orderId = await createOrder(orderData);
  if (items && items.length > 0) {
    await createOrderItems(orderId, items);
  }
  return orderId;
}

export async function updateOrderStatusService(orderId: number, newStatus: string, paymentStatus?: string): Promise<void> {
  const order = await getOrderById(orderId);

  if (!order) throw new Error('Order not found');

  if (order.status !== 'delivered' && newStatus === 'delivered') {
    await incrementSoldCount(orderId);
  }

  await updateStatus(orderId, newStatus, paymentStatus);
}

export async function getAllOrdersService() {
  const orders = await getAllOrders();
  // Fetch items for each order
  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const items = await getOrderItems(order.id);
      return { ...order, items };
    })
  );
  return ordersWithItems;
}
