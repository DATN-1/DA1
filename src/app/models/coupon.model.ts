import pool from "../lib/db";
import { ResultSetHeader } from "mysql2";

export type Coupon = {
    id: number;
    code: string;
    description: string | null;
    discount_type: 'percentage' | 'fixed_amount';
    discount_value: number;
    start_date: Date | string;
    end_date: Date | string;
    usage_limit: number | null;
    usage_count: number;
    min_order_value: number | null;
    status: 'active' | 'expired';
};

export async function getAllCoupons(): Promise<Coupon[]> {
    const [rows] = await pool.query('SELECT * FROM coupons ORDER BY id DESC');
    return rows as Coupon[];
}

export async function getCouponById(id: number): Promise<Coupon | null> {
    const [rows] = await pool.query('SELECT * FROM coupons WHERE id = ? LIMIT 1', [id]);
    const items = rows as Coupon[];
    return items.length > 0 ? items[0] : null;
}

export async function createCoupon(data: Omit<Coupon, 'id' | 'usage_count'>) {
    const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO coupons (code, description, discount_type, discount_value, start_date, end_date, usage_limit, min_order_value, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.code, data.description, data.discount_type, data.discount_value, data.start_date, data.end_date, data.usage_limit, data.min_order_value, data.status]
    );
    return result;
}

export async function updateCoupon(id: number, data: Partial<Coupon>) {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    values.push(id);
    
    if (fields.length === 0) return null;

    const [result] = await pool.query<ResultSetHeader>(
        `UPDATE coupons SET ${fields} WHERE id = ?`,
        values
    );
    return result;
}

export async function deleteCoupon(id: number) {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM coupons WHERE id = ?', [id]);
    return result;
}
