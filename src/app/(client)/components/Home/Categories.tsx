
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CategoryItem = {
  id: number;
  name: string;
  count: number;
};

function getCategoryIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("hoa")) return "🌸";
  if (n.includes("tươi") || n.includes("fresh") || n.includes("mint")) return "🌿";
  if (n.includes("ngọt") || n.includes("sweet") || n.includes("vanilla")) return "🍰";
  if (n.includes("gỗ") || n.includes("wood")) return "🌲";
  return "🕯️";
}

export default function CategoriesSection() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/products?limit=all");
        const data = await response.json();
        const products = Array.isArray(data) ? data : [];

        const categoryMap = new Map<number, CategoryItem>();
        for (const product of products) {
          const categoryId = Number(product?.category_id);
          const categoryName = String(product?.category_name || "Khác");

          if (!Number.isInteger(categoryId) || categoryId <= 0) {
            continue;
          }

          if (!categoryMap.has(categoryId)) {
            categoryMap.set(categoryId, {
              id: categoryId,
              name: categoryName,
              count: 0,
            });
          }

          const item = categoryMap.get(categoryId)!;
          item.count += 1;
        }

        setCategories(Array.from(categoryMap.values()).sort((a, b) => b.count - a.count).slice(0, 4));
      } catch {
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section style={{ padding: "3rem 0", background: "white" }}>
      <div className="container">
        <div className="section-header">
          <h2>Danh Mục Sản Phẩm</h2>
          <p>Khám phá bộ sưu tập có sản phẩm tương ứng theo từng danh mục</p>
        </div>

        <div className="categories-grid">
          {categories.length === 0 && (
            <div className="category-card">
              <div className="category-icon">🕯️</div>
              <h3>Đang cập nhật</h3>
              <p>Chưa có dữ liệu danh mục</p>
            </div>
          )}

          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?categories=${category.id}`}
              className="category-card"
            >
              <div className="category-icon">{getCategoryIcon(category.name)}</div>
              <h3>{category.name}</h3>
              <p>{category.count} sản phẩm</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}