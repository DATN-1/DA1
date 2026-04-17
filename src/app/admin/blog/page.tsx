'use client';

import { FormEvent, useEffect, useState } from 'react';
import '../products/products.css'; // Mượn CSS của trang products
import { Blog } from '@/app/type/BlogType';


type BlogForm = Omit<Blog, 'id' | 'created_at'>;

const defaultForm: BlogForm = {
  title: '',
  slug: '',
  category: '',
  summary: '',
  content: '',
  image_url: '',
  author: 'Aromi Team',
  status: 'published',
};

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export default function BlogAdminPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<BlogForm>(defaultForm);
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

  const loadCategories = async () => {
    try {
      const res = await fetch('/api/blog-categories');
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data.filter((c: any) => c.status === 'active'));
    } catch {}
  };

  useEffect(() => { loadBlogs(); loadCategories(); }, []);

  const resetForm = () => { setEditingId(null); setForm(defaultForm); };

  const handleTitleChange = (val: string) => {
    setForm((p) => ({
      ...p,
      title: val,
      slug: editingId ? p.slug : toSlug(val),
    }));
  };

  const handleEdit = (blog: Blog) => {
    clearFeedback();
    setEditingId(blog.id);
    setForm({
      title: blog.title,
      slug: blog.slug,
      category: blog.category,
      summary: blog.summary,
      content: blog.content,
      image_url: blog.image_url,
      author: blog.author,
      status: blog.status,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearFeedback();
    
    setSubmitting(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { id: editingId, ...form } : form;
      
      const res = await fetch('/api/blogs', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Lỗi khi lưu bài viết');
      
      setMessage(editingId ? 'Cập nhật thành công!' : 'Thêm bài viết thành công!');
      resetForm();
      await loadBlogs();
    } catch (err: any) {
      setError(err?.message || 'Không thể lưu bài viết');
    } finally {
      setSubmitting(false);
    }
  };

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
      
      setMessage('Xóa thành công!');
      if (editingId === id) resetForm();
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

      <div className="products-grid" style={{ gridTemplateColumns: 'minmax(400px, 1fr) 2fr' }}>
        
        {/* Form soạn thảo */}
        <section className="products-panel">
          <div className="products-panel-header">
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
              {editingId ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
            </h3>
          </div>
          
          <form className="products-form" onSubmit={handleSubmit}>
            <input
              className="products-input"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Tiêu đề bài viết *"
              required
            />
            
            <div className="products-row">
              <input
                className="products-input"
                value={form.slug}
                onChange={(e) => setForm(p => ({ ...p, slug: e.target.value }))}
                placeholder="Đường dẫn (slug)"
              />
              <select
                className="products-input"
                value={form.category}
                onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))}
                required
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            
            <input
              className="products-input"
              value={form.image_url}
              onChange={(e) => setForm(p => ({ ...p, image_url: e.target.value }))}
              placeholder="Hình ảnh thu nhỏ (URL)"
            />
            
            {form.image_url && (
              <div className="products-preview">
                <img src={form.image_url} alt="preview" onError={(e) => e.currentTarget.src='https://via.placeholder.com/60x60'} />
                <p>Ảnh thu nhỏ của Blog</p>
              </div>
            )}
            
            <textarea
              className="products-textarea"
              style={{ minHeight: '60px' }}
              value={form.summary}
              onChange={(e) => setForm(p => ({ ...p, summary: e.target.value }))}
              placeholder="Tóm tắt nội dung (Summary)"
            />

            <select 
              className="products-select"
              value={form.status}
              onChange={(e) => setForm(p => ({ ...p, status: e.target.value as any }))}
            >
              <option value="published">Xuất bản (Hiển thị ngay)</option>
              <option value="draft">Bản nháp (Ẩn)</option>
              <option value="archived">Lưu trữ</option>
            </select>
            
            {/* Nên thay bằng Editor HTML như ReactQuill (thực tế) */}
            <textarea
              className="products-textarea"
              style={{ minHeight: '200px', fontFamily: 'monospace' }}
              value={form.content}
              onChange={(e) => setForm(p => ({ ...p, content: e.target.value }))}
              placeholder="Nhập nội dung HTML/Markdown ở đây..."
              required
            />

            <div className="products-actions-form">
              <button type="submit" className="products-btn products-btn-primary" disabled={submitting}>
                {submitting ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Xuất bản bài viết'}
              </button>
              {editingId && (
                <button type="button" className="products-btn products-btn-ghost" onClick={resetForm}>
                  Hủy
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Bảng quản lý bài viết */}
        <section className="products-table-wrap">
          <div className="products-toolbar">
            <input
              className="products-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm bài viết..."
            />
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
                      Chưa có Bài viết nào. Dữ liệu chưa được kết nối API!
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
                          {blog.status}
                        </span>
                      </td>
                      <td>
                        <div className="products-actions" style={{ justifyContent: 'center' }}>
                          <button
                            type="button"
                            className="products-icon-btn"
                            onClick={() => handleEdit(blog)}
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            className="products-icon-btn products-btn-danger"
                            onClick={() => handleDelete(blog.id)}
                          >
                            🗑️
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