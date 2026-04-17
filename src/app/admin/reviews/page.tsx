'use client';

import { useEffect, useState } from 'react';
import { Review } from '@/app/models/review.model';
import '../products/products.css';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const clearFeedback = () => { setMessage(''); setError(''); };

  const loadReviews = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Không thể tải đánh giá');
      setReviews(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải đánh giá');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReviews(); }, []);

  const handleUpdateStatus = async (id: number, currentStatus: string) => {
    clearFeedback();
    setSubmittingId(id);
    try {
      const newStatus = currentStatus === 'approved' ? 'pending' : 'approved';
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Không thể cập nhật trạng thái');
      setMessage('Cập nhật thành công');
      await loadReviews();
    } catch (err: any) {
      setError(err?.message || 'Không thể cập nhật trạng thái');
    } finally {
      setSubmittingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa đánh giá này?')) return;
    clearFeedback();
    setSubmittingId(id);
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Không thể xóa đánh giá');
      setMessage('Xóa đánh giá thành công');
      await loadReviews();
    } catch (err: any) {
      setError(err?.message || 'Không thể xóa đánh giá');
    } finally {
      setSubmittingId(null);
    }
  };

  const filtered = reviews.filter((r) =>
    (r.comment || '').toLowerCase().includes(search.trim().toLowerCase()) ||
    (r.user_name || '').toLowerCase().includes(search.trim().toLowerCase()) ||
    (r.product_name || '').toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="content-padding products-admin">
      {message ? <div className="products-feedback products-feedback-success">{message}</div> : null}
      {error   ? <div className="products-feedback products-feedback-error">{error}</div>   : null}

      <div className="products-grid" style={{ gridTemplateColumns: '1fr' }}>
        <section className="products-table-wrap">
          <div className="products-toolbar">
            <input
              className="products-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo bình luận, tên..."
            />
            <span style={{ fontSize: 13, color: '#64748b', whiteSpace: 'nowrap' }}>
              {filtered.length} đánh giá
            </span>
          </div>

          <div className="products-table-scroll">
            <table className="products-table" style={{ minWidth: 800 }}>
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Sản phẩm</th>
                  <th>Đánh giá</th>
                  <th>Nội dung</th>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>Đang tải dữ liệu...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>Không có đánh giá nào</td></tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{r.user_name || `User ID: ${r.user_id}`}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>
                          {r.created_at ? new Date(r.created_at).toLocaleDateString('vi-VN') : ''}
                        </div>
                      </td>
                      <td style={{ maxWidth: 200 }}>
                        <div style={{ whiteSpace: 'normal', fontSize: 13 }}>{r.product_name || `Product ID: ${r.product_id}`}</div>
                      </td>
                      <td>
                        <span style={{ color: '#fbbf24', fontSize: 14 }}>
                          {'⭐'.repeat(Number(r.rating) || 0)}
                        </span>
                      </td>
                      <td style={{ maxWidth: 250 }}>
                        <div style={{ whiteSpace: 'normal', fontSize: 13 }}>{r.comment}</div>
                      </td>
                      <td>
                        <span style={{ 
                          padding: '2px 8px', borderRadius: 12, fontSize: 12, cursor: 'pointer',
                          background: r.status === 'approved' ? '#dcfce7' : '#fef3c7',
                          color: r.status === 'approved' ? '#16a34a' : '#d97706'
                        }} onClick={() => handleUpdateStatus(r.id, r.status)}>
                          {r.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                        </span>
                      </td>
                      <td>
                        <div className="products-actions" style={{ justifyContent: 'center' }}>
                          <button
                            type="button"
                            className="products-icon-btn products-btn-danger"
                            onClick={() => handleDelete(r.id)}
                            disabled={submittingId === r.id}
                            title="Xóa"
                          >
                            {submittingId === r.id ? '...' : '🗑️'}
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
