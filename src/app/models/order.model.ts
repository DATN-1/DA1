import { Order } from '@/app/type/orderType';
import pool from '@/app/lib/db';



export async function getOrderById(orderId: number): Promise<Order | null> {
  const [rows] = await pool.query<Order[]>(
    `SELECT * FROM orders WHERE id = ?`, [orderId]
  );
  return rows[0] ?? null;
}

export async function updateStatus(orderId: number, status: string): Promise<void> {
  await pool.query(
    `UPDATE orders SET status = ? WHERE id = ?`,
    [status, orderId]
  );
}