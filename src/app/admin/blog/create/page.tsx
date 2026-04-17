'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/style/products.css';

type BlogFormState = {
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  image_url: string;
  author: string;
  status: 'published' | 'draft' | 'archived';
};

const defaultForm: BlogFormState = {
  title: '',
  slug: '',
  category: '',
  summary: '',
  content: '',
  image_url: '',
  author: 'Aromi Team',
  status: 'published',
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

export default function CreateBlog() {
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<BlogFormState>(defaultForm);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const clearFeedback = () => {
    setMessage('');
    setError('');
  };

  const validateForm = () => {
    if (!form.title.trim()) return 'Tiêu đề bài viết không được để trống';
    if (!form.slug.trim()) return 'Đường dẫn (slug) không được để trống';
    if (!form.category.trim()) return 'Chuyên mục không được để trống';
    if (!form.content.trim()) return 'Nội dung không được để trống';
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
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Không thể lưu bài viết');
      }

      setMessage(data?.message || 'Tạo bài viết thành công');
      setForm(defaultForm);
      setTimeout(() => router.push('/admin/blog'), 1500);
    } catch (err: any) {
      setError(err?.message || 'Không thể lưu bài viết');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="content-padding products-admin">
      {message ? <div className="products-feedback products-feedback-success">{message}</div> : null}
      {error ? <div className="products-feedback products-feedback-error">{error}</div> : null}

      <div className="products-card" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', background: 'white', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Viết bài mới</h2>
          <button
            type="button"
            onClick={() => router.push('/admin/blog')}
            className="products-btn products-btn-ghost"
          >
            Quay lại
          </button>
        </div>

        <form className="products-form" onSubmit={handleSubmit}>
          <input
            className="products-input"
            value={form.title}
            onChange={(event) => {
              const val = event.target.value;
              setForm((prev) => ({ ...prev, title: val, slug: toSlug(val) }));
            }}
            placeholder="Tiêu đề bài viết *"
            disabled={submitting}
          />

          <div className="products-row">
            <input
              className="products-input"
              value={form.slug}
              onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
              placeholder="Đường dẫn (slug) *"
              disabled={submitting}
            />
            <input
              className="products-input"
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              placeholder="Chuyên mục (vd: Thư giãn) *"
              disabled={submitting}
            />
          </div>

          <input
            className="products-input"
            value={form.image_url}
            onChange={(event) => setForm((prev) => ({ ...prev, image_url: event.target.value }))}
            placeholder="Link ảnh thu nhỏ (URL)"
            disabled={submitting}
          />

          {form.image_url && (
            <div className="products-preview">
              <img
                src={form.image_url}
                alt="preview"
                onError={(event) => {
                  const target = event.currentTarget as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/68x68?text=No+Img';
                }}
              />
              <p>Xem trước ảnh bìa</p>
            </div>
          )}

          <input
            className="products-input"
            value={form.author}
            onChange={(event) => setForm((prev) => ({ ...prev, author: event.target.value }))}
            placeholder="Tác giả"
            disabled={submitting}
          />

          <select
            className="products-select"
            value={form.status}
            onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as any }))}
            disabled={submitting}
          >
            <option value="published">Xuất bản (Hiển thị ngay)</option>
            <option value="draft">Bản nháp (Ẩn)</option>
            <option value="archived">Lưu trữ</option>
          </select>

          <textarea
            className="products-textarea"
            value={form.summary}
            onChange={(event) => setForm((prev) => ({ ...prev, summary: event.target.value }))}
            placeholder="Tóm tắt nội dung (Summary)"
            disabled={submitting}
            rows={3}
          />

          <textarea
            className="products-textarea"
            style={{ minHeight: '300px', fontFamily: 'monospace' }}
            value={form.content}
            onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
            placeholder="Nội dung bài viết (HTML/Markdown)... *"
            disabled={submitting}
            rows={10}
          />

          <div style={{ marginTop: '1rem' }}>
            <button
              type="submit"
              className="products-btn products-btn-primary"
              disabled={submitting}
              style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
            >
              {submitting ? 'Đang lưu...' : 'Xuất bản bài viết'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
