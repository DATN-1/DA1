'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Brand, BrandForm } from '@/app/type/brandType';
import '../products/products.css';



const defaultForm: BrandForm = { name: '', logo_url: '' };

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<BrandForm>(defaultForm);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const clearFeedback = () => { setMessage(''); setError(''); };

  const loadBrands = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/brands');
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Không thể tải thương hiệu');
      setBrands(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải thương hiệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBrands(); }, []);

  const resetForm = () => { setEditingId(null); setForm(defaultForm); };

  const handleEdit = (brand: Brand) => {
    clearFeedback();
    setEditingId(brand.id);
    setForm({ name: brand.name, logo_url: brand.logo_url || '' });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearFeedback();
    if (!form.name.trim()) { setError('Tên thương hiệu không được để trống'); return; }
    setSubmitting(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { id: editingId, ...form } : form;
      const res = await fetch('/api/brands', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Không thể lưu thương hiệu');
      setMessage(data?.message || (editingId ? 'Cập nhật thành công' : 'Thêm thành công'));
      resetForm();
      await loadBrands();
    } catch (err: any) {
      setError(err?.message || 'Không thể lưu thương hiệu');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa thương hiệu này?')) return;
    clearFeedback();
    setDeletingId(id);
    try {
      const res = await fetch('/api/brands', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Không thể xóa thương hiệu');
      setMessage(data?.message || 'Xóa thành công');
      if (editingId === id) resetForm();
      await loadBrands();
    } catch (err: any) {
      setError(err?.message || 'Không thể xóa thương hiệu');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="content-padding products-admin">
      {message ? <div className="products-feedback products-feedback-success">{message}</div> : null}
      {error   ? <div className="products-feedback products-feedback-error">{error}</div>   : null}

      <div className="products-grid" style={{ gridTemplateColumns: '300px 1fr' }}>

        {/* ── Form thêm / sửa ── */}
        <section className="products-panel">
          <div className="products-panel-header">
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
              {editingId ? 'Cập nhật thương hiệu' : 'Thêm thương hiệu'}
            </h3>
            {form.name && (
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>{form.name}</p>
            )}
          </div>

          <form className="products-form" onSubmit={handleSubmit}>
            <input
              className="products-input"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Tên thương hiệu *"
              disabled={submitting}
            />

            <input
              className="products-input"
              value={form.logo_url}
              onChange={(e) => setForm((p) => ({ ...p, logo_url: e.target.value }))}
              placeholder="URL logo (tùy chọn)"
              disabled={submitting}
            />

            {/* Preview logo */}
            <div className="products-preview">
              <img
                src={form.logo_url || 'https://via.placeholder.com/60x60?text=Logo'}
                alt="preview"
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/60x60?text=Logo'; }}
              />
              <p>{form.logo_url ? 'Xem trước logo' : 'Nhập URL để xem trước logo'}</p>
            </div>

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
          {/* Toolbar tìm kiếm */}
          <div className="products-toolbar">
            <input
              className="products-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm thương hiệu..."
            />
            <span style={{ fontSize: 13, color: '#64748b', whiteSpace: 'nowrap' }}>
              {filtered.length} thương hiệu
            </span>
          </div>

          <div className="products-table-scroll">
            <table className="products-table" style={{ minWidth: 500 }}>
              <thead>
                <tr>
                  <th style={{ width: 60 }}>Logo</th>
                  <th>Tên thương hiệu</th>
                  <th>URL Logo</th>
                  <th style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>Đang tải dữ liệu...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>Không có thương hiệu nào</td></tr>
                ) : (
                  filtered.map((brand) => (
                    <tr key={brand.id}>
                      <td>
                        <img
                          className="products-thumb"
                          src={brand.logo_url || 'https://via.placeholder.com/48x48?text=NA'}
                          alt={brand.name}
                          onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/48x48?text=NA'; }}
                        />
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{brand.name}</div>
                        <div style={{ color: '#64748b', fontSize: 12 }}>ID: #{brand.id}</div>
                      </td>
                      <td style={{ fontSize: 12, color: '#64748b', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {brand.logo_url || <span style={{ fontStyle: 'italic' }}>Chưa có</span>}
                      </td>
                      <td>
                        <div className="products-actions" style={{ justifyContent: 'center' }}>
                          <button
                            type="button"
                            className="products-icon-btn"
                            onClick={() => handleEdit(brand)}
                            disabled={submitting || deletingId === brand.id}
                            title="Sửa"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            className="products-icon-btn products-btn-danger"
                            onClick={() => handleDelete(brand.id)}
                            disabled={deletingId === brand.id || submitting}
                            title="Xóa"
                          >
                            {deletingId === brand.id ? '...' : '🗑️'}
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
            <span>Tổng cộng {filtered.length} thương hiệu</span>
          </div>
        </section>
      </div>
    </div>
  );
}