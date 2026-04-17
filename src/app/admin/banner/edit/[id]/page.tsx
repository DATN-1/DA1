'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import '@/style/products.css';

type BannerFormState = {
  image_url: string;
  title: string;
  link_to: string;
  display_order: number;
  status: 'active' | 'inactive';
};

const defaultForm: BannerFormState = {
  image_url: '',
  title: '',
  link_to: '',
  display_order: 0,
  status: 'active',
};

export default function EditBanner() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<BannerFormState>(defaultForm);

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
      const response = await fetch(`/api/banners/${id}`);

      if (response.ok) {
        const banner = await response.json();
        setForm({
          image_url: banner.image_url || '',
          title: banner.title || '',
          link_to: banner.link_to || '',
          display_order: banner.display_order || 0,
          status: banner.status || 'active',
        });
      } else {
        const errData = await response.json();
        setError(errData?.error || 'Không thể tải thông tin banner');
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
    if (!form.image_url.trim()) return 'URL hình ảnh không được để trống';
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
      const response = await fetch('/api/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: Number(id), ...form }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Không thể cập nhật banner');
      }

      setMessage(data?.message || 'Cập nhật banner thành công');
      setTimeout(() => {
        router.push('/admin/banner');
      }, 1500);
    } catch (err: any) {
      setError(err?.message || 'Không thể cập nhật banner');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="content-padding products-admin">Đang tải thông tin banner...</div>;
  }

  return (
    <div className="content-padding products-admin">
      {message ? <div className="products-feedback products-feedback-success">{message}</div> : null}
      {error ? <div className="products-feedback products-feedback-error">{error}</div> : null}

      <div className="products-card" style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem', background: 'white', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Cập nhật Banner</h2>
          <button
            type="button"
            onClick={() => router.push('/admin/banner')}
            className="products-btn products-btn-ghost"
          >
            Quay lại
          </button>
        </div>

        <form className="products-form" onSubmit={handleSubmit}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 4 }}>Ảnh Banner (URL) *</label>
          <input
            className="products-input"
            value={form.image_url}
            onChange={(event) => setForm((prev) => ({ ...prev, image_url: event.target.value }))}
            placeholder="Link ảnh (https://...)"
            disabled={submitting}
            required
          />

          <label style={{ fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 4 }}>Tiêu đề</label>
          <input
            className="products-input"
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Tiêu đề banner"
            disabled={submitting}
          />

          <label style={{ fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 4 }}>Link trỏ tới</label>
          <input
            className="products-input"
            value={form.link_to}
            onChange={(event) => setForm((prev) => ({ ...prev, link_to: event.target.value }))}
            placeholder="/collections/sale"
            disabled={submitting}
          />

          <div className="products-row">
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 4 }}>Thứ tự ưu tiên</label>
              <input
                className="products-input"
                type="number"
                value={form.display_order}
                onChange={(event) => setForm((prev) => ({ ...prev, display_order: Number(event.target.value) }))}
                placeholder="0, 1, 2..."
                disabled={submitting}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 4 }}>Trạng thái</label>
              <select
                className="products-select"
                value={form.status}
                onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as any }))}
                disabled={submitting}
              >
                <option value="active">Hiển thị (Active)</option>
                <option value="inactive">Ẩn (Inactive)</option>
              </select>
            </div>
          </div>

          <div className="products-preview">
            <img
              src={form.image_url || 'https://via.placeholder.com/200x80?text=Banner'}
              alt="preview"
              onError={(event) => {
                const target = event.currentTarget as HTMLImageElement;
                target.src = 'https://via.placeholder.com/200x80?text=Banner';
              }}
              style={{ width: '100%', borderRadius: 8, objectFit: 'cover', height: '140px' }}
            />
            <p>{form.image_url ? 'Xem trước Banner' : 'Nhập URL để xem trước'}</p>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button
              type="submit"
              className="products-btn products-btn-primary"
              disabled={submitting}
              style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
            >
              {submitting ? 'Đang cập nhật...' : 'Cập nhật banner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
