'use client';

import { usePathname } from 'next/navigation';

export default function TopBar() {
    const pathname = usePathname();

    const getPageTitle = (path: string) => {
        if (path.startsWith('/admin/products')) return 'Sản Phẩm';
        if (path.startsWith('/admin/categories')) return 'Danh Mục';
        if (path.startsWith('/admin/brands')) return 'Thương Hiệu';
        if (path.startsWith('/admin/order')) return 'Đơn Hàng';
        if (path.startsWith('/admin/user')) return 'Khách Hàng';
        if (path.startsWith('/admin/blog')) return 'Bài viết';
        if (path.startsWith('/admin/setting')) return 'Cài đặt';
        return 'Tổng Quan';
    };

    const title = getPageTitle(pathname);

    return (
        <header className="top-bar">
            <div className="header-left">
                <h1 className="page-title">{title}</h1>
            </div>
            <div className="header-tools">
                <div className="notification-bell">
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                    </svg>
                    <span className="notification-badge">3</span>
                </div>
                <div className="admin-profile">
                    <div className="admin-avatar">
                        <img 
                            src="https://lh3.googleusercontent.com/d/1E0eY0I5ZnK-gGO_HJ0fNuv5w8tltiMt9=s220" 
                            alt="admin" 
                            referrerPolicy="no-referrer"
                        />
                    </div>
                    <div className="admin-info">
                        <span className="name">Admin Aromi</span>
                        <span className="role">Quản lý hệ thống</span>
                    </div>
                </div>
            </div>
        </header>
    );
}