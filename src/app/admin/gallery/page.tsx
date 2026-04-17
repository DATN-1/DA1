'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Gallery, GalleryForm } from '@/app/type/GalleryType';
import '../products/products.css';

type ProductOption = {
  id: number;
  name: string;
};

const defaultForm: GalleryForm = {
  product_id: null,
  image_url: '',
  title: '',
  category: 'khac',
  display_order: 0,
  status: 'active',
};

export default function GalleryAdminPage() {
  const [items, setItems] = useState<Gallery[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState<GalleryForm>(defaultForm);

  const clearFeedback = () => {
    setError('');
    setMessage('');
  };

  const loadGalleries = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/galleries');
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Khong the tai danh sach gallery');
      }

      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || 'Loi ket noi khi tai du lieu');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/products?limit=all');
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Khong the tai san pham');
      }

      const source = Array.isArray(data)
        ? data
        : Array.isArray(data?.products)
          ? data.products
          : [];

      const mapped = source
        .filter((item: any) => item && Number(item.id) > 0)
        .map((item: any) => ({ id: Number(item.id), name: String(item.name || `SP #${item.id}`) }))
        .sort((a: ProductOption, b: ProductOption) => b.id - a.id);

      setProducts(mapped);
    } catch {
      setProducts([]);
    }
  };

  useEffect(() => {
    loadGalleries();
    loadProducts();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm(defaultForm);
  };

  const handleEdit = (item: Gallery) => {
    clearFeedback();
    setEditingId(item.id);
    setForm({
      product_id: item.product_id,
      image_url: item.image_url,
      title: item.title || '',
      category: item.category || 'khac',
      display_order: item.display_order,
      status: item.status,
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearFeedback();
    setSubmitting(true);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { id: editingId, ...form } : form;

      const res = await fetch('/api/galleries', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Loi luu gallery');
      }

      setMessage(editingId ? 'Cap nhat anh thanh cong' : 'Them anh thanh cong');
      resetForm();
      await loadGalleries();
    } catch (err: any) {
      setError(err?.message || 'Khong the luu gallery');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Ban co chac muon xoa anh nay?')) {
      return;
    }

    clearFeedback();
    setDeletingId(id);

    try {
      const res = await fetch('/api/galleries', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Khong the xoa gallery');
      }

      setMessage('Xoa anh thanh cong');
      if (editingId === id) {
        resetForm();
      }
      await loadGalleries();
    } catch (err: any) {
      setError(err?.message || 'Loi xoa gallery');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = items.filter((item) => {
    const query = searchTerm.toLowerCase();
    return (
      (item.product_name || '').toLowerCase().includes(query) ||
      (item.title || '').toLowerCase().includes(query) ||
      (item.category || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="content-padding products-admin">
      {message ? <div className="products-feedback products-feedback-success">{message}</div> : null}
      {error ? <div className="products-feedback products-feedback-error">{error}</div> : null}

      <div className="products-grid" style={{ gridTemplateColumns: '320px 1fr' }}>
        <section className="products-panel">
          <div className="products-panel-header">
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
              {editingId ? 'Cap nhat anh gallery' : 'Them anh gallery'}
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
              Anh se hien thi dong o trang Gallery client
            </p>
          </div>

          <form className="products-form" onSubmit={handleSubmit}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>URL anh *</label>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>San pham lien ket *</label>
            <select
              className="products-input"
              value={form.product_id || ''}
              onChange={(event) => setForm((prev) => ({ ...prev, product_id: Number(event.target.value) || null }))}
              disabled={submitting}
              required
            >
              <option value="">Chon san pham</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>

            <label style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>URL anh *</label>
            <input
              className="products-input"
              value={form.image_url}
              onChange={(event) => setForm((prev) => ({ ...prev, image_url: event.target.value }))}
              placeholder="https://..."
              disabled={submitting}
              required
            />

            <label style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Tieu de</label>
            <input
              className="products-input"
              value={form.title || ''}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Nhap tieu de anh"
              disabled={submitting}
            />

            <label style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Danh muc</label>
            <input
              className="products-input"
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              placeholder="vd: xuong-san-xuat, su-kien..."
              disabled={submitting}
              required
            />

            <label style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Thu tu</label>
            <input
              className="products-input"
              type="number"
              value={form.display_order}
              onChange={(event) => setForm((prev) => ({ ...prev, display_order: Number(event.target.value) }))}
              disabled={submitting}
            />

            <label style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Trang thai</label>
            <select
              className="products-input"
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as 'active' | 'inactive' }))}
              disabled={submitting}
            >
              <option value="active">Hien thi</option>
              <option value="inactive">An</option>
            </select>

            <div className="products-preview">
              <img
                src={form.image_url || 'https://via.placeholder.com/120x120?text=Preview'}
                alt="preview"
                onError={(event) => {
                  event.currentTarget.src = 'https://via.placeholder.com/120x120?text=Preview';
                }}
              />
              <p>{form.image_url ? 'Xem truoc anh' : 'Nhap URL de xem truoc'}</p>
            </div>

            <div className="products-actions-form">
              <button className="products-btn products-btn-primary" type="submit" disabled={submitting}>
                {submitting ? 'Dang luu...' : editingId ? 'Cap nhat' : 'Them moi'}
              </button>
              {editingId ? (
                <button className="products-btn products-btn-ghost" type="button" onClick={resetForm} disabled={submitting}>
                  Huy
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="products-table-wrap">
          <div className="products-toolbar">
            <input
              className="products-search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tim theo tieu de hoac danh muc..."
            />
            <span style={{ fontSize: 13, color: '#64748b', whiteSpace: 'nowrap' }}>{filtered.length} anh</span>
          </div>

          <div className="products-table-scroll">
            <table className="products-table" style={{ minWidth: 680 }}>
              <thead>
                <tr>
                  <th style={{ width: 96 }}>Anh</th>
                  <th>San pham</th>
                  <th>Tieu de</th>
                  <th>Danh muc</th>
                  <th style={{ textAlign: 'center' }}>Thu tu</th>
                  <th style={{ textAlign: 'center' }}>Trang thai</th>
                  <th style={{ textAlign: 'center' }}>Thao tac</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                      Dang tai du lieu...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: 24, color: '#64748b' }}>
                      Chua co anh nao
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <img
                          className="products-thumb"
                          src={item.image_url}
                          alt={item.title || 'Gallery image'}
                          onError={(event) => {
                            event.currentTarget.src = 'https://via.placeholder.com/80x80?text=Image';
                          }}
                        />
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#111827' }}>{item.product_name || `SP #${item.product_id || '-'}`}</div>
                        <div style={{ color: '#64748b', fontSize: 12 }}>ID: {item.product_id || '-'}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#111827' }}>{item.title || 'Khong co tieu de'}</div>
                      </td>
                      <td>{item.category}</td>
                      <td style={{ textAlign: 'center', color: '#64748b', fontWeight: 600 }}>{item.display_order}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span
                          style={{
                            padding: '4px 8px',
                            borderRadius: 12,
                            fontSize: 12,
                            fontWeight: 600,
                            backgroundColor: item.status === 'active' ? '#dcfce7' : '#f1f5f9',
                            color: item.status === 'active' ? '#166534' : '#475569',
                          }}
                        >
                          {item.status === 'active' ? 'Hien thi' : 'An'}
                        </span>
                      </td>
                      <td>
                        <div className="products-actions" style={{ justifyContent: 'center' }}>
                          <button
                            type="button"
                            className="products-icon-btn"
                            onClick={() => handleEdit(item)}
                            disabled={submitting || deletingId === item.id}
                            title="Sua"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="products-icon-btn products-btn-danger"
                            onClick={() => handleDelete(item.id)}
                            disabled={submitting || deletingId === item.id}
                            title="Xoa"
                          >
                            {deletingId === item.id ? '...' : 'Del'}
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
