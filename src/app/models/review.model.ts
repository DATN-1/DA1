import pool from "../lib/db";
import { ResultSetHeader } from "mysql2";

export type Review = {
    id: number;
    user_id: number;
    product_id: number;
    order_item_id: number;
    rating: number;
    comment: string | null;
    is_approved: boolean | number;
    status: 'pending' | 'approved';
    created_at?: string;
    
    // joined fields
    user_name?: string;
    product_name?: string;
};

export async function getAllReviews(): Promise<Review[]> {
    const [rows] = await pool.query(`
        SELECT 
            r.*, 
            u.full_name as user_name, 
            p.name as product_name
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        LEFT JOIN products p ON r.product_id = p.id
        ORDER BY r.created_at DESC
    `);
    return rows as Review[];
}

export async function getReviewById(id: number): Promise<Review | null> {
    const [rows] = await pool.query('SELECT * FROM reviews WHERE id = ? LIMIT 1', [id]);
    const items = rows as Review[];
    return items.length > 0 ? items[0] : null;
}

export async function updateReviewStatus(id: number, status: 'pending' | 'approved') {
    const [result] = await pool.query<ResultSetHeader>(
        `UPDATE reviews SET status = ?, is_approved = ? WHERE id = ?`,
        [status, status === 'approved' ? 1 : 0, id]
    );
    return result;
}

export async function deleteReview(id: number) {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM reviews WHERE id = ?', [id]);
    return result;
}
