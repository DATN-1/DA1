'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Banner, BannerForm } from '@/app/type/BannerType';
import '../products/products.css';

const defaultForm: BannerForm = {
  image_url: '',
  title: '',
  link_to: '',
  display_order: 0,
  status: 'active',
};

export default function BannerPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const [form, setForm] = useState<BannerForm>(defaultForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  const clearFeedback = () => { setError(''); setMessage(''); };

  const loadBanners = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/banners');
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Không thể tải ds banner');
      setBanners(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || 'Lỗi kết nối khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBanners(); }, []);

  const resetForm = () => { setEditingId(null); setForm(defaultForm); };

  const handleEdit = (banner: Banner) => {
    clearFeedback();
    setEditingId(banner.id);
    setForm({
      image_url: banner.image_url,
      title: banner.title || '',
      link_to: banner.link_to || '',
      display_order: banner.display_order,
      status: banner.status,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearFeedback();
    
    setSubmitting(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { id: editingId, ...form } : form;
      
      const res = await fetch('/api/banners', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Lỗi khi lưu banner');
      
      setMessage(editingId ? 'Cập nhật thành công!' : 'Thêm banner thành công!');
      resetForm();
      await loadBanners();
    } catch (err: any) {
      setError(err?.message || 'Không thể lưu banner');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa Banner này? Hành động này không thể hoàn tác.')) return;
    
    clearFeedback();
    setDeletingId(id);
    try {
      const res = await fetch('/api/banners', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Không thể xóa banner');
      
      setMessage('Xóa thành công!');
      if (editingId === id) resetForm();
      await loadBanners();
    } catch (err: any) {
      setError(err?.message || 'Lỗi xóa banner');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = banners.filter((b) =>
    (b.title?.toLowerCase() || '').includes(searchTerm.toLowerCase())
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
              {editingId ? 'Cập nhật Banner' : 'Thêm Banner Mới'}
            </h3>
            {form.title && (
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>{form.title}</p>
            )}
          </div>

          <form className="products-form" onSubmit={handleSubmit}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Ảnh Banner (URL) *</label>
            <input
              className="products-input"
              value={form.image_url}
              onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))}
              placeholder="https://... *"
              disabled={submitting}
              required
            />

            <label style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Tiêu đề</label>
            <input
              className="products-input"
              value={form.title || ''}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Tiêu đề banner"
              disabled={submitting}
            />

            <label style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Link trỏ tới</label>
            <input
              className="products-input"
              value={form.link_to || ''}
              onChange={(e) => setForm((p) => ({ ...p, link_to: e.target.value }))}
              placeholder="/collections/sale"
              disabled={submitting}
            />

            <label style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Thứ tự ưu tiên</label>
            <input
              className="products-input"
              type="number"
              value={form.display_order}
              onChange={(e) => setForm((p) => ({ ...p, display_order: Number(e.target.value) }))}
              placeholder="0, 1, 2..."
              disabled={submitting}
            />

            <label style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Trạng thái</label>
            <select
              className="products-input"
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as 'active' | 'inactive' }))}
              disabled={submitting}
            >
              <option value="active">Hiển thị (Active)</option>
              <option value="inactive">Ẩn (Inactive)</option>
            </select>

            {/* Preview ảnh */}
            <div className="products-preview">
              <img
                src={form.image_url || 'https://via.placeholder.com/200x80?text=Banner'}
                alt="preview"
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/200x80?text=Banner'; }}
                style={{ width: '100%', borderRadius: 8, objectFit: 'cover' }}
              />
              <p>{form.image_url ? 'Xem trước Banner' : 'Nhập URL để xem trước'}</p>
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
          <div className="products-toolbar">
            <input
              className="products-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm tiêu đề banner..."
            />
            <span style={{ fontSize: 13, color: '#64748b', whiteSpace: 'nowrap' }}>
              {filtered.length} banner
            </span>
          </div>

          <div className="products-table-scroll">
            <table className="products-table" style={{ minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={{ width: 100 }}>Hình ảnh</th>
                  <th>Tiêu đề / Link</th>
                  <th style={{ textAlign: 'center' }}>Thứ tự</th>
                  <th style={{ textAlign: 'center' }}>Trạng thái</th>
                  <th style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>Đang tải dữ liệu...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>Không có Banner nào</td></tr>
                ) : (
                  filtered.map((banner) => (
                    <tr key={banner.id}>
                      <td>
                        <img
                          className="products-thumb"
                          src={banner.image_url || 'https://via.placeholder.com/100x40?text=Banner'}
                          alt={banner.title || 'Banner'}
                          style={{ width: 80, height: 'auto', borderRadius: 4, objectFit: 'cover' }}
                          onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/100x40?text=Banner'; }}
                        />
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#111827' }}>{banner.title || <span style={{ color: '#aaa', fontStyle: 'italic' }}>Không có tiêu đề</span>}</div>
                        <div style={{ color: '#2563eb', fontSize: 12, marginTop: 4 }}>{banner.link_to || '-'}</div>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 600, color: '#64748b' }}>
                        {banner.display_order}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                         <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: 12, 
                            fontSize: 12, 
                            fontWeight: 600,
                            backgroundColor: banner.status === 'active' ? '#dcfce7' : '#f1f5f9',
                            color: banner.status === 'active' ? '#166534' : '#475569'
                          }}>
                           {banner.status === 'active' ? 'Hiển thị' : 'Ẩn'}
                         </span>
                      </td>
                      <td>
                        <div className="products-actions" style={{ justifyContent: 'center' }}>
                          <button
                            type="button"
                            className="products-icon-btn"
                            onClick={() => handleEdit(banner)}
                            disabled={submitting || deletingId === banner.id}
                            title="Sửa"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            className="products-icon-btn products-btn-danger"
                            onClick={() => handleDelete(banner.id)}
                            disabled={deletingId === banner.id || submitting}
                            title="Xóa"
                          >
                            {deletingId === banner.id ? '...' : '🗑️'}
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
            <span>Hiển thị tất cả {filtered.length} banner</span>
          </div>
        </section>
      </div>
    </div>
  );
}