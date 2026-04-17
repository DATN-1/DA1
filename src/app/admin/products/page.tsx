'use client';

import { useEffect, useMemo, useState } from 'react';
import { ProductType } from '@/app/type/productType';
import Link from 'next/link';
import './products.css';

type StatusType = 'active' | 'draft' | 'archived';

const PAGE_SIZE = 12;

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingList, setLoadingList] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const clearFeedback = () => {
    setMessage('');
    setError('');
  };

  const loadProducts = async () => {
    setLoadingList(true);
    setError('');
    try {
      const response = await fetch('/api/products?limit=all');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Không thể tải sản phẩm');
      }
      setProducts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải sản phẩm');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return products;

    return products.filter((product) => {
      const haystack = [
        product.name,
        product.brand_name,
        product.category_name,
        String(product.id),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(keyword);
    });
  }, [products, search]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));

  const pagedProducts = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, currentPage, totalPages]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleDelete = async (id: number) => {
    const ok = window.confirm('Bạn có chắc muốn xóa sản phẩm này không?');
    if (!ok) return;

    clearFeedback();
    setDeletingId(id);
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Không thể xóa sản phẩm');
      }

      setMessage(data?.message || 'Xóa sản phẩm thành công');
      await loadProducts();
    } catch (err: any) {
      setError(err?.message || 'Không thể xóa sản phẩm');
    } finally {
      setDeletingId(null);
    }
  };

  const getStockClass = (stock: number) => {
    if (stock <= 0) return 'products-stock products-stock-out';
    if (stock < 10) return 'products-stock products-stock-low';
    return 'products-stock';
  };

  const getStatusClass = (status: StatusType) => {
    if (status === 'active') return 'products-badge products-badge-active';
    if (status === 'draft') return 'products-badge products-badge-draft';
    return 'products-badge products-badge-archived';
  };

  return (
    <div className="content-padding products-admin">
      {message ? <div className="products-feedback products-feedback-success">{message}</div> : null}
      {error ? <div className="products-feedback products-feedback-error">{error}</div> : null}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="products-input"
          style={{ width: '300px', marginBottom: 0 }}
        />
        <Link href="/admin/products/create" className="products-btn products-btn-primary" style={{ textDecoration: 'none' }}>
          + Thêm mới
        </Link>
      </div>

      <div className="products-grid" style={{ gridTemplateColumns: '1fr' }}>
        <section className="products-table-wrap">
          <div className="products-table-scroll">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Thương hiệu</th>
                  <th>Giá</th>
                  <th>Kho</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loadingList ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>Đang tải dữ liệu...</td>
                  </tr>
                ) : pagedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>Không có sản phẩm phù hợp</td>
                  </tr>
                ) : (
                  pagedProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <img
                          className="products-thumb"
                          src={(product as any).image_url || product.image || 'https://via.placeholder.com/48x48?text=NA'}
                          alt={product.name}
                          onError={(event) => {
                            event.currentTarget.src = 'https://via.placeholder.com/48x48?text=NA';
                          }}
                        />
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{product.name}</div>
                        <div style={{ color: '#64748b', fontSize: 12 }}>ID: #{product.id}</div>
                      </td>
                      <td>{product.category_name || '-'}</td>
                      <td>{product.brand_name || '-'}</td>
                      <td>{Number(product.price || 0).toLocaleString('vi-VN')} đ</td>
                      <td className={getStockClass(Number(product.stock || 0))}>{product.stock}</td>
                      <td>
                        <span className={getStatusClass((product.status || 'active') as StatusType)}>
                          {product.status || 'active'}
                        </span>
                      </td>
                      <td>
                        <div className="products-actions">
                          <Link
                            href={`/admin/products/edit/${product.id}`}
                            className="products-icon-btn"
                            title="Sửa"
                            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            ✎
                          </Link>
                          <button
                            type="button"
                            className="products-icon-btn products-btn-danger"
                            onClick={() => handleDelete(product.id)}
                            disabled={deletingId === product.id}
                            title="Xóa"
                          >
                            {deletingId === product.id ? '...' : '✕'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="products-pagination">
            <span>
              Trang {Math.min(currentPage, totalPages)} / {totalPages} - {filteredProducts.length} kết quả
            </span>
            <div className="products-pagination-controls">
              <button
                type="button"
                className="products-btn products-btn-ghost"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Trước
              </button>
              <button
                type="button"
                className="products-btn products-btn-ghost"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              >
                Sau
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
