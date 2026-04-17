'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './profile.module.css';

type UserProfile = {
  id: number;
  full_name: string | null;
  email: string;
  phone: string | null;
  created_at: string;
};

type AddressInfo = {
  recipient_name: string;
  phone: string;
  address_line: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [address, setAddress] = useState<AddressInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    recipient_name: '',
    address_line: '',
    province_code: '',
    district_code: '',
  });

  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/provinces')
      .then(res => res.json())
      .then(data => setProvinces(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!formData.province_code) {
      setDistricts([]);
      return;
    }
    fetch(`/api/provinces/${formData.province_code}`)
      .then(res => res.json())
      .then(data => setDistricts(data.districts || []))
      .catch(console.error);
  }, [formData.province_code]);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      // Get user data from localStorage
      const currentUser = typeof window !== 'undefined' ? window.localStorage.getItem('currentUser') : null;
      if (!currentUser) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/auth/profile');

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to load profile');
      }

      const data = await response.json();
      setUser(data.user);
      setAddress(data.address);
      setFormData({
        full_name: data.user.full_name || '',
        phone: data.user.phone || '',
        recipient_name: data.address?.recipient_name || '',
        address_line: data.address?.address_line || '',
        province_code: data.address?.province_code || '',
        district_code: data.address?.district_code || '',
      });
    } catch (error) {
      console.error('Load profile error:', error);
      setMessage('Không thể tải thông tin tài khoản');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      // Get user data from localStorage
      const currentUser = typeof window !== 'undefined' ? window.localStorage.getItem('currentUser') : null;
      if (!currentUser) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || 'Cập nhật thất bại');
        return;
      }

      setMessage('Cập nhật thông tin thành công');
      setUser(prev => prev ? { ...prev, ...formData } : null);

      // Update localStorage
      if (typeof window !== 'undefined') {
        const userData = JSON.parse(currentUser);
        userData.full_name = formData.full_name;
        window.localStorage.setItem('currentUser', JSON.stringify(userData));
        window.dispatchEvent(new CustomEvent('authChanged'));
      }
    } catch (error) {
      setMessage('Lỗi hệ thống, vui lòng thử lại');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.profilePage}>
        <div className={styles.profileContainer}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Đang tải...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.profilePage}>
        <div className={styles.profileContainer}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Vui lòng đăng nhập để xem thông tin tài khoản</p>
            <Link href="/login" className={styles.btnPrimary}>Đăng Nhập</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileContainer}>
        <div className={styles.profileHeader}>
          <h1>Thông Tin Tài Khoản</h1>
          <p>Quản lý thông tin cá nhân và giao hàng</p>
          <div style={{ marginTop: '1rem' }}>
            <Link href="/profile/orders" className={styles.btnSecondary} style={{ display: 'inline-block', textDecoration: 'none', background: '#e2e8f0', color: '#0f172a', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 500 }}>
              Xem Đơn Hàng Của Tôi
            </Link>
          </div>
        </div>

        <form className={styles.profileForm} onSubmit={handleSubmit}>
          {/* Thông tin cá nhân */}
          <div className={styles.formSection}>
            <h2>Thông Tin Cá Nhân</h2>
            
            <div className={styles.formRow}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className={styles.formControl}
                value={user.email}
                disabled
              />
            </div>

            <div className={styles.formRow}>
              <label htmlFor="full_name">Họ và Tên</label>
              <input
                id="full_name"
                type="text"
                className={styles.formControl}
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Nhập họ và tên"
                required
              />
            </div>

            <div className={styles.formRow}>
              <label htmlFor="phone">Số Điện Thoại</label>
              <input
                id="phone"
                type="tel"
                className={styles.formControl}
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className={styles.formRow}>
              <label>Ngày Đăng Ký</label>
              <input
                type="text"
                className={`${styles.formControl} ${styles.disabled}`}
                value={new Date(user.created_at).toLocaleDateString('vi-VN')}
                disabled
              />
            </div>
          </div>

          {/* Thông tin giao hàng */}
          <div className={styles.formSection}>
            <h2>Thông Tin Giao Hàng</h2>
            
            <div className={styles.formRow}>
              <label htmlFor="recipient_name">Tên Người Nhận</label>
              <input
                id="recipient_name"
                type="text"
                className={styles.formControl}
                value={formData.recipient_name}
                onChange={(e) => setFormData(prev => ({ ...prev, recipient_name: e.target.value }))}
                placeholder="Nhập tên người nhận hàng"
                required
              />
            </div>

            <div className={styles.formRow}>
              <label>Tỉnh / Thành phố</label>
              <select
                className={styles.formControl}
                value={formData.province_code}
                onChange={(e) => setFormData(prev => ({ ...prev, province_code: e.target.value, district_code: '' }))}
              >
                <option value="">Chọn Tỉnh / Thành phố</option>
                {provinces.map((prov) => (
                  <option key={prov.code} value={prov.code}>{prov.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.formRow}>
              <label>Quận / Huyện</label>
              <select
                className={styles.formControl}
                value={formData.district_code}
                onChange={(e) => setFormData(prev => ({ ...prev, district_code: e.target.value }))}
                disabled={!formData.province_code}
              >
                <option value="">Chọn Quận / Huyện</option>
                {districts.map((dist) => (
                  <option key={dist.code} value={dist.code}>{dist.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.formRow}>
              <label htmlFor="address_line">Số nhà, Tên đường, Phường/Xã</label>
              <textarea
                id="address_line"
                className={`${styles.formControl} ${styles.textarea}`}
                value={formData.address_line}
                onChange={(e) => setFormData(prev => ({ ...prev, address_line: e.target.value }))}
                placeholder="Nhập địa chỉ giao hàng cụ thể"
                required
              />
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`${styles.message} ${message.includes('thành công') ? styles.success : styles.error}`}>
              {message}
            </div>
          )}

          {/* Buttons */}
          <div className={styles.formActions}>
            <button type="submit" className={styles.btnPrimary} disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </button>
            <Link href="/" className={styles.btnSecondary}>Quay Lại</Link>
          </div>
        </form>
      </div>
    </div>
  );
}