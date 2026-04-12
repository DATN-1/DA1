import pool from "../lib/db";
import { Banner, BannerForm } from "../type/BannerType";
import { ResultSetHeader } from "mysql2";

export async function getAllBanners(): Promise<Banner[]> {
    const [rows] = await pool.query('SELECT * FROM banners ORDER BY display_order ASC, created_at DESC');
    return rows as Banner[];
}

export async function getBannerById(id: number): Promise<Banner | null> {
    const [rows] = await pool.query('SELECT * FROM banners WHERE id = ? LIMIT 1', [id]);
    const banners = rows as Banner[];
    return banners.length > 0 ? banners[0] : null;
}

export async function createBanner(data: BannerForm) {
    const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO banners (image_url, title, link_to, display_order, status) 
         VALUES (?, ?, ?, ?, ?)`,
        [data.image_url, data.title || null, data.link_to || null, data.display_order || 0, data.status || 'active']
    );
    return result;
}

export async function updateBanner(id: number, data: BannerForm) {
    const [result] = await pool.query<ResultSetHeader>(
        `UPDATE banners 
         SET image_url = ?, title = ?, link_to = ?, display_order = ?, status = ?
         WHERE id = ?`,
        [data.image_url, data.title || null, data.link_to || null, data.display_order || 0, data.status || 'active', id]
    );
    return result;
}

export async function deleteBanner(id: number) {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM banners WHERE id = ?', [id]);
    return result;
}
