"use client";

import "@/style/products.css";
import Link from "next/link";
import useCartControllers from "@/app/(client)/cart/useCartControllers";
import { Suspense } from "react";
import useProducts from "./useProducts";

function ProductsContent() {
  const { addToCart: cartAddToCart } = useCartControllers();
  const {
    products,
    categories,
    sort,
    setSort,
    page,
    setpage,
    total,
    totalPages,
    search,
    setSearch,
    selectedCategoryIds,
    selectedPriceRanges,
    selectedRatings,
    toggleCategory,
    togglePriceRange,
    toggleRating,
    clearFilters,
  } = useProducts();

  const hasActiveFilters =
    selectedCategoryIds.length > 0 ||
    selectedPriceRanges.length > 0 ||
    selectedRatings.length > 0;

  const renderStars = (averageRating: number = 0) => {
    const roundedRating = Math.round(averageRating);
    return Array.from({ length: 5 }, (_, index) => (
      <svg key={index} className={`star ${index < roundedRating ? "active" : "inactive"}`} viewBox="0 0 20 20">
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
      </svg>
    ));
  };

  return (
    <main>
      <section
        className="gradient-bg"
        style={{ minHeight: "100vh", padding: "4rem 0" }}>
        <div className="container">
          {/* Header */}
          <div className="section-header">
            <h1
              style={{
                fontSize: "3rem",
                fontWeight: "bold",
                color: "#1f2937",
                marginBottom: "1rem",
              }}>
              Bộ Sưu Tập Nến Thơm
            </h1>
            <p
              style={{
                fontSize: "1.125rem",
                color: "#6b7280",
                maxWidth: "42rem",
                margin: "0 auto",
              }}>
              Khám phá những mùi hương độc đáo, mang đến không gian thư giãn và
              ấm cúng cho ngôi nhà của bạn
            </p>
          </div>

          {/* Search Bar */}
          <div className="search-container">
            <svg
              className="search-icon"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              className="search-input"
              id="productSearch"
              placeholder="Tìm kiếm sản phẩm theo tên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="products-layout">
            {/* Sidebar Filters */}
            <aside className="filters-sidebar">
              {/* Category Filter */}
              <div className="filter-group">
                <h3 className="filter-title">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                  Danh Mục
                </h3>
                <ul className="filter-list">
                  {categories.map((category) => (
                    <li key={category.id} className="filter-item">
                      <input
                        type="checkbox"
                        id={`cat-${category.id}`}
                        checked={selectedCategoryIds.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                      />
                      <label htmlFor={`cat-${category.id}`}>{category.name}</label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Filter */}
              <div className="filter-group">
                <h3 className="filter-title">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"
                    />
                  </svg>
                  Khoảng Giá
                </h3>
                <ul className="filter-list">
                  <li className="filter-item">
                    <input
                      type="checkbox"
                      id="price-1"
                      checked={selectedPriceRanges.includes("under-300")}
                      onChange={() => togglePriceRange("under-300")}
                    />
                    <label htmlFor="price-1">Dưới 300.000đ</label>
                  </li>
                  <li className="filter-item">
                    <input
                      type="checkbox"
                      id="price-2"
                      checked={selectedPriceRanges.includes("300-500")}
                      onChange={() => togglePriceRange("300-500")}
                    />
                    <label htmlFor="price-2">300.000đ - 500.000đ</label>
                  </li>
                  <li className="filter-item">
                    <input
                      type="checkbox"
                      id="price-3"
                      checked={selectedPriceRanges.includes("over-500")}
                      onChange={() => togglePriceRange("over-500")}
                    />
                    <label htmlFor="price-3">Trên 500.000đ</label>
                  </li>
                </ul>
              </div>

              {/* Rating Filter */}
              <div className="filter-group">
                <h3 className="filter-title">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  Đánh Giá
                </h3>
                <ul className="filter-list">
                  <li className="filter-item">
                    <input
                      type="checkbox"
                      id="rate-5"
                      checked={selectedRatings.includes(5)}
                      onChange={() => toggleRating(5)}
                    />
                    <label htmlFor="rate-5">5 Sao ✨</label>
                  </li>
                  <li className="filter-item">
                    <input
                      type="checkbox"
                      id="rate-4"
                      checked={selectedRatings.includes(4)}
                      onChange={() => toggleRating(4)}
                    />
                    <label htmlFor="rate-4">4 Sao trở lên</label>
                  </li>
                </ul>
              </div>

              {hasActiveFilters && (
                <button type="button" className="clear-filters-btn" onClick={clearFilters}>
                  Xóa bộ lọc
                </button>
              )}
            </aside>

            {/* Main Content */}
            <main className="products-main">
              {/* Toolbar */}
              <div className="products-toolbar">
                <div className="results-count">
                  Hiển thị <span id="displayedCount">{products.length}</span>{" "}
                  trong {total} sản phẩm
                </div>
                <select
                  className="sort-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}>
                  <option value="popular">Mặc định phổ biến</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                  <option value="newest">Mới nhất</option>
                </select>
              </div>

              {/* <!-- Products Grid --> */}
              <div className="products-grid" id="productsGrid">
                {products.length === 0 && (
                  <div className="product-card" style={{ gridColumn: "1 / -1", textAlign: "center" }}>
                    <div className="product-info">
                      <h3 className="product-name">Khong tim thay san pham</h3>
                      <p className="product-description">
                        Thu tim voi tu khoa khac de xem cac san pham phu hop.
                      </p>
                    </div>
                  </div>
                )}
                {products.map((product) => {
                  const productImage =
                    typeof product.image === "string"
                      ? (() => {
                          try {
                            const parsed = JSON.parse(product.image);
                            return Array.isArray(parsed) && parsed[0]
                              ? parsed[0]
                              : product.image;
                          } catch {
                            return product.image;
                          }
                        })()
                      : product.image;
                  return (
                    <div key={product.id} className="product-card">
                      <div className="product-image-container">
                        <img
                          src={productImage}
                          alt={product.name}
                          className="product-image"
                        />
                        <div className="product-badge">New</div>
                      </div>
                      <div className="product-info">
                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-description">
                          {product.description}
                        </p>
                        <div className="product-footer">
                          <span className="product-price">
                            {new Intl.NumberFormat("vi-VN").format(
                              product.price || 0,
                            )}{" "}
                            VND
                          </span>
                          <div className="rating">
                            {renderStars(Number(product.average_rating) || 0)}
                            <span className="rating-text-small">
                              {(Number(product.average_rating) || 0).toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <div className="product-actions">
                          <Link
                            href={`/products/${String(product.id)}`}
                            className="btn btn-dark">
                            Xem Chi Tiết
                          </Link>
                          <button
                            className="btn btn-amber"
                            onClick={() =>
                              cartAddToCart({
                                id: String(product.id),
                                name: product.name,
                                price: product.price,
                                image: [productImage],
                              })
                            }>
                            Thêm Vào Giỏ
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
              </div>
              <div className="pagination">
                  <button
                    disabled={page === 1}
                    onClick={() => setpage(page - 1)}>
                    Prev
                  </button>

                  <span>Trang {page}</span>

                  <button
                    disabled={page >= totalPages || totalPages === 0}
                    onClick={() => setpage(page + 1)}>
                    Next
                  </button>
                </div>
            </main>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function Product() {
  return (
    <Suspense fallback={<main className="gradient-bg" style={{ minHeight: "100vh", padding: "4rem 0" }}><div className="container"><p>Đang tải sản phẩm...</p></div></main>}>
      <ProductsContent />
    </Suspense>
  );
}
