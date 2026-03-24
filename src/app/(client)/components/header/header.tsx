'use client';
import Link from "next/link";
import useCartControllers from "@/app/(client)/cart/useCartControllers";
import { useEffect, useState } from "react";

export default function Header(){
    const { cartItems } = useCartControllers();
    const [cartCount, setCartCount] = useState(0);
    
    const updateCartCount = (items: any[] = cartItems) => {
        setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
    };
    
    useEffect(() => {
        updateCartCount();
    }, [cartItems]);
    
    useEffect(() => {
        // Listen for custom cart update events from other components
        const handleCartUpdate = (event: any) => {
            if (event.detail?.cartItems) {
                updateCartCount(event.detail.cartItems);
            }
        };
        
        if (typeof window !== 'undefined') {
            window.addEventListener('cartUpdated', handleCartUpdate);
            return () => window.removeEventListener('cartUpdated', handleCartUpdate);
        }
    }, []);
    return(
        <header>
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
            <button className="icon-btn">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <Link href="/login" className="icon-btn">
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