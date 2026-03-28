'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    const isActiveRoute = (href: string) => {
        if (href === "/admin") {
            return pathname === "/admin";
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-container">
                    <div className="logo-icon">
                        <svg width="24" height="24" fill="none" stroke="white" viewBox="0 0 24 24">
                            <path strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                        </svg>
                    </div>
                    <h2 className="text-gradient">AROMI ADMIN</h2>
                </div>
                <button className="btn-sidebar-toggle" id="sidebarToggle">
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

                <li className={`nav-item ${isActiveRoute("/admin/settings") ? "active" : ""}`}>
                    <Link href="/admin/settings">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Cài Đặt</span>
                    </Link>
                </li>
            </ul>

            <div className="sidebar-footer">
                <a href="../layout/index.html" className="btn-logout">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    <span>Đăng Xuất</span>
                </a>
            </div>
        </aside>
    );
}