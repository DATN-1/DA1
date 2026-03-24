import pool from "@/app/lib/db";

export async function findAllProducts() {
  const [rows] = await pool.query(
    `SELECT 
      p.id,
      p.name,
      p.price,
      p.stock,
      p.image,
      c.name as category_name,
      b.name as brand_name
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN brands b ON p.brand_id = b.id
    `
  );
  return rows;
}

export async function findProductById(id: string) {
  const [rows]: any = await pool.query(
    "SELECT * FROM products WHERE id = ?",
    [id]
  );
  return rows[0];
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
}

export async function incrementSoldCount(orderId: number): Promise<void> {
  await pool.query(`
    UPDATE products p
    LEFT JOIN order_items oi ON oi.product_id = p.id
    SET p.sold_count = p.sold_count + oi.quantity
    WHERE oi.order_id = ?
  `, [orderId]);
}