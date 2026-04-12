'use client';
import Link from "next/link";
import useCartControllers from "@/app/(client)/cart/useCartControllers";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AuthUser = {
  id: number;
  email: string;
  full_name: string | null;
  role: "admin" | "customer";
};

export default function Header(){
    const { cartItems } = useCartControllers();
    const [cartCount, setCartCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authNotice, setAuthNotice] = useState("");
  const [keyword, setKeyword] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

    const loadCurrentUser = () => {
      if (typeof window === "undefined") {
        return;
      }

      const savedUser = window.localStorage.getItem("currentUser");

      if (!savedUser) {
        setCurrentUser(null);
        return;
      }

      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch {
        window.localStorage.removeItem("currentUser");
        setCurrentUser(null);
      }
    };

    const userDisplayName = currentUser?.full_name?.trim() || currentUser?.email || "Tài khoản";
    const userInitials = userDisplayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U";

    const accountHref = currentUser?.role === "admin" ? "/admin" : "/";
    
    const handleLogout = async () => {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } catch (error) {
        console.error('Logout error:', error);
      }
      
      // Clear local storage and redirect
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("currentUser");
        window.sessionStorage.setItem("authMessage", "Đã đăng xuất thành công");
      }
      
      setCurrentUser(null);
      setShowUserMenu(false);
      router.push("/");
      
      // Dispatch auth changed event
      window.dispatchEvent(new CustomEvent('authChanged'));
    };

    const toggleUserMenu = () => {
      setShowUserMenu(!showUserMenu);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Element;
        if (!target.closest('.user-menu-container')) {
          setShowUserMenu(false);
        }
      };

      if (showUserMenu) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [showUserMenu]);
    
    const updateCartCount = (items: any[] = cartItems) => {
        setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
    };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const search = keyword.trim();
    router.push(search ? `/products?search=${encodeURIComponent(search)}` : "/products");
  };
    
    useEffect(() => {
        updateCartCount();
    }, [cartItems]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParam = new URLSearchParams(window.location.search).get("search") || "";
      setKeyword(searchParam);
      loadCurrentUser();

      const authMessage = window.sessionStorage.getItem("authMessage");
      if (authMessage) {
        setAuthNotice(authMessage);
        window.sessionStorage.removeItem("authMessage");
        window.setTimeout(() => setAuthNotice(""), 2600);
      }
    }
  }, []);
    
    useEffect(() => {
        // Listen for custom cart update events from other components
        const handleCartUpdate = (event: any) => {
            if (event.detail?.cartItems) {
                updateCartCount(event.detail.cartItems);
            }
        };

        const handleAuthChanged = () => {
          loadCurrentUser();
        };
        
        if (typeof window !== 'undefined') {
            window.addEventListener('cartUpdated', handleCartUpdate);
            window.addEventListener('authChanged', handleAuthChanged);
            return () => {
              window.removeEventListener('cartUpdated', handleCartUpdate);
              window.removeEventListener('authChanged', handleAuthChanged);
            };
        }
    }, []);
    return(
        <header>
      {authNotice && <div className="auth-notice">{authNotice}</div>}
      <div className="container">
        <div className="header-content">
          <Link href="/" className="logo">
            <div className="logo-icon">
              <svg
                width="32"
                height="32"
                fill="none"
                stroke="white"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
              </svg>
            </div>
            <div className="logo-text">
              <h1 className="text-gradient">AROMI CANDLE</h1>
              <p>Nến Thơm Cao Cấp</p>
            </div>
          </Link>

          <nav>
            <Link href="/">Trang Chủ</Link>
            <Link href="/products">Sản Phẩm</Link>
            <Link href="/blog">Bài Viết</Link>
            <Link href="/about">Về Chúng Tôi</Link>
            <Link href="/contact">Liên Hệ</Link>
          </nav>

          <div className="header-actions">
            <form className="header-search" onSubmit={handleSearch}>
              <input
                type="text"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Tìm sản phẩm..."
                aria-label="Tìm kiếm sản phẩm"
              />
              <button type="submit" className="icon-btn header-search-btn" aria-label="Tìm kiếm">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="#374151"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
            {currentUser ? (
              <div className="user-menu-container">
                <button 
                  className="icon-btn user-account-btn" 
                  title={userDisplayName} 
                  aria-label={userDisplayName}
                  onClick={toggleUserMenu}
                >
                  <span className="user-avatar">{userInitials}</span>
                </button>
                {showUserMenu && (
                  <div className="user-dropdown-menu">
                    <div className="user-menu-header">
                      <span className="user-avatar-small">{userInitials}</span>
                      <div className="user-info">
                        <div className="user-name">{userDisplayName}</div>
                        <div className="user-email">{currentUser.email}</div>
                      </div>
                    </div>
                    <div className="user-menu-items">
                      <Link href="/profile" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Thông tin tài khoản
                      </Link>
                      {currentUser.role === "admin" && (
                        <Link href="/admin" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Quản trị
                        </Link>
                      )}
                      <button className="user-menu-item logout-btn" onClick={handleLogout}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="icon-btn" aria-label="Đăng nhập tài khoản">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="#374151"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}
            <Link href="/cart" className="icon-btn">
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="#374151"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </div>
    </header>
    );
}