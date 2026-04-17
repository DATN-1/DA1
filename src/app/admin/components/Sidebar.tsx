'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const isActiveRoute = (href: string) => {
        if (href === "/admin") {
            return pathname === "/admin";
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    };

    const toggleSidebar = () => {
        if (typeof window !== "undefined") {
            document.documentElement.classList.add("sidebar-ready");
            document.documentElement.classList.toggle("sidebar-collapsed");
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout API error:', error);
        }

        try {
            await signOut({ redirect: false });
        } catch (error) {
            console.error('NextAuth signOut error:', error);
        }

        if (typeof window !== 'undefined') {
            document.documentElement.classList.remove('sidebar-collapsed', 'sidebar-ready');
            window.localStorage.removeItem('currentUser');
            window.sessionStorage.setItem('authMessage', 'Đã đăng xuất thành công');
            window.dispatchEvent(new CustomEvent('authChanged'));
        }

        router.push('/');
        router.refresh();
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-container">
                    <div style={{ background: 'transparent', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img 
                            src="/images/candle-logo.png" 
                            alt="Aromi Admin Logo"
                            style={{ width: 32, height: 32, objectFit: 'contain' }}
                        />
                    </div>
                    <h2 className="text-gradient">AROMI ADMIN</h2>
                </div>
                <button className="btn-sidebar-toggle" id="sidebarToggle" onClick={toggleSidebar}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                </button>
            </div>

            <ul className="nav-links">
                <li className={`nav-item ${isActiveRoute("/admin") ? "active" : ""}`}>
                    <Link href="/admin">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span>Tổng Quan</span>
                    </Link>
                </li>

                <li className={`nav-item ${isActiveRoute("/admin/products") ? "active" : ""}`}>
                    <Link href="/admin/products">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span>Sản Phẩm</span>
                    </Link>
                </li>

                <li className={`nav-item ${isActiveRoute("/admin/categories") ? "active" : ""}`}>
                    <Link href="/admin/categories">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" />
                        </svg>
                        <span>Danh Mục</span>
                    </Link>
                </li>

                <li className={`nav-item ${isActiveRoute("/admin/brands") ? "active" : ""}`}>
                    <Link href="/admin/brands">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M3 11l8-8h6v6l-8 8-6-6z" />
                        </svg>
                        <span>Thương Hiệu</span>
                    </Link>
                </li>

                <li className={`nav-item ${isActiveRoute("/admin/order") ? "active" : ""}`}>
                    <Link href="/admin/order">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span>Đơn Hàng</span>
                    </Link>
                </li>

                <li className={`nav-item ${isActiveRoute("/admin/user") ? "active" : ""}`}>
                    <Link href="/admin/user">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span>Khách Hàng</span>
                    </Link>
                </li>

                <li className={`nav-item ${isActiveRoute("/admin/blog") ? "active" : ""}`}>
                    <Link href="/admin/blog">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2zM14 4v4h4" />
                        </svg>
                        <span>Bài Viết</span>
                    </Link>
                </li>

                <li className={`nav-item ${isActiveRoute("/admin/blog-categories") ? "active" : ""}`}>
                    <Link href="/admin/blog-categories">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                        <span>DM Bài Viết</span>
                    </Link>
                </li>

                <li className={`nav-item ${isActiveRoute("/admin/coupons") ? "active" : ""}`}>
                    <Link href="/admin/coupons">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        <span>Mã Giảm Giá</span>
                    </Link>
                </li>

                <li className={`nav-item ${isActiveRoute("/admin/reviews") ? "active" : ""}`}>
                    <Link href="/admin/reviews">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <span>Đánh Giá</span>
                    </Link>
                </li>

                <li className={`nav-item ${isActiveRoute("/admin/banner") ? "active" : ""}`}>
                    <Link href="/admin/banner">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h10M4 18h10" />
                        </svg>
                        <span>Banner</span>
                    </Link>
                </li>

                <li className={`nav-item ${isActiveRoute("/admin/gallery") ? "active" : ""}`}>
                    <Link href="/admin/gallery">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5h16v14H4V5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 15l5-5 4 4 3-3 4 4" />
                            <circle cx="9" cy="9" r="1.5" />
                        </svg>
                        <span>Gallery</span>
                    </Link>
                </li>

                <li className={`nav-item ${isActiveRoute("/admin/setting") ? "active" : ""}`}>
                    <Link href="/admin/setting">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Cài Đặt</span>
                    </Link>
                </li>
            </ul>

            <div className="sidebar-footer">
                <button type="button" className="btn-logout" onClick={handleLogout}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    <span>Đăng Xuất</span>
                </button>
            </div>
        </aside>
    );
}