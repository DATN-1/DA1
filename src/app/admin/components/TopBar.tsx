export default function TopBar() {
    return (
        <header className="top-bar">
            <div className="header-left">
                <h1 className="page-title">Tổng Quan</h1>
            </div>
            <div className="header-tools">
                <div className="search-bar">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <input type="text" placeholder="Tìm kiếm..."/>
                </div>
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