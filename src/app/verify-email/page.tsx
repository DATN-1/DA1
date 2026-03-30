'use client';

import '@/style/auth.css';
import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('Nhập email và mã kích hoạt đã nhận được qua email.');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailParam = new URLSearchParams(window.location.search).get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  const verifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage('Đang xác thực mã...');

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), code: code.trim() }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || 'Xác thực thất bại.');
        return;
      }
      setMessage(data.message || 'Xác thực thành công. Đang chuyển trang...');
      setTimeout(() => router.push('/login?verified=true'), 1200);
    } catch {
      setMessage('Lỗi hệ thống, vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (!email.trim()) {
      setMessage('Vui lòng nhập email để gửi lại mã.');
      return;
    }
    setLoading(true);
    setMessage('Đang gửi lại mã...');

    try {
      const response = await fetch('/api/auth/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || 'Không thể gửi lại mã.');
        return;
      }
      setMessage(data.message || 'Đã gửi lại mã xác thực.');
    } catch {
      setMessage('Lỗi hệ thống khi gửi lại mã.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ padding: '2rem' }}>
      <div className="auth-container">
        <div className="auth-header">
          <h2 className="text-gradient">Kích hoạt tài khoản</h2>
          <p>Nhập mã OTP đã được gửi về email để hoàn tất đăng ký.</p>
        </div>
        <form className="auth-form" onSubmit={verifyCode}>
          <div className="form-group">
            <label htmlFor="verify-email">Email</label>
            <input
              id="verify-email"
              className="form-control"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="verify-code">Mã kích hoạt (6 số)</label>
            <input
              id="verify-code"
              className="form-control"
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              required
            />
          </div>
          <button type="submit" className="btn btn-gradient btn-full" disabled={loading}>
            Xác thực tài khoản
          </button>
          <button
            type="button"
            className="btn btn-dark btn-full"
            style={{ marginTop: '10px' }}
            onClick={resendCode}
            disabled={loading}
          >
            Gửi lại mã
          </button>
        </form>
        <p className={`auth-feedback ${message.includes('thành công') || message.includes('Đã gửi') ? 'success' : 'error'}`}>{message}</p>
        <div className="auth-footer">
          Đã có tài khoản? <Link href="/login">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}
