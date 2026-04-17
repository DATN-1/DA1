import pool from '../lib/db';
import { Gallery, GalleryForm } from '../type/GalleryType';
import { ResultSetHeader } from 'mysql2';

let galleryTableReady = false;

async function ensureGalleryTable() {
  if (galleryTableReady) {
    return;
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS galleries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NULL,
      image_url VARCHAR(500) NOT NULL,
      title VARCHAR(255) NULL,
      category VARCHAR(100) NOT NULL DEFAULT 'khac',
      display_order INT NOT NULL DEFAULT 0,
      status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_gallery_product_id (product_id),
      CONSTRAINT fk_gallery_product_id FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL ON UPDATE CASCADE
    )
  `);

  const [productIdColumn] = await pool.query("SHOW COLUMNS FROM galleries LIKE 'product_id'");
  if (!Array.isArray(productIdColumn) || productIdColumn.length === 0) {
    await pool.query('ALTER TABLE galleries ADD COLUMN product_id INT NULL AFTER id');
  }

  galleryTableReady = true;
}

export async function getAllGalleries(status?: 'active' | 'inactive'): Promise<Gallery[]> {
  await ensureGalleryTable();

  if (status) {
    const [rows] = await pool.query(
      `SELECT g.*, p.name AS product_name
       FROM galleries g
       LEFT JOIN products p ON p.id = g.product_id
       WHERE g.status = ?
         AND p.status = 'active'
       ORDER BY g.display_order ASC, g.created_at DESC`,
      [status]
    );
    return rows as Gallery[];
  }

  const [rows] = await pool.query(
    `SELECT g.*, p.name AS product_name
     FROM galleries g
     LEFT JOIN products p ON p.id = g.product_id
     ORDER BY g.display_order ASC, g.created_at DESC`
  );
  return rows as Gallery[];
}

export async function createGallery(data: GalleryForm) {
  await ensureGalleryTable();

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO galleries (product_id, image_url, title, category, display_order, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.product_id,
      data.image_url,
      data.title || null,
      data.category || 'khac',
      Number(data.display_order) || 0,
      data.status || 'active',
    ]
  );

  return result;
}

export async function updateGallery(id: number, data: GalleryForm) {
  await ensureGalleryTable();

  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE galleries
     SET product_id = ?, image_url = ?, title = ?, category = ?, display_order = ?, status = ?
     WHERE id = ?`,
    [
      data.product_id,
      data.image_url,
      data.title || null,
      data.category || 'khac',
      Number(data.display_order) || 0,
      data.status || 'active',
      id,
    ]
  );

  return result;
}

export async function deleteGallery(id: number) {
  await ensureGalleryTable();

  const [result] = await pool.query<ResultSetHeader>('DELETE FROM galleries WHERE id = ?', [id]);
  return result;
}
