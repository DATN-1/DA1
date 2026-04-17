'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Banner } from '@/app/type/BannerType';
import '@/style/products.css';

export default function BannerPage() {
  const router = useRouter();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
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
      
      setMessage('Xóa banner thành công!');
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

      <div className="products-table-wrap">
        <div className="products-toolbar">
          <input
            className="products-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm tiêu đề banner..."
          />
          <button
            type="button"
            className="products-btn products-btn-primary"
            onClick={() => router.push('/admin/banner/create')}
          >
            + Thêm banner mới
          </button>
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
                          onClick={() => router.push(`/admin/banner/edit/${banner.id}`)}
                          title="Sửa"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          className="products-icon-btn products-btn-danger"
                          onClick={() => handleDelete(banner.id)}
                          disabled={deletingId === banner.id}
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
          <span>Tổng cộng {filtered.length} banner</span>
        </div>
      </div>
    </div>
  );
}