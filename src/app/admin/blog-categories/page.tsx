'use client';

import { FormEvent, useEffect, useState } from 'react';
import { BlogCategory } from '@/app/models/blog_category.model';
import '../products/products.css';

const defaultForm: Partial<BlogCategory> = { name: '', slug: '', description: '', status: 'active' };

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export default function BlogCategoriesPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<BlogCategory>>(defaultForm);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const clearFeedback = () => { setMessage(''); setError(''); };

  const loadCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/blog-categories');
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Không thể tải danh mục bài viết');
      setCategories(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh mục bài viết');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCategories(); }, []);

  const resetForm = () => { setEditingId(null); setForm(defaultForm); };

  const handleNameChange = (val: string) => {
    setForm((p) => ({
      ...p,
      name: val,
      slug: editingId ? p.slug : toSlug(val),
    }));
  };

  const handleEdit = (cat: BlogCategory) => {
    clearFeedback();
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      slug: cat.slug || '',
      description: cat.description || '',
      status: cat.status
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearFeedback();
    if (!form.name?.trim()) { setError('Tên danh mục không được để trống'); return; }

    setSubmitting(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/blog-categories/${editingId}` : '/api/blog-categories';
      const body = { ...form };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Không thể lưu danh mục');
      setMessage(editingId ? 'Cập nhật thành công' : 'Thêm thành công');
      resetForm();
      await loadCategories();
    } catch (err: any) {
      setError(err?.message || 'Không thể lưu danh mục');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa danh mục này?')) return;
    clearFeedback();
    setDeletingId(id);
    try {
      const res = await fetch(`/api/blog-categories/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Không thể xóa danh mục');
      setMessage('Xóa thành công');
      if (editingId === id) resetForm();
      await loadCategories();
    } catch (err: any) {
      setError(err?.message || 'Không thể xóa danh mục');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="content-padding products-admin">
      {message ? <div className="products-feedback products-feedback-success">{message}</div> : null}
      {error ? <div className="products-feedback products-feedback-error">{error}</div> : null}

      <div className="products-grid" style={{ gridTemplateColumns: '320px 1fr' }}>
        <section className="products-panel">
          <div className="products-panel-header">
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
              {editingId ? 'Cập nhật danh mục' : 'Thêm danh mục bài viết'}
            </h3>
          </div>

          <form className="products-form" onSubmit={handleSubmit}>
            <input
              className="products-input"
              value={form.name || ''}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Tên danh mục *"
              disabled={submitting}
            />

            <input
              className="products-input"
              value={form.slug || ''}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              placeholder="Slug (vd: kien-thuc)"
              disabled={submitting}
            />

            <select
              className="products-input"
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as any }))}
              disabled={submitting}
            >
              <option value="active">Hiển thị</option>
              <option value="inactive">Ẩn</option>
            </select>

            <textarea
              className="products-textarea"
              value={form.description || ''}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Mô tả..."
              disabled={submitting}
            />

            <div className="products-actions-form">
              <button type="submit" className="products-btn products-btn-primary" disabled={submitting}>
                {submitting ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Thêm mới'}
              </button>
              {editingId && (
                <button type="button" className="products-btn products-btn-ghost" onClick={resetForm} disabled={submitting}>
                  Hủy
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="products-table-wrap">
          <div className="products-toolbar">
            <input
              className="products-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm danh mục..."
            />
            <span style={{ fontSize: 13, color: '#64748b', whiteSpace: 'nowrap' }}>
              {filtered.length} danh mục
            </span>
          </div>

          <div className="products-table-scroll">
            <table className="products-table" style={{ minWidth: 500 }}>
              <thead>
                <tr>
                  <th>Tên danh mục</th>
                  <th>Slug</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>Đang tải dữ liệu...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>Không có danh mục nào</td></tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div style={{ fontWeight: 700 }}>{c.name}</div>
                      </td>
                      <td>
                        <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>{c.slug}</code>
                      </td>
                      <td>
                        <span style={{
                          padding: '2px 8px', borderRadius: 12, fontSize: 12,
                          background: c.status === 'active' ? '#dcfce7' : '#f1f5f9',
                          color: c.status === 'active' ? '#16a34a' : '#64748b'
                        }}>
                          {c.status === 'active' ? 'Hiển thị' : 'Ẩn'}
                        </span>
                      </td>
                      <td>
                        <div className="products-actions" style={{ justifyContent: 'center' }}>
                          <button
                            type="button"
                            className="products-icon-btn"
                            onClick={() => handleEdit(c)}
                            disabled={submitting || deletingId === c.id}
                            title="Sửa"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            className="products-icon-btn products-btn-danger"
                            onClick={() => handleDelete(c.id)}
                            disabled={deletingId === c.id || submitting}
                            title="Xóa"
                          >
                            {deletingId === c.id ? '...' : '🗑️'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
