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
<<<<<<< HEAD
=======
}

export async function SortProducts(sort: string) {
  let orderBy = "id DESC";
  if (sort === "price-asc") {
    orderBy = "price ASC";
  } 
  if (sort === "price-desc") {
    orderBy = "price DESC";
  }
  if (sort === "newest") {
    orderBy = "created_at DESC";
  }
  const [rows] = await pool.query(
    `SELECT * FROM products ORDER BY ${orderBy}`
  );
  return rows;
}

export async function findProductsWithPagination(
  sort: string,
  limit: number,
  offset: number
) {
  let orderBy = "id DESC";

  if (sort === "price-asc") orderBy = "price ASC";
  if (sort === "price-desc") orderBy = "price DESC";
  if (sort === "newest") orderBy = "created_at DESC";


  const [rows] = await pool.query(
    `SELECT * FROM products ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  return rows;
}

export async function countProducts() {
  const [rows]: any = await pool.query(
    "SELECT COUNT(*) as total FROM products"
  );
  return rows[0].total;
>>>>>>> 1e602eb8ac2e589c7f831c8f4b2e4866074d80f5
}