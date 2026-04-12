import pool from '@/app/lib/db';
import { Brand } from '@/app/type/brandType';
import { ResultSetHeader } from 'mysql2';

export async function getAllBrands(): Promise<Brand[]> {
  const [rows] = await pool.query<Brand[]>(
    `SELECT id, name, logo_url FROM brands ORDER BY name ASC`
  );
  return rows;
}

export async function getBrandById(id: number): Promise<Brand | null> {
  const [rows] = await pool.query<Brand[]>(
    `SELECT id, name, logo_url FROM brands WHERE id = ?`,
    [id]
  );
  return rows[0] ?? null;
}

export async function createBrand(name: string, logo_url: string | null): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO brands (name, logo_url) VALUES (?, ?)`,
    [name, logo_url]
  );
  return result.insertId;
}

export async function updateBrand(id: number, name: string, logo_url: string | null): Promise<void> {
  await pool.query(
    `UPDATE brands SET name = ?, logo_url = ? WHERE id = ?`,
    [name, logo_url, id]
  );
}

export async function deleteBrand(id: number): Promise<void> {
  await pool.query(`DELETE FROM brands WHERE id = ?`, [id]);
}
