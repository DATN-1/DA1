'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/app/type/categoryType';
import '@/style/products.css';

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
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

      <div className="products-table-wrap">
        <div className="products-toolbar">
          <input
            className="products-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm danh mục..."
          />
          <button
            type="button"
            className="products-btn products-btn-primary"
            onClick={() => router.push('/admin/categories/create')}
          >
            + Thêm danh mục
          </button>
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
                          onClick={() => router.push(`/admin/categories/edit/${cat.id}`)}
                          disabled={deletingId === cat.id}
                          title="Sửa"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          className="products-icon-btn products-btn-danger"
                          onClick={() => handleDelete(cat.id)}
                          disabled={deletingId === cat.id}
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
      </div>
    </div>
  );
}