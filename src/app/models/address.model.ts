import pool from '@/app/lib/db';

export type AddressRow = {
  id: number;
  user_id: number;
  recipient_name: string;
  phone: string;
  address_line: string;
  province_code: string | null;
  district_code: string | null;
  created_at: Date;
  updated_at: Date;
};

async function ensureAddressTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS addresses (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      user_id INT UNSIGNED NOT NULL UNIQUE,
      recipient_name VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      address_line TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  try {
    await pool.query('ALTER TABLE addresses ADD COLUMN province_code VARCHAR(20) DEFAULT NULL;');
  } catch (_e) {}
  try {
    await pool.query('ALTER TABLE addresses ADD COLUMN district_code VARCHAR(20) DEFAULT NULL;');
  } catch (_e) {}
}

export async function findAddressByUserId(userId: number): Promise<AddressRow | null> {
  await ensureAddressTable();
  const [rows] = await pool.query('SELECT * FROM addresses WHERE user_id = ? LIMIT 1', [userId]);
  return Array.isArray(rows) && rows.length > 0 ? (rows[0] as AddressRow) : null;
}

export async function createOrUpdateAddress(
  userId: number,
  recipient_name: string,
  phone: string,
  address_line: string,
  province_code: string | null = null,
  district_code: string | null = null
) {
  await ensureAddressTable();

  const existingAddress = await findAddressByUserId(userId);

  if (existingAddress) {
    const [result] = await pool.query(
      `UPDATE addresses
       SET recipient_name = ?, phone = ?, address_line = ?, province_code = ?, district_code = ?
       WHERE user_id = ?`,
      [recipient_name, phone, address_line, province_code, district_code, userId]
    );
    return result;
  } else {
    const [result] = await pool.query(
      `INSERT INTO addresses (user_id, recipient_name, phone, address_line, province_code, district_code)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, recipient_name, phone, address_line, province_code, district_code]
    );
    return result;
  }
}
