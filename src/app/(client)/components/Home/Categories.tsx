
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
        // Fetch categories and products in parallel
        const [catRes, prodRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/products?limit=all"),
        ]);

        const catData = await catRes.json();
        const prodData = await prodRes.json();

        const catList = Array.isArray(catData) ? catData : [];
        const products = Array.isArray(prodData) ? prodData : [];

        // Count products per category using category_name matching
        const countByName = new Map<string, number>();
        for (const product of products) {
          const name = String(product?.category_name || "").trim();
          if (!name) continue;
          countByName.set(name, (countByName.get(name) || 0) + 1);
        }

        const result: CategoryItem[] = catList
          .map((cat: { id: number; name: string }) => ({
            id: cat.id,
            name: cat.name,
            count: countByName.get(cat.name) || 0,
          }))
          .filter((cat: CategoryItem) => cat.count > 0)
          .sort((a: CategoryItem, b: CategoryItem) => b.count - a.count)
          .slice(0, 4);

        setCategories(result);
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