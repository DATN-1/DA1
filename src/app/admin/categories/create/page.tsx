'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/style/products.css';

type CategoryFormState = {
  name: string;
  slug: string;
  description: string;
  image: string;
};

const defaultForm: CategoryFormState = {
  name: '',
  slug: '',
  description: '',
  image: '',
};

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export default function CreateCategory() {
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CategoryFormState>(defaultForm);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const clearFeedback = () => {
    setMessage('');
    setError('');
  };

  const validateForm = () => {
    if (!form.name.trim()) return 'Tên danh mục không được để trống';
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
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Không thể lưu danh mục');
      }

      setMessage(data?.message || 'Tạo danh mục thành công');
      setForm(defaultForm);
      setTimeout(() => router.push('/admin/categories'), 1500);
    } catch (err: any) {
      setError(err?.message || 'Không thể lưu danh mục');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="content-padding products-admin">
      {message ? <div className="products-feedback products-feedback-success">{message}</div> : null}
      {error ? <div className="products-feedback products-feedback-error">{error}</div> : null}

      <div className="products-card" style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem', background: 'white', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Tạo danh mục mới</h2>
          <button
            type="button"
            onClick={() => router.push('/admin/categories')}
            className="products-btn products-btn-ghost"
          >
            Quay lại
          </button>
        </div>

        <form className="products-form" onSubmit={handleSubmit}>
          <input
            className="products-input"
            value={form.name}
            onChange={(event) => {
              const val = event.target.value;
              setForm((prev) => ({ ...prev, name: val, slug: toSlug(val) }));
            }}
            placeholder="Tên danh mục *"
            disabled={submitting}
          />

          <input
            className="products-input"
            value={form.slug}
            onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
            placeholder="Slug (vd: nen-thom)"
            disabled={submitting}
          />

          <input
            className="products-input"
            value={form.image}
            onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))}
            placeholder="URL hình ảnh (tùy chọn)"
            disabled={submitting}
          />

          <div className="products-preview">
            <img
              src={form.image || 'https://via.placeholder.com/68x68?text=No+Img'}
              alt="preview"
              onError={(event) => {
                const target = event.currentTarget as HTMLImageElement;
                target.src = 'https://via.placeholder.com/68x68?text=No+Img';
              }}
            />
            <p>{form.image ? 'Đang xem trước ảnh theo URL' : 'Nhập URL để xem trước ảnh'}</p>
          </div>

          <textarea
            className="products-textarea"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            placeholder="Mô tả danh mục (tùy chọn)"
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
              {submitting ? 'Đang lưu...' : 'Tạo danh mục'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
