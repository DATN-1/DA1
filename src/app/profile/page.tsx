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
  });

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

      const response = await fetch('/api/auth/profile', {
        headers: {
          'Cookie': `user-session=${encodeURIComponent(currentUser)}`
        }
      });

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
          'Content-Type': 'application/json',
          'Cookie': `user-session=${encodeURIComponent(currentUser)}`
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
              <label htmlFor="address_line">Địa Chỉ Giao Hàng</label>
              <textarea
                id="address_line"
                className={`${styles.formControl} ${styles.textarea}`}
                value={formData.address_line}
                onChange={(e) => setFormData(prev => ({ ...prev, address_line: e.target.value }))}
                placeholder="Nhập địa chỉ giao hàng đầy đủ"
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