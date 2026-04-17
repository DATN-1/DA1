'use client';

import "@/style/auth.css";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";


export default function RegisterPage() {
    const [feedback, setFeedback] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [socialLoading, setSocialLoading] = useState<'google' | 'facebook' | null>(null);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setFeedback('');

        const form = event.currentTarget;
        const formData = new FormData(form);
        const full_name = formData.get('fullname')?.toString().trim();
        const email = formData.get('email')?.toString().trim();
        const password = formData.get('password')?.toString();
        const confirm_password = formData.get('confirm_password')?.toString();

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ full_name, email, password, confirm_password }),
            });
            const data = await response.json();
            if (!response.ok) {
                setFeedback(data.error || 'Đăng ký không thành công');
            } else {
                setFeedback(data.message || 'Vui lòng kiểm tra email để lấy mã kích hoạt.');
                if (data.email) {
                    setTimeout(() => {
                        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
                    }, 900);
                }
                form.reset();
            }
        } catch (error) {
            setFeedback('Lỗi hệ thống, vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialRegister = async (provider: 'google' | 'facebook') => {
        try {
            setFeedback('');
            setSocialLoading(provider);
            await signIn(provider, { callbackUrl: '/oauth-success' });
        } catch {
            setFeedback('Không thể kết nối OAuth, vui lòng thử lại.');
            setSocialLoading(null);
        }
    };
    return (
        <div>
            <div className="auth-page">
        <div className="auth-container">
            <div className="auth-header">
                <Link href="/" className="auth-logo logo" style={{marginBottom: "1.5rem"}}>
                    <div className="logo-icon">
                        <svg width="32" height="32" fill="none" stroke="white" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                        </svg>
                    </div>
                </Link>
                <h2 className="text-gradient">Tạo Tài Khoản</h2>
                <p>Tham gia cùng Aromi Candle ngay hôm nay</p>
            </div>

            <form className="auth-form" id="registerForm" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="fullname">Họ và Tên</label>
                    <div className="form-input-wrapper">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                            <input type="text" id="fullname" name="fullname" className="form-control" placeholder="Nguyễn Văn A" required />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="email">Địa chỉ Email</label>
                    <div className="form-input-wrapper">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                            <input type="email" id="email" name="email" className="form-control" placeholder="example@email.com" required />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="password">Mật khẩu</label>
                    <div className="form-input-wrapper">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                            <input type="password" id="password" name="password" className="form-control" placeholder="••••••••" required/>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
                    <div className="form-input-wrapper">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                            <input type="password" id="confirm-password" name="confirm_password" className="form-control" placeholder="••••••••" required/>
                    </div>
                </div>

                <div className="remember-me" style={{fontSize: "0.875rem"}}>
                    <input type="checkbox" required/> Tôi đồng ý với các <Link href="#" style={{color: "#d97706", marginLeft: "0.25rem"}}>điều khoản dịch vụ</Link>
                </div>

                <button type="submit" className="btn btn-gradient btn-full" disabled={loading}>
                    {loading ? 'Đang gửi email...' : 'Đăng Ký'}
                </button>
                {feedback && <p className={`auth-feedback ${feedback.includes('thành công') || feedback.includes('kiểm tra email') ? 'success' : 'error'}`}>{feedback}</p>}
            </form>

            <div className="social-auth">
                <div className="social-auth-title">
                    <span>Hoặc đăng ký với</span>
                </div>
                <div className="social-btns">
                    <button className="social-btn" type="button" onClick={() => handleSocialRegister('google')} disabled={socialLoading !== null}>
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        {socialLoading === 'google' ? 'Đang xử lý...' : 'Google'}
                    </button>
                    {/* Facebook button removed */}
                </div>
            </div>

            <div className="auth-footer">
                Đã có tài khoản? <Link href="/login">Đăng nhập</Link>
            </div>
        </div>
    </div>
        </div>
    );
}