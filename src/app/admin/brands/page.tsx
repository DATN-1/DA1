'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brand } from '@/app/type/brandType';
import '@/style/products.css';

export default function BrandsPage() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
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

      <div className="products-table-wrap">
        <div className="products-toolbar">
          <input
            className="products-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm thương hiệu..."
          />
          <button
            type="button"
            className="products-btn products-btn-primary"
            onClick={() => router.push('/admin/brands/create')}
          >
            + Thêm thương hiệu
          </button>
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
                          onClick={() => router.push(`/admin/brands/edit/${brand.id}`)}
                          disabled={deletingId === brand.id}
                          title="Sửa"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          className="products-icon-btn products-btn-danger"
                          onClick={() => handleDelete(brand.id)}
                          disabled={deletingId === brand.id}
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
      </div>
    </div>
  );
}