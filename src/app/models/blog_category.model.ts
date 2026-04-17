import pool from "../lib/db";
import { ResultSetHeader } from "mysql2";

export type BlogCategory = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    status: 'active' | 'inactive';
};

export async function getAllBlogCategories(): Promise<BlogCategory[]> {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS blog_categories (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                slug VARCHAR(255) NOT NULL UNIQUE,
                description TEXT DEFAULT NULL,
                status ENUM('active','inactive') NOT NULL DEFAULT 'active',
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        const [rows] = await pool.query('SELECT * FROM blog_categories ORDER BY id DESC');
        return rows as BlogCategory[];
    } catch (error) {
        console.error('[getAllBlogCategories] Error:', error);
        return [];
    }
}

export async function getBlogCategoryById(id: number): Promise<BlogCategory | null> {
    const [rows] = await pool.query('SELECT * FROM blog_categories WHERE id = ? LIMIT 1', [id]);
    const items = rows as BlogCategory[];
    return items.length > 0 ? items[0] : null;
}

export async function createBlogCategory(data: Omit<BlogCategory, 'id'>) {
    const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO blog_categories (name, slug, description, status) VALUES (?, ?, ?, ?)`,
        [data.name, data.slug, data.description, data.status]
    );
    return result;
}

export async function updateBlogCategory(id: number, data: Partial<BlogCategory>) {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    values.push(id);

    if (fields.length === 0) return null;

    const [result] = await pool.query<ResultSetHeader>(
        `UPDATE blog_categories SET ${fields} WHERE id = ?`,
        values
    );
    return result;
}

export async function deleteBlogCategory(id: number) {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM blog_categories WHERE id = ?', [id]);
    return result;
}
