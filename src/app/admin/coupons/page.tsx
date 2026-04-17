'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Coupon } from '@/app/models/coupon.model';
import '../products/products.css';

const defaultForm: Partial<Coupon> = { 
  code: '', 
  description: '', 
  discount_type: 'percentage', 
  discount_value: 0, 
  start_date: '', 
  end_date: '', 
  usage_limit: 0, 
  min_order_value: 0,
  status: 'active'
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Coupon>>(defaultForm);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const clearFeedback = () => { setMessage(''); setError(''); };

  const loadCoupons = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/coupons');
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Không thể tải mã giảm giá');
      setCoupons(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải mã giảm giá');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCoupons(); }, []);

  const resetForm = () => { setEditingId(null); setForm(defaultForm); };

  const handleEdit = (c: Coupon) => {
    clearFeedback();
    setEditingId(c.id);
    
    let safeStartDate = '';
    let safeEndDate = '';
    try {
      if (c.start_date) safeStartDate = new Date(c.start_date).toISOString().slice(0, 16);
    } catch(e) {}
    try {
      if (c.end_date) safeEndDate = new Date(c.end_date).toISOString().slice(0, 16);
    } catch(e) {}

    setForm({
      code: c.code,
      description: c.description || '',
      discount_type: c.discount_type,
      discount_value: c.discount_value,
      start_date: safeStartDate,
      end_date: safeEndDate,
      usage_limit: c.usage_limit || 0,
      min_order_value: c.min_order_value || 0,
      status: c.status
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearFeedback();
    if (!form.code?.trim()) { setError('Mã code không được để trống'); return; }

    setSubmitting(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/coupons/${editingId}` : '/api/coupons';
      const body = { ...form };
      if (!body.usage_limit) body.usage_limit = null;
      if (!body.min_order_value) body.min_order_value = null;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Không thể lưu mã giảm giá');
      setMessage(editingId ? 'Cập nhật thành công' : 'Thêm thành công');
      resetForm();
      await loadCoupons();
    } catch (err: any) {
      setError(err?.message || 'Không thể lưu mã giảm giá');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa mã giảm giá này?')) return;
    clearFeedback();
    setDeletingId(id);
    try {
      const res = await fetch(`/api/coupons/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Không thể xóa mã');
      setMessage('Xóa thành công');
      if (editingId === id) resetForm();
      await loadCoupons();
    } catch (err: any) {
      setError(err?.message || 'Không thể xóa mã');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = coupons.filter((c) =>
    c.code.toLowerCase().includes(search.trim().toLowerCase())
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
              {editingId ? 'Cập nhật mã giảm giá' : 'Thêm mã code'}
            </h3>
          </div>

          <form className="products-form" onSubmit={handleSubmit}>
            <input
              className="products-input"
              value={form.code || ''}
              onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
              placeholder="Mã Code (vd: SUMMER24) *"
              disabled={submitting}
            />

            <select
              className="products-input"
              value={form.discount_type}
              onChange={(e) => setForm((p) => ({ ...p, discount_type: e.target.value as any }))}
              disabled={submitting}
            >
              <option value="percentage">Phần trăm (%)</option>
              <option value="fixed_amount">Số tiền cố định</option>
            </select>

            <input
              className="products-input"
              type="number"
              value={form.discount_value || ''}
              onChange={(e) => setForm((p) => ({ ...p, discount_value: Number(e.target.value) }))}
              placeholder="Giá trị giảm *"
              disabled={submitting}
            />

            <input
              className="products-input"
              type="datetime-local"
              value={form.start_date as string}
              onChange={(e) => setForm((p) => ({ ...p, start_date: e.target.value }))}
              disabled={submitting}
            />

            <input
              className="products-input"
              type="datetime-local"
              value={form.end_date as string}
              onChange={(e) => setForm((p) => ({ ...p, end_date: e.target.value }))}
              disabled={submitting}
            />

            <input
              className="products-input"
              type="number"
              value={form.min_order_value || ''}
              onChange={(e) => setForm((p) => ({ ...p, min_order_value: Number(e.target.value) }))}
              placeholder="Giá trị đơn tối thiểu (Tùy chọn)"
              disabled={submitting}
            />

            <input
              className="products-input"
              type="number"
              value={form.usage_limit || ''}
              onChange={(e) => setForm((p) => ({ ...p, usage_limit: Number(e.target.value) }))}
              placeholder="Giới hạn sử dụng (Tùy chọn)"
              disabled={submitting}
            />

            <select
              className="products-input"
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as any }))}
              disabled={submitting}
            >
              <option value="active">Kích hoạt</option>
              <option value="expired">Hết hạn</option>
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

        {/* ── Bảng danh sách ── */}
        <section className="products-table-wrap">
          <div className="products-toolbar">
            <input
              className="products-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm mã code..."
            />
            <span style={{ fontSize: 13, color: '#64748b', whiteSpace: 'nowrap' }}>
              {filtered.length} mã
            </span>
          </div>

          <div className="products-table-scroll">
            <table className="products-table" style={{ minWidth: 600 }}>
              <thead>
                <tr>
                  <th>Mã code</th>
                  <th>Giảm giá</th>
                  <th>Hạn sử dụng</th>
                  <th>Lượt SD</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>Đang tải dữ liệu...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>Không có mã giảm giá nào</td></tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div style={{ fontWeight: 700 }}>{c.code}</div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 'bold', color: '#e11d48' }}>
                          {c.discount_type === 'percentage' ? `${c.discount_value}%` : `${Number(c.discount_value).toLocaleString('vi-VN')}đ`}
                        </span>
                      </td>
                      <td style={{ fontSize: 13 }}>
                        {new Date(c.end_date).toLocaleDateString('vi-VN')}
                      </td>
                      <td style={{ fontSize: 13 }}>
                        {c.usage_count} {c.usage_limit ? `/ ${c.usage_limit}` : ''}
                      </td>
                      <td>
                        <span style={{ 
                          padding: '2px 8px', borderRadius: 12, fontSize: 12,
                          background: c.status === 'active' ? '#dcfce7' : '#f1f5f9',
                          color: c.status === 'active' ? '#16a34a' : '#64748b'
                        }}>
                          {c.status === 'active' ? 'Còn hiệu lực' : 'Hết hạn'}
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
