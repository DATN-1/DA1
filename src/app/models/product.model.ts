import pool from "@/app/lib/db";

export async function findAllProducts() {
  const [rows] = await pool.query("SELECT * FROM products");
  return rows;
}

export async function findProductById(id: string) {
  const [rows]: any = await pool.query(
    "SELECT * FROM products WHERE id = ?",
    [id]
  );
  return rows[0];
}