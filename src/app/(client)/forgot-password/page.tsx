'use client';

import '@/style/auth.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('Nhập email để nhận mã OTP khôi phục mật khẩu.');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const sendOtp = async () => {
    if (!email.trim()) {
      setMessage('Vui lòng nhập email trước khi gửi OTP.');
      return;
    }

    setLoading(true);
    setMessage('Đang gửi OTP về email...');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || 'Không thể gửi OTP.');
        return;
      }

      setOtpSent(true);
      setMessage(data.message || 'OTP đã được gửi tới email của bạn.');
    } catch {
      setMessage('Lỗi hệ thống khi gửi OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage('Đang cập nhật mật khẩu mới...');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          code: code.trim(),
          password,
          confirm_password: confirmPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || 'Đổi mật khẩu không thành công.');
        return;
      }

      setMessage(data.message || 'Đổi mật khẩu thành công. Đang chuyển sang đăng nhập...');
      setTimeout(() => {
        router.push('/login?reset=success');
      }, 1000);
    } catch {
      setMessage('Lỗi hệ thống khi đổi mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container auth-container-wide">
        <div className="auth-header">
          <h2 className="text-gradient">Quên mật khẩu</h2>
          <p>Nhận mã OTP qua email và nhập mật khẩu mới để khôi phục tài khoản.</p>
        </div>

        <form className="auth-form" onSubmit={handleResetPassword}>
          <div className="form-group">
            <label htmlFor="forgot-email">Email tài khoản</label>
            <div className="form-input-row">
              <input
                id="forgot-email"
                type="email"
                className="form-control compact-input"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="example@email.com"
                required
              />
              <button type="button" className="btn btn-dark auth-inline-btn" onClick={sendOtp} disabled={loading}>
                {otpSent ? 'Gửi lại OTP' : 'Gửi OTP'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="forgot-code">Mã OTP</label>
            <input
              id="forgot-code"
              type="text"
              maxLength={6}
              className="form-control"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))}
              placeholder="Nhập 6 số OTP"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="forgot-password">Mật khẩu mới</label>
            <input
              id="forgot-password"
              type="password"
              className="form-control"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Nhập mật khẩu mới"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="forgot-confirm-password">Xác nhận mật khẩu mới</label>
            <input
              id="forgot-confirm-password"
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Nhập lại mật khẩu mới"
              required
            />
          </div>

          <button type="submit" className="btn btn-gradient btn-full" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
          </button>
        </form>

        <p className={`auth-feedback ${message.includes('thành công') || message.includes('đã được gửi') || message.includes('OTP đã được gửi') ? 'success' : 'error'}`}>
          {message}
        </p>

        <div className="auth-footer">
          Nhớ lại mật khẩu? <Link href="/login">Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}