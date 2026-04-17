'use client';

import { FormEvent, useEffect, useState } from 'react';
import '../products/products.css';

type SettingForm = {
  site_name: string;
  hotline: string;
  support_email: string;
  address: string;
  facebook_url: string;
  instagram_url: string;
  freeship_threshold: string;
};

const defaultForm: SettingForm = {
  site_name: '',
  hotline: '',
  support_email: '',
  address: '',
  facebook_url: '',
  instagram_url: '',
  freeship_threshold: '0',
};

export default function SettingPage() {
  const [form, setForm] = useState<SettingForm>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const clearFeedback = () => { setError(''); setMessage(''); };

  const loadSettings = async () => {
    setLoading(true);
    clearFeedback();
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Không thể tải cài đặt');
      
      // Merge with default form in case some keys are missing
      setForm((prev) => ({ ...prev, ...data }));
    } catch (err: any) {
      setError(err?.message || 'Lỗi tải trang Cài Đặt');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSettings(); }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearFeedback();
    setSubmitting(true);
    
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Không thể lưu cài đặt');
      
      setMessage('Lưu cấu hình hệ thống thành công!');
    } catch (err: any) {
      setError(err?.message || 'Lỗi khi lưu cài đặt');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="content-padding products-admin" style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
        <p style={{ color: '#64748b' }}>Đang tải cấu hình hệ thống...</p>
      </div>
    );
  }

  return (
    <div className="content-padding products-admin">
      <div className="products-panel-header" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Cấu Hình Hệ Thống</h2>
        <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Quản lý các thông tin chung hiển thị trên toàn bộ Website</p>
      </div>

      {message ? <div className="products-feedback products-feedback-success">{message}</div> : null}
      {error   ? <div className="products-feedback products-feedback-error">{error}</div>   : null}

      <form onSubmit={handleSubmit} className="products-panel" style={{ width: '100%', margin: '0' }}>
        
        {/* Nhóm 1: Thông tin chưng */}
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
          Thông Tin Chung
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Tên Cửa Hàng (Site Name)</label>
            <input
              className="products-input"
              value={form.site_name}
              onChange={(e) => setForm((p) => ({ ...p, site_name: e.target.value }))}
              placeholder="VD: Aromi Candle Store"
              disabled={submitting}
            />
          </div>
          <div>
             <label style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Ngưỡng tính Freeship (VNĐ)</label>
            <input
              className="products-input"
              type="number"
              value={form.freeship_threshold}
              onChange={(e) => setForm((p) => ({ ...p, freeship_threshold: e.target.value }))}
              placeholder="Ví dụ: 500000"
              disabled={submitting}
            />
          </div>
        </div>

        {/* Nhóm 2: Liên hệ */}
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
          Thông Tin Liên Hệ (Footer / Header)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Số điện thoại (Hotline)</label>
            <input
              className="products-input"
              value={form.hotline}
              onChange={(e) => setForm((p) => ({ ...p, hotline: e.target.value }))}
              placeholder="0909-xxx-xxx"
              disabled={submitting}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Email hỗ trợ</label>
            <input
              className="products-input"
              value={form.support_email}
              onChange={(e) => setForm((p) => ({ ...p, support_email: e.target.value }))}
              placeholder="support@aromi.vn"
              disabled={submitting}
            />
          </div>
        </div>
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>Địa chỉ cửa hàng</label>
          <input
            className="products-input"
            value={form.address}
            onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
            placeholder="123 Lê Lợi, Quận 1, TP.HCM"
            disabled={submitting}
          />
        </div>


        <div className="products-actions-form" style={{ marginTop: '2rem', justifyContent: 'flex-start' }}>
          <button type="submit" className="products-btn products-btn-primary" style={{ padding: '0.75rem 2rem' }} disabled={submitting}>
            {submitting ? 'Đang cập nhật...' : '💾 Lưu Cấu Hình Hệ Thống'}
          </button>
          <button type="button" className="products-btn products-btn-ghost" onClick={() => loadSettings()} disabled={submitting}>
            🔄 Khôi phục ban đầu
          </button>
        </div>

      </form>
    </div>
  );
}