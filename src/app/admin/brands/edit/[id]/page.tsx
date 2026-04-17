'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import '@/style/products.css';

type BrandFormState = {
  name: string;
  logo_url: string;
};

const defaultForm: BrandFormState = {
  name: '',
  logo_url: '',
};

export default function EditBrand() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<BrandFormState>(defaultForm);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const clearFeedback = () => {
    setMessage('');
    setError('');
  };

  const loadData = async () => {
    if (!id) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/brands/${id}`);

      if (response.ok) {
        const brand = await response.json();
        setForm({
          name: brand.name || '',
          logo_url: brand.logo_url || '',
        });
      } else {
        const errData = await response.json();
        setError(errData?.error || 'Không thể tải thông tin thương hiệu');
      }
    } catch {
      setError('Lỗi hệ thống khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const validateForm = () => {
    if (!form.name.trim()) return 'Tên thương hiệu không được để trống';
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
      const response = await fetch('/api/brands', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: Number(id), ...form }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Không thể cập nhật thương hiệu');
      }

      setMessage(data?.message || 'Cập nhật thương hiệu thành công');
      setTimeout(() => {
        router.push('/admin/brands');
      }, 1500);
    } catch (err: any) {
      setError(err?.message || 'Không thể cập nhật thương hiệu');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="content-padding products-admin">Đang tải thông tin thương hiệu...</div>;
  }

  return (
    <div className="content-padding products-admin">
      {message ? <div className="products-feedback products-feedback-success">{message}</div> : null}
      {error ? <div className="products-feedback products-feedback-error">{error}</div> : null}

      <div className="products-card" style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem', background: 'white', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Cập nhật thương hiệu</h2>
          <button
            type="button"
            onClick={() => router.push('/admin/brands')}
            className="products-btn products-btn-ghost"
          >
            Quay lại
          </button>
        </div>

        <form className="products-form" onSubmit={handleSubmit}>
          <input
            className="products-input"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Tên thương hiệu *"
            disabled={submitting}
          />

          <input
            className="products-input"
            value={form.logo_url}
            onChange={(event) => setForm((prev) => ({ ...prev, logo_url: event.target.value }))}
            placeholder="URL logo (tùy chọn)"
            disabled={submitting}
          />

          <div className="products-preview">
            <img
              src={form.logo_url || 'https://via.placeholder.com/68x68?text=No+Img'}
              alt="preview"
              onError={(event) => {
                const target = event.currentTarget as HTMLImageElement;
                target.src = 'https://via.placeholder.com/68x68?text=No+Img';
              }}
            />
            <p>{form.logo_url ? 'Đang xem trước logo theo URL' : 'Nhập URL để xem trước logo'}</p>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button
              type="submit"
              className="products-btn products-btn-primary"
              disabled={submitting}
              style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
            >
              {submitting ? 'Đang cập nhật...' : 'Cập nhật thương hiệu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
