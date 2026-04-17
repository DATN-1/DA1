'use client';

import { FormEvent, useEffect, useState } from 'react';
import '../products.css';

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

export default function CreateProduct() {
  const [categories, setCategories] = useState<OptionType[]>([]);
  const [brands, setBrands] = useState<OptionType[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<ProductFormState>(defaultForm);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const clearFeedback = () => {
    setMessage('');
    setError('');
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
      // Ignore meta load errors
    }
  };

  useEffect(() => {
    loadMeta();
  }, []);

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
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Không thể lưu sản phẩm');
      }

      setMessage(data?.message || 'Tạo sản phẩm thành công');
      setForm(defaultForm);
    } catch (err: any) {
      setError(err?.message || 'Không thể lưu sản phẩm');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="content-padding products-admin">
      {message ? <div className="products-feedback products-feedback-success">{message}</div> : null}
      {error ? <div className="products-feedback products-feedback-error">{error}</div> : null}

      <div className="products-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', background: 'white', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700, color: '#1a1a1a' }}>Tạo sản phẩm mới</h2>
        
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
              placeholder="Giá"
              disabled={submitting}
            />
            <input
              className="products-input"
              type="number"
              min={0}
              value={form.stock}
              onChange={(event) => setForm((prev) => ({ ...prev, stock: Number(event.target.value) }))}
              placeholder="Tồn kho"
              disabled={submitting}
            />
          </div>

          <input
            className="products-input"
            value={form.image_url}
            onChange={(event) => setForm((prev) => ({ ...prev, image_url: event.target.value }))}
            placeholder="Link ảnh"
            disabled={submitting}
          />

          <div className="products-preview">
            <img
              src={form.image_url || 'https://via.placeholder.com/68x68?text=No+Img'}
              alt="preview"
              onError={(event) => {
                const target = event.currentTarget as HTMLImageElement;
                target.src = 'https://via.placeholder.com/68x68?text=No+Img';
              }}
            />
            <p>{form.image_url ? 'Đang xem trước ảnh theo URL' : 'Nhập URL để xem trước ảnh'}</p>
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
              <option value="">Chọn danh mục</option>
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
              <option value="">Chọn thương hiệu</option>
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
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          <textarea
            className="products-textarea"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            placeholder="Mô tả sản phẩm"
            disabled={submitting}
            rows={5}
          />

          <div style={{ marginTop: '1rem' }}>
            <button
              type="submit"
              className="products-btn products-btn-primary"
              disabled={submitting}
              style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
            >
              {submitting ? 'Đang lưu...' : 'Tạo sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}