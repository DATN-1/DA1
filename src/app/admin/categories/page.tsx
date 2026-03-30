'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Category, CategoryForm } from '@/app/type/categoryType';
import '../products/products.css';



const defaultForm: CategoryForm = { name: '', slug: '', description: '', image: '' };

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CategoryForm>(defaultForm);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const clearFeedback = () => { setMessage(''); setError(''); };

  const loadCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Không thể tải danh mục');
      setCategories(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải danh mục');
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
      // Tự động gen slug khi chưa chỉnh sửa thủ công
      slug: editingId ? p.slug : toSlug(val),
    }));
  };

  const handleEdit = (cat: Category) => {
    clearFeedback();
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      slug: cat.slug || '',
      description: cat.description || '',
      image: cat.image || '',
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearFeedback();
    if (!form.name.trim()) { setError('Tên danh mục không được để trống'); return; }

    setSubmitting(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId
        ? { id: editingId, ...form }
        : form;

      const res = await fetch('/api/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Không thể lưu danh mục');
      setMessage(data?.message || (editingId ? 'Cập nhật thành công' : 'Thêm thành công'));
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
      const res = await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Không thể xóa danh mục');
      setMessage(data?.message || 'Xóa thành công');
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
      {error   ? <div className="products-feedback products-feedback-error">{error}</div>   : null}

      <div className="products-grid" style={{ gridTemplateColumns: '320px 1fr' }}>

        {/* ── Form thêm / sửa ── */}
        <section className="products-panel">
          <div className="products-panel-header">
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
              {editingId ? 'Cập nhật danh mục' : 'Thêm danh mục'}
            </h3>
            {form.name && (
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>{form.name}</p>
            )}
          </div>

          <form className="products-form" onSubmit={handleSubmit}>
            <input
              className="products-input"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Tên danh mục *"
              disabled={submitting}
            />

            <input
              className="products-input"
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              placeholder="Slug (vd: nen-thom)"
              disabled={submitting}
            />

            <input
              className="products-input"
              value={form.image}
              onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))}
              placeholder="URL hình ảnh (tùy chọn)"
              disabled={submitting}
            />

            {/* Preview ảnh */}
            <div className="products-preview">
              <img
                src={form.image || 'https://via.placeholder.com/60x60?text=Img'}
                alt="preview"
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/60x60?text=Img'; }}
              />
              <p>{form.image ? 'Xem trước hình ảnh' : 'Nhập URL để xem trước'}</p>
            </div>

            <textarea
              className="products-textarea"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Mô tả danh mục (tùy chọn)"
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

        {/* ── Bảng danh sách ── */}
        <section className="products-table-wrap">
          <div className="products-toolbar">
            <input
              className="products-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm danh mục..."
            />
            <span style={{ fontSize: 13, color: '#64748b', whiteSpace: 'nowrap' }}>
              {filtered.length} danh mục
            </span>
          </div>

          <div className="products-table-scroll">
            <table className="products-table" style={{ minWidth: 560 }}>
              <thead>
                <tr>
                  <th style={{ width: 60 }}>Hình ảnh</th>
                  <th>Tên danh mục</th>
                  <th>Slug</th>
                  <th>Mô tả</th>
                  <th style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>Đang tải dữ liệu...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>Không có danh mục nào</td></tr>
                ) : (
                  filtered.map((cat) => (
                    <tr key={cat.id}>
                      <td>
                        <img
                          className="products-thumb"
                          src={cat.image || 'https://via.placeholder.com/48x48?text=NA'}
                          alt={cat.name}
                          onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/48x48?text=NA'; }}
                        />
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{cat.name}</div>
                        <div style={{ color: '#64748b', fontSize: 12 }}>ID: #{cat.id}</div>
                      </td>
                      <td>
                        {cat.slug
                          ? <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>{cat.slug}</code>
                          : <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: 12 }}>Chưa có</span>
                        }
                      </td>
                      <td style={{ fontSize: 13, color: '#64748b', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {cat.description || <span style={{ fontStyle: 'italic' }}>Chưa có</span>}
                      </td>
                      <td>
                        <div className="products-actions" style={{ justifyContent: 'center' }}>
                          <button
                            type="button"
                            className="products-icon-btn"
                            onClick={() => handleEdit(cat)}
                            disabled={submitting || deletingId === cat.id}
                            title="Sửa"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            className="products-icon-btn products-btn-danger"
                            onClick={() => handleDelete(cat.id)}
                            disabled={deletingId === cat.id || submitting}
                            title="Xóa"
                          >
                            {deletingId === cat.id ? '...' : '🗑️'}
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
            <span>Tổng cộng {filtered.length} danh mục</span>
          </div>
        </section>
      </div>
    </div>
  );
}