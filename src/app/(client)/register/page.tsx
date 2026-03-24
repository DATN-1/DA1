'use client';

import "@/style/auth.css";
import Link from "next/link";


export default function RegisterPage() {
    return (
        <div>
            <div className="auth-page">
        <div className="auth-container">
            <div className="auth-header">
                <a href="index.html" className="auth-logo logo" style={{marginBottom: "1.5rem"}}>
                    <div className="logo-icon">
                        <svg width="32" height="32" fill="none" stroke="white" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                        </svg>
                    </div>
                </a>
                <h2 className="text-gradient">Tạo Tài Khoản</h2>
                <p>Tham gia cùng Aromi Candle ngay hôm nay</p>
            </div>

            <form className="auth-form" id="registerForm">
                <div className="form-group">
                    <label htmlFor="fullname">Họ và Tên</label>
                    <div className="form-input-wrapper">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <input type="text" id="fullname" className="form-control" placeholder="Nguyễn Văn A" required />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="email">Địa chỉ Email</label>
                    <div className="form-input-wrapper">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <input type="email" id="email" className="form-control" placeholder="example@email.com" required />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="password">Mật khẩu</label>
                    <div className="form-input-wrapper">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <input type="password" id="password" className="form-control" placeholder="••••••••" required/>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
                    <div className="form-input-wrapper">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <input type="password" id="confirm-password" className="form-control" placeholder="••••••••" required/>
                    </div>
                </div>

                <div className="remember-me" style={{fontSize: "0.875rem"}}>
                    <input type="checkbox" required/> Tôi đồng ý với các <Link href="#" style={{color: "#d97706", marginLeft: "0.25rem"}}>điều khoản dịch vụ</Link>
                </div>

                <button type="submit" className="btn btn-gradient btn-full">Đăng Ký</button>
            </form>

            <div className="auth-footer">
                Đã có tài khoản? <Link href="/login">Đăng nhập</Link>
            </div>
        </div>
    </div>
        </div>
    );
}