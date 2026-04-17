'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Blog } from '@/app/type/BlogType';
import '@/style/products.css';

export default function BlogAdminPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const clearFeedback = () => { setMessage(''); setError(''); };

  const loadBlogs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/blogs');
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Không thể tải bài viết');
      setBlogs(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || 'Không thể tải bài viết');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBlogs(); }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài viết này? Hành động này không thể hoàn tác.')) return;
    
    clearFeedback();
    setDeletingId(id);
    try {
      const res = await fetch('/api/blogs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Không thể xóa bài viết');
      
      setMessage('Xóa bài viết thành công!');
      await loadBlogs();
    } catch (err: any) {
      setError(err?.message || 'Không thể xóa bài viết');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = blogs.filter((b) =>
    b.title.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="content-padding products-admin">
      {message && <div className="products-feedback products-feedback-success">{message}</div>}
      {error && <div className="products-feedback products-feedback-error">{error}</div>}

      <div className="products-table-wrap">
        <div className="products-toolbar">
          <input
            className="products-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm bài viết..."
          />
          <button
            type="button"
            className="products-btn products-btn-primary"
            onClick={() => router.push('/admin/blog/create')}
          >
            + Viết bài mới
          </button>
        </div>

        <div className="products-table-scroll">
          <table className="products-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>Ảnh</th>
                <th>Bài viết</th>
                <th>Chuyên mục</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{textAlign: 'center', padding: 24}}>Đang tải dữ liệu...</td></tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{textAlign: 'center', padding: 24, color: '#64748b'}}>
                    Không tìm thấy bài viết nào.
                  </td>
                </tr>
              ) : (
                filtered.map((blog) => (
                  <tr key={blog.id}>
                    <td>
                      <img className="products-thumb" src={blog.image_url || 'https://via.placeholder.com/48x48'} alt="" />
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{blog.title}</div>
                      <div style={{ color: '#64748b', fontSize: 12 }}>Tác giả: {blog.author}</div>
                    </td>
                    <td>{blog.category}</td>
                    <td>
                      <span className={`products-badge products-badge-${blog.status === 'published' ? 'active' : 'draft'}`}>
                        {blog.status === 'published' ? 'Đã đăng' : blog.status === 'draft' ? 'Nháp' : 'Lưu trữ'}
                      </span>
                    </td>
                    <td>
                      <div className="products-actions" style={{ justifyContent: 'center' }}>
                        <button
                          type="button"
                          className="products-icon-btn"
                          onClick={() => router.push(`/admin/blog/edit/${blog.id}`)}
                          title="Chỉnh sửa"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          className="products-icon-btn products-btn-danger"
                          onClick={() => handleDelete(blog.id)}
                          disabled={deletingId === blog.id}
                          title="Xóa"
                        >
                          {deletingId === blog.id ? '...' : '🗑️'}
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
          <span>Tổng cộng {filtered.length} bài viết</span>
        </div>
      </div>
    </div>
  );
}