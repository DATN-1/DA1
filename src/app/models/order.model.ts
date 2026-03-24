import { Order } from '@/app/type/orderType';
import pool from '@/app/lib/db';
import { ResultSetHeader } from 'mysql2';

export async function createOrder(orderData: Partial<Order>): Promise<number> {
  const [result] = (await pool.query(
    `INSERT INTO orders (order_code, recipient_name, recipient_phone, shipping_address, total_amount, payment_method, status) 
     VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
    [
      orderData.order_code,
      orderData.recipient_name,
      orderData.recipient_phone,
      orderData.shipping_address,
      orderData.total_amount,
      orderData.payment_method
    ]
  )) as [ResultSetHeader, any];
  return result.insertId;
}

export async function createOrderItems(orderId: number, items: any[]): Promise<void> {
  if (!items || items.length === 0) return;
  // Cột: order_id, product_id, product_variant_id, quantity, price
  const values = items.map(item => [orderId, item.id, null, item.quantity, item.price]);
  
  await pool.query(
    `INSERT INTO order_items (order_id, product_id, product_variant_id, quantity, price) VALUES ?`,
    [values]
  );
}

export async function getOrderItems(orderId: number): Promise<any[]> {
  const [rows] = await pool.query(
    `SELECT oi.*, p.name as product_name, p.image as product_image 
     FROM order_items oi 
     LEFT JOIN products p ON oi.product_id = p.id 
     WHERE oi.order_id = ?`,
    [orderId]
  );
  return rows as any[];
}

export async function getOrderById(orderId: number): Promise<Order | null> {
  const [rows] = await pool.query<Order[]>(
    `SELECT * FROM orders WHERE id = ?`, [orderId]
  );
  return rows[0] ?? null;
}

export async function updateStatus(orderId: number, status: string, paymentStatus?: string): Promise<void> {
  if (paymentStatus) {
    await pool.query(
      `UPDATE orders SET status = ?, payment_status = ? WHERE id = ?`,
      [status, paymentStatus, orderId]
    );
  } else {
    await pool.query(
      `UPDATE orders SET status = ? WHERE id = ?`,
      [status, orderId]
    );
  }
}

export async function getAllOrders(): Promise<Order[]> {
  const [rows] = await pool.query<Order[]>(
    `SELECT * FROM orders`
  );
  return rows;
}