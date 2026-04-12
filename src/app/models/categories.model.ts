import pool from '@/app/lib/db';
import { Category } from '@/app/type/categoryType';
import { ResultSetHeader } from 'mysql2';

export async function getAllCategories(): Promise<Category[]> {
  const [rows] = await pool.query<Category[]>(
    `SELECT id, name, slug, description, image FROM categories ORDER BY name ASC`
  );
  return rows;
}

export async function getCategoryById(id: number): Promise<Category | null> {
  const [rows] = await pool.query<Category[]>(
    `SELECT id, name, slug, description, image FROM categories WHERE id = ?`,
    [id]
  );
  return rows[0] ?? null;
}

export async function createCategory(data: Partial<Category>): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO categories (name, slug, description, image) VALUES (?, ?, ?, ?)`,
    [data.name, data.slug ?? null, data.description ?? null, data.image ?? null]
  );
  return result.insertId;
}

export async function updateCategory(id: number, data: Partial<Category>): Promise<void> {
  await pool.query(
    `UPDATE categories SET name = ?, slug = ?, description = ?, image = ? WHERE id = ?`,
    [data.name, data.slug ?? null, data.description ?? null, data.image ?? null, id]
  );
}

export async function deleteCategory(id: number): Promise<void> {
  await pool.query(`DELETE FROM categories WHERE id = ?`, [id]);
}