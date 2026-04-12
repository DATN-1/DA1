import { Order } from '@/app/type/orderType';
import pool from '@/app/lib/db';
import { ResultSetHeader } from 'mysql2';

function buildShippingAddress(orderData: Partial<Order>) {
  const recipientName = orderData.recipient_name?.toString().trim() || '';
  const recipientPhone = orderData.recipient_phone?.toString().trim() || '';
  const address = orderData.shipping_address?.toString().trim() || '';

  return [recipientName, recipientPhone, address].filter(Boolean).join(' | ');
}

function hydrateOrder(order: any): Order {
  const rawAddress = order.shipping_address?.toString() || '';
  const parts = rawAddress.split(' | ');

  if (parts.length >= 3) {
    const [recipient_name, recipient_phone, ...addressParts] = parts;
    return {
      ...order,
      recipient_name,
      recipient_phone,
      shipping_address: addressParts.join(' | '),
    };
  }

  return {
    ...order,
    recipient_name: order.recipient_name || '',
    recipient_phone: order.recipient_phone || '',
  };
}

export async function createOrder(orderData: Partial<Order>): Promise<number> {
  const [result] = (await pool.query(
    `INSERT INTO orders (user_id, order_code, shipping_address, total_amount, payment_method, status) 
     VALUES (?, ?, ?, ?, ?, 'pending')`,
    [
      orderData.user_id ?? null,
      orderData.order_code,
      buildShippingAddress(orderData),
      orderData.total_amount,
      orderData.payment_method
    ]
  )) as [ResultSetHeader, any];
  return result.insertId;
}

export async function createOrderItems(orderId: number, items: any[]): Promise<void> {
  if (!items || items.length === 0) return;
  const values = items.map((item) => [
    orderId,
    Number(item.id),
    item.name || null,
    item.variant?.size || item.variant_info || null,
    item.quantity,
    item.price,
  ]);
  
  await pool.query(
    `INSERT INTO order_items (order_id, product_id, product_name_snapshot, variant_info, quantity, price) VALUES ?`,
    [values]
  );
}

export async function getOrderItems(orderId: number): Promise<any[]> {
  try {
    const [rows] = await pool.query(
      `SELECT 
        oi.*,
        COALESCE(oi.product_name_snapshot, p.name) as product_name,
        p.image as product_image 
       FROM order_items oi 
       LEFT JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [orderId]
    );
    return rows as any[];
  } catch (error: any) {
    console.error(`[getOrderItems] Failed for orderId=${orderId}:`, error?.message);
    return [];
  }
}

export async function getOrderById(orderId: number): Promise<Order | null> {
  const [rows] = await pool.query<Order[]>(
    `SELECT * FROM orders WHERE id = ?`, [orderId]
  );
  return rows[0] ? hydrateOrder(rows[0]) : null;
}

export async function updateStatus(orderId: number, status: string, paymentStatus?: string): Promise<void> {
  await pool.query(
    `UPDATE orders SET status = ? WHERE id = ?`,
    [status, orderId]
  );
}

export async function getAllOrders(): Promise<Order[]> {
  const [rows] = await pool.query<Order[]>(
    `SELECT * FROM orders`
  );
  return rows.map((row) => hydrateOrder(row));
}