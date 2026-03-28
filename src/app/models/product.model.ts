import pool from "@/app/lib/db";

type ProductFilters = {
  search: string;
  categoryIds: number[];
  priceRanges: string[];
  minimumRating: number;
};

function parseProductImages(rawImage: unknown) {
  if (Array.isArray(rawImage)) {
    return rawImage.filter((image): image is string => typeof image === "string" && image.trim().length > 0);
  }

  if (typeof rawImage === "string" && rawImage.trim()) {
    try {
      const parsed = JSON.parse(rawImage);
      if (Array.isArray(parsed)) {
        return parsed.filter((image): image is string => typeof image === "string" && image.trim().length > 0);
      }
    } catch {
      return [rawImage];
    }

    return [rawImage];
  }

  return [];
}

function buildVariantGalleryMap(
  variants: Array<{ id: number; size?: string }>,
  gallery: string[],
  variantImagesExist: boolean
): Record<number, string[]> {
  if (!Array.isArray(variants) || variants.length === 0) {
    return {};
  }

  if (!Array.isArray(gallery) || gallery.length === 0) {
    return variants.reduce((map, variant) => {
      map[variant.id] = [];
      return map;
    }, {} as Record<number, string[]>);
  }

  // Nếu ảnh biến thể tồn tại trong DB, sử dụng logic phân tán thông minh
  // Nếu không, tất cả biến thể cùng dùng ảnh cơ sở
  if (!variantImagesExist) {
    return variants.reduce((map, variant) => {
      map[variant.id] = gallery.slice(0, 4);
      return map;
    }, {} as Record<number, string[]>);
  }

  // Với ảnh biến thể, phân phối ảnh cho các biến thể theo thứ tự
  return variants.reduce((map, variant, index) => {
    const startIdx = (index * Math.ceil(gallery.length / variants.length)) % gallery.length;
    const rotated = Array.from(
      { length: Math.min(gallery.length, 4) },
      (_, imageIndex) => gallery[(startIdx + imageIndex) % gallery.length]
    );
    map[variant.id] = [...new Set(rotated)].slice(0, 4);
    return map;
  }, {} as Record<number, string[]>);
}

function getProductOrderBy(sort: string) {
  if (sort === "price-asc") return "p.price ASC";
  if (sort === "price-desc") return "p.price DESC";
  if (sort === "newest") return "p.id DESC";
  return "p.id DESC";
}

function buildProductFilterQuery(filters: ProductFilters) {
  const whereClauses: string[] = ["p.name LIKE ?", "p.status = 'active'"];
  const whereParams: Array<string | number> = [`%${filters.search.trim()}%`];

  if (filters.categoryIds.length > 0) {
    const placeholders = filters.categoryIds.map(() => "?").join(", ");
    whereClauses.push(`p.category_id IN (${placeholders})`);
    whereParams.push(...filters.categoryIds);
  }

  if (filters.priceRanges.length > 0) {
    const priceClauses: string[] = [];

    if (filters.priceRanges.includes("under-300")) {
      priceClauses.push("p.price < 300000");
    }

    if (filters.priceRanges.includes("300-500")) {
      priceClauses.push("p.price >= 300000 AND p.price <= 500000");
    }

    if (filters.priceRanges.includes("over-500")) {
      priceClauses.push("p.price > 500000");
    }

    if (priceClauses.length > 0) {
      whereClauses.push(`(${priceClauses.join(" OR ")})`);
    }
  }

  const havingClauses: string[] = [];
  const havingParams: number[] = [];

  if (filters.minimumRating > 0) {
    havingClauses.push("average_rating >= ?");
    havingParams.push(filters.minimumRating);
  }

  return {
    whereSql: whereClauses.join(" AND "),
    whereParams,
    havingSql: havingClauses.length > 0 ? `HAVING ${havingClauses.join(" AND ")}` : "",
    havingParams,
  };
}

export async function findAllProducts() {
  const [rows] = await pool.query(
    `SELECT 
      p.id,
      p.name,
      p.price,
      p.stock,
      p.image_url AS image,
      c.name as category_name,
      b.name as brand_name
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN brands b ON p.brand_id = b.id
    WHERE p.status = 'active'
    `
  );
  return rows;
}

export async function findAvailableProductCategories() {
  const [rows] = await pool.query(
    `SELECT id, name
     FROM categories
     ORDER BY name ASC`
  );
  return rows;
}

export async function findProductVariants(productId: number) {
  const [rows]: any = await pool.query(
    `SELECT id, product_id, size, price, stock, sku
     FROM product_variants
     WHERE product_id = ?
     ORDER BY size ASC`,
    [productId]
  );
  return rows;
}

export async function findProductGallery(productId: number, rawImage: unknown) {
  const [rows]: any = await pool.query(
    `SELECT image_url
     FROM variant_images
     WHERE product_id = ?
     ORDER BY id ASC`,
    [productId]
  );

  const baseImages = parseProductImages(rawImage);
  const variantImages = Array.isArray(rows)
    ? rows.map((row: { image_url: string }) => row.image_url).filter(Boolean)
    : [];

  // Kiểm tra xem có ảnh biến thể từ DB không
  // Nếu có, trộn ảnh cơ sở với ảnh biến thể
  // Nếu không, chỉ dùng ảnh cơ sở
  const hasVariantImages = Array.isArray(variantImages) && variantImages.length > 0;
  const combinedImages = hasVariantImages 
    ? [...new Set([...baseImages, ...variantImages])]
    : baseImages;

  return Object.freeze({
    images: combinedImages,
    variantImagesExist: hasVariantImages,
    baseImages,
    variantImages,
  });
}

export async function findProductReviews(productId: number) {
  const [rows]: any = await pool.query(
    `SELECT
      r.id,
      r.rating,
      r.comment,
      r.created_at,
      u.full_name AS reviewer_name
    FROM reviews r
    LEFT JOIN users u ON u.id = r.user_id
    WHERE r.product_id = ? AND r.status = 'approved'
    ORDER BY r.created_at DESC
    LIMIT 6`,
    [productId]
  );

  return rows;
}

export async function createProductReview(params: {
  userId: number;
  productId: number;
  rating: number;
  comment: string;
}) {
  const [insertResult]: any = await pool.query(
    `INSERT INTO reviews (user_id, product_id, rating, comment, status)
     VALUES (?, ?, ?, ?, 'approved')`,
    [params.userId, params.productId, params.rating, params.comment]
  );

  const insertedId = insertResult?.insertId;
  if (!insertedId) {
    return null;
  }

  const [rows]: any = await pool.query(
    `SELECT
      r.id,
      r.rating,
      r.comment,
      r.created_at,
      u.full_name AS reviewer_name
    FROM reviews r
    LEFT JOIN users u ON u.id = r.user_id
    WHERE r.id = ?
    LIMIT 1`,
    [insertedId]
  );

  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
}

export async function findRelatedProducts(productId: number, categoryId: number | null) {
  const [sameCategoryRows]: any = await pool.query(
    `SELECT
      p.id,
      p.name,
      p.price,
      p.image_url AS image,
      p.description,
      COALESCE(AVG(CASE WHEN r.status = 'approved' THEN r.rating END), 0) AS average_rating,
      COUNT(CASE WHEN r.status = 'approved' THEN 1 END) AS review_count
    FROM products p
    LEFT JOIN reviews r ON r.product_id = p.id
    WHERE p.status = 'active'
      AND p.id <> ?
      AND (? IS NOT NULL AND p.category_id = ?)
    GROUP BY p.id
    ORDER BY p.id DESC
    LIMIT 4`,
    [productId, categoryId, categoryId]
  );

  if (Array.isArray(sameCategoryRows) && sameCategoryRows.length >= 4) {
    return sameCategoryRows;
  }

  const existingIds = new Set<number>((sameCategoryRows || []).map((item: { id: number }) => item.id));
  const fallbackLimit = 4 - existingIds.size;

  const [fallbackRows]: any = await pool.query(
    `SELECT
      p.id,
      p.name,
      p.price,
      p.image_url AS image,
      p.description,
      COALESCE(AVG(CASE WHEN r.status = 'approved' THEN r.rating END), 0) AS average_rating,
      COUNT(CASE WHEN r.status = 'approved' THEN 1 END) AS review_count
    FROM products p
    LEFT JOIN reviews r ON r.product_id = p.id
    WHERE p.status = 'active'
      AND p.id <> ?
    GROUP BY p.id
    ORDER BY p.id DESC
    LIMIT ?`,
    [productId, Math.max(fallbackLimit, 0)]
  );

  const uniqueFallback = (fallbackRows || []).filter((item: { id: number }) => !existingIds.has(item.id));
  return [...(sameCategoryRows || []), ...uniqueFallback].slice(0, 4);
}

export async function findProductById(id: string) {
  const [rows]: any = await pool.query(
    `SELECT
      p.*,
      c.name AS category_name,
      b.name AS brand_name,
      COALESCE(AVG(CASE WHEN r.status = 'approved' THEN r.rating END), 0) AS average_rating,
      COUNT(CASE WHEN r.status = 'approved' THEN 1 END) AS review_count
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     LEFT JOIN brands b ON p.brand_id = b.id
     LEFT JOIN reviews r ON r.product_id = p.id
     WHERE p.id = ?
     GROUP BY p.id`,
    [id]
  );
  
  if (!rows[0]) {
    return null;
  }

  const product = rows[0];
  const [variants, galleryData, reviews, relatedProducts] = await Promise.all([
    findProductVariants(product.id),
    findProductGallery(product.id, product.image_url),
    findProductReviews(product.id),
    findRelatedProducts(product.id, product.category_id ?? null),
  ]);
  
  const gallery = galleryData.images || [];
  const variantImagesExist = galleryData.variantImagesExist || false;
  const variantGalleryMap = buildVariantGalleryMap(variants || [], gallery || [], variantImagesExist);
  
  return {
    ...product,
    image: product.image_url,
    variants: variants || [],
    gallery,
    variantGalleryMap,
    variantImagesExist,
    reviews: reviews || [],
    relatedProducts: relatedProducts || [],
  };
}

export async function SortProducts(sort: string) {
  const orderBy = getProductOrderBy(sort).replaceAll("p.", "");
  const [rows] = await pool.query(
    `SELECT * FROM products WHERE status = 'active' ORDER BY ${orderBy}`
  );
  return rows;
}

export async function findProductsWithPagination(
  filters: ProductFilters,
  sort: string,
  limit: number,
  offset: number
) {
  const orderBy = getProductOrderBy(sort);
  const { whereSql, whereParams, havingSql, havingParams } = buildProductFilterQuery(filters);

  const [rows] = await pool.query(
    `SELECT
      p.id,
      p.category_id,
      p.brand_id,
      p.name,
      p.slug,
      p.price,
      p.discount_price,
      p.image_url AS image,
      p.stock,
      p.weight AS size,
      p.description,
      p.status,
      p.is_featured,
      MAX(c.name) AS category_name,
      MAX(b.name) AS brand_name,
      COALESCE(AVG(CASE WHEN r.status = 'approved' THEN r.rating END), 0) AS average_rating,
      COUNT(CASE WHEN r.status = 'approved' THEN 1 END) AS review_count
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN brands b ON p.brand_id = b.id
    LEFT JOIN reviews r ON r.product_id = p.id
    WHERE ${whereSql}
    GROUP BY p.id
    ${havingSql}
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?`,
    [...whereParams, ...havingParams, limit, offset]
  );

  return rows;
}

export async function countProducts(filters: ProductFilters) {
  const { whereSql, whereParams, havingSql, havingParams } = buildProductFilterQuery(filters);
  const [rows]: any = await pool.query(
    `SELECT COUNT(*) AS total
     FROM (
      SELECT
        p.id,
        COALESCE(AVG(CASE WHEN r.status = 'approved' THEN r.rating END), 0) AS average_rating
      FROM products p
      LEFT JOIN reviews r ON r.product_id = p.id
      WHERE ${whereSql}
      GROUP BY p.id
      ${havingSql}
     ) filtered_products`,
    [...whereParams, ...havingParams]
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

export async function createProduct(params: {
  name: string;
  price: number;
  stock: number;
  image_url: string;
  category_id: number | null;
  brand_id: number | null;
  description: string | null;
  status: "active" | "draft" | "archived";
}) {
  const slug = params.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || `product-${Date.now()}`;

  const [result]: any = await pool.query(
    `INSERT INTO products
      (name, slug, price, stock, image_url, category_id, brand_id, description, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      params.name,
      slug,
      params.price,
      params.stock,
      params.image_url,
      params.category_id,
      params.brand_id,
      params.description,
      params.status,
    ]
  );

  return result?.insertId || null;
}

export async function updateProductById(
  id: number,
  params: {
    name: string;
    price: number;
    stock: number;
    image_url: string;
    category_id: number | null;
    brand_id: number | null;
    description: string | null;
    status: "active" | "draft" | "archived";
  }
) {
  const [result]: any = await pool.query(
    `UPDATE products
     SET
      name = ?,
      price = ?,
      stock = ?,
      image_url = ?,
      category_id = ?,
      brand_id = ?,
      description = ?,
      status = ?
     WHERE id = ?`,
    [
      params.name,
      params.price,
      params.stock,
      params.image_url,
      params.category_id,
      params.brand_id,
      params.description,
      params.status,
      id,
    ]
  );

  return result?.affectedRows || 0;
}

export async function deleteProductById(id: number) {
  const [result]: any = await pool.query(`DELETE FROM products WHERE id = ?`, [id]);
  return result?.affectedRows || 0;
}