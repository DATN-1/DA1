'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ProductType } from '@/app/type/productType';
import './products.css';

type StatusType = 'active' | 'draft' | 'archived';
type OptionType = { id: number; name: string };

type ProductFormState = {
  name: string;
  price: number;
  stock: number;
  image_url: string;
  description: string;
  status: StatusType;
  category_id: number | null;
  brand_id: number | null;
};

const defaultForm: ProductFormState = {
  name: '',
  price: 0,
  stock: 0,
  image_url: '',
  description: '',
  status: 'active',
  category_id: null,
  brand_id: null,
};

const PAGE_SIZE = 12;

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<OptionType[]>([]);
  const [brands, setBrands] = useState<OptionType[]>([]);

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [loadingList, setLoadingList] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductFormState>(defaultForm);

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

  const loadMeta = async () => {
    try {
      const [categoryRes, brandRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/brands'),
      ]);

      const [categoryData, brandData] = await Promise.all([
        categoryRes.json(),
        brandRes.json(),
      ]);

      if (categoryRes.ok && Array.isArray(categoryData)) {
        setCategories(categoryData);
      }
      if (brandRes.ok && Array.isArray(brandData)) {
        setBrands(brandData);
      }
    } catch {
      // Keep UI usable even if metadata endpoint fails.
    }
  };

  useEffect(() => {
    loadProducts();
    loadMeta();
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

  const resetForm = () => {
    setEditingId(null);
    setForm(defaultForm);
  };

  const validateForm = () => {
    if (!form.name.trim()) return 'Tên sản phẩm không được để trống';
    if (!Number.isFinite(form.price) || form.price < 0) return 'Giá sản phẩm không hợp lệ';
    if (!Number.isInteger(form.stock) || form.stock < 0) return 'Tồn kho không hợp lệ';
    if (!form.image_url.trim()) return 'Ảnh sản phẩm không được để trống';
    return '';
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearFeedback();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const endpoint = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Không thể lưu sản phẩm');
      }

      setMessage(data?.message || (editingId ? 'Cập nhật sản phẩm thành công' : 'Tạo sản phẩm thành công'));
      resetForm();
      await loadProducts();
    } catch (err: any) {
      setError(err?.message || 'Không thể lưu sản phẩm');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product: ProductType) => {
    clearFeedback();
    setEditingId(product.id);
    setForm({
      name: product.name || '',
      price: Number(product.price || 0),
      stock: Number(product.stock || 0),
      image_url: (product as any).image_url || product.image || '',
      description: product.description || '',
      status: (product.status || 'active') as StatusType,
      category_id: product.category_id || null,
      brand_id: product.brand_id || null,
    });
  };

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
      if (editingId === id) {
        resetForm();
      }
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

      <div className="products-grid">
        <section className="products-panel">
          <div className="products-panel-header">
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
              {editingId ? 'Cập nhật' : 'Tạo sản phẩm'}
            </h3>
            {form.name ? (
              <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#64748b', wordBreak: 'break-word' }}>
                {form.name}
              </p>
            ) : null}
          </div>
          <form className="products-form" onSubmit={handleSubmit}>
            <input
              className="products-input"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Tên sản phẩm"
              disabled={submitting}
            />

            <div className="products-row">
              <input
                className="products-input"
                type="number"
                min={0}
                value={form.price}
                onChange={(event) => setForm((prev) => ({ ...prev, price: Number(event.target.value) }))}
                placeholder="Gia"
                disabled={submitting}
              />
              <input
                className="products-input"
                type="number"
                min={0}
                value={form.stock}
                onChange={(event) => setForm((prev) => ({ ...prev, stock: Number(event.target.value) }))}
                placeholder="Ton kho"
                disabled={submitting}
              />
            </div>

            <input
              className="products-input"
              value={form.image_url}
              onChange={(event) => setForm((prev) => ({ ...prev, image_url: event.target.value }))}
              placeholder="Link anh"
              disabled={submitting}
            />

            <div className="products-preview">
              <img
                src={form.image_url || 'https://via.placeholder.com/68x68?text=No+Img'}
                alt="preview"
                onError={(event) => {
                  const target = event.currentTarget;
                  target.src = 'https://via.placeholder.com/68x68?text=No+Img';
                }}
              />
              <p>{form.image_url ? 'Dang xem truoc anh theo URL' : 'Nhap URL de xem truoc anh'}</p>
            </div>

            <div className="products-row">
              <select
                className="products-select"
                value={form.category_id ?? ''}
                onChange={(event) => setForm((prev) => ({
                  ...prev,
                  category_id: event.target.value ? Number(event.target.value) : null,
                }))}
                disabled={submitting}
              >
                <option value="">Chon danh muc</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>

              <select
                className="products-select"
                value={form.brand_id ?? ''}
                onChange={(event) => setForm((prev) => ({
                  ...prev,
                  brand_id: event.target.value ? Number(event.target.value) : null,
                }))}
                disabled={submitting}
              >
                <option value="">Chon thuong hieu</option>
                {brands.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>

            <select
              className="products-select"
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as StatusType }))}
              disabled={submitting}
            >
              <option value="active">active</option>
              <option value="draft">draft</option>
              <option value="archived">archived</option>
            </select>

            <textarea
              className="products-textarea"
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Mo ta san pham"
              disabled={submitting}
            />

            <div className="products-actions-form">
              <button
                type="submit"
                className="products-btn products-btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Tạo mới'}
              </button>
              {editingId ? (
                <button
                  type="button"
                  className="products-btn products-btn-ghost"
                  onClick={resetForm}
                  disabled={submitting}
                >
                  Hủy
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="products-table-wrap">
          <div className="products-table-scroll">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Hinh</th>
                  <th>Ten san pham</th>
                  <th>Danh muc</th>
                  <th>Thuong hieu</th>
                  <th>Gia</th>
                  <th>Kho</th>
                  <th>Trang thai</th>
                  <th>Thao tac</th>
                </tr>
              </thead>
              <tbody>
                {loadingList ? (
                  <tr>
                    <td colSpan={8}>Dang tai du lieu...</td>
                  </tr>
                ) : pagedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={8}>Khong co san pham phu hop</td>
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
                          <button
                            type="button"
                            className="products-icon-btn"
                            onClick={() => handleEdit(product)}
                            disabled={submitting || deletingId === product.id}
                            title="Sua"
                          >
                            S
                          </button>
                          <button
                            type="button"
                            className="products-icon-btn products-btn-danger"
                            onClick={() => handleDelete(product.id)}
                            disabled={deletingId === product.id || submitting}
                            title="Xoa"
                          >
                            {deletingId === product.id ? '...' : 'X'}
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
              Trang {Math.min(currentPage, totalPages)} / {totalPages} - {filteredProducts.length} ket qua
            </span>
            <div className="products-pagination-controls">
              <button
                type="button"
                className="products-btn products-btn-ghost"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Truoc
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
