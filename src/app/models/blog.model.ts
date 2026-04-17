import pool from "../lib/db";
import { Blog } from "../type/BlogType";
import { ResultSetHeader } from "mysql2";

export async function getAllBlogs(): Promise<Blog[]> {
    const [rows] = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
    return rows as Blog[];
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
    const [rows] = await pool.query('SELECT * FROM blogs WHERE slug = ? LIMIT 1', [slug]);
    const blogs = rows as Blog[];
    return blogs.length > 0 ? blogs[0] : null;
}

export async function getBlogById(id: number): Promise<Blog | null> {
    const [rows] = await pool.query('SELECT * FROM blogs WHERE id = ? LIMIT 1', [id]);
    const blogs = rows as Blog[];
    return blogs.length > 0 ? blogs[0] : null;
}

export async function createBlog(data: Omit<Blog, 'id' | 'created_at'>) {
    const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO blogs (title, slug, category, summary, content, image_url, author, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.title, data.slug, data.category, data.summary, data.content, data.image_url, data.author, data.status]
    );
    return result;
}

export async function updateBlog(id: number, data: Omit<Blog, 'id' | 'created_at'>) {
    const [result] = await pool.query<ResultSetHeader>(
        `UPDATE blogs 
         SET title = ?, slug = ?, category = ?, summary = ?, content = ?, image_url = ?, author = ?, status = ?
         WHERE id = ?`,
        [data.title, data.slug, data.category, data.summary, data.content, data.image_url, data.author, data.status, id]
    );
    return result;
}

export async function deleteBlog(id: number) {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM blogs WHERE id = ?', [id]);
    return result;
}