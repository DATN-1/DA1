'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

export default function EditBlog() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<BlogFormState>(defaultForm);

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
      const response = await fetch(`/api/blogs/${id}`);

      if (response.ok) {
        const blog = await response.json();
        setForm({
          title: blog.title || '',
          slug: blog.slug || '',
          category: blog.category || '',
          summary: blog.summary || '',
          content: blog.content || '',
          image_url: blog.image_url || '',
          author: blog.author || 'Aromi Team',
          status: blog.status || 'published',
        });
      } else {
        const errData = await response.json();
        setError(errData?.error || 'Không thể tải thông tin bài viết');
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
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: Number(id), ...form }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Không thể cập nhật bài viết');
      }

      setMessage(data?.message || 'Cập nhật bài viết thành công');
      setTimeout(() => {
        router.push('/admin/blog');
      }, 1500);
    } catch (err: any) {
      setError(err?.message || 'Không thể cập nhật bài viết');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="content-padding products-admin">Đang tải thông tin bài viết...</div>;
  }

  return (
    <div className="content-padding products-admin">
      {message ? <div className="products-feedback products-feedback-success">{message}</div> : null}
      {error ? <div className="products-feedback products-feedback-error">{error}</div> : null}

      <div className="products-card" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', background: 'white', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Chỉnh sửa bài viết</h2>
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
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
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
              {submitting ? 'Đang cập nhật...' : 'Cập nhật bài viết'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
