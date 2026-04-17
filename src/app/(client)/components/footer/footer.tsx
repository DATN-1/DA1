'use client'
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer(){
    const [settings, setSettings] = useState({
        site_name: 'Aromi Candle',
        hotline: '1900 xxxx',
        support_email: 'info@aromicandle.vn',
        address: '123 Đường Nguyễn Huệ, Quận 1, TP.HCM'
    });

    useEffect(() => {
        fetch('/api/settings')
            .then(r => r.json())
            .then(data => {
                if (data && !data.error) {
                    setSettings(prev => ({...prev, ...data}));
                }
            })
            .catch(e => console.log(e));
    }, []);

    return(
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-section">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem", 
                marginBottom: "1rem",
                }}>
              <div
                style={{
                  padding: "0",
                  borderRadius: "0.5rem",
                  background: 'transparent'
                }}>
                <img 
                  src="/images/candle-logo.png" 
                  alt={`${settings.site_name} Logo`}
                  style={{ width: 48, height: 48, objectFit: 'contain' }}
                />
              </div>
              <h3 style={{ textTransform: 'uppercase' }}>{settings.site_name}</h3>
            </div>
            <p>
              Mang đến những mùi hương tự nhiên, tạo không gian thư giãn và ấm
              cúng cho ngôi nhà của bạn.
            </p>
          </div>

          <div className="footer-section">
            <h4>Liên Kết Nhanh</h4>
            <ul>
              <li><Link href="/">Trang Chủ</Link></li>
              <li><Link href="/products">Sản Phẩm</Link></li>
              <li><Link href="/blog">Bài Viết</Link></li>
              <li><Link href="/about">Về Chúng Tôi</Link></li>
              <li><Link href="/contact">Liên Hệ</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Hỗ Trợ Khách Hàng</h4>
            <ul>
              <li><Link href="/contact">Chính Sách Đổi Trả</Link></li>
              <li><Link href="/products">Hướng Dẫn Mua Hàng</Link></li>
              <li><Link href="/about">Câu Hỏi Thường Gặp</Link></li>
              <li><Link href="/contact">Chính Sách Bảo Mật</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Liên Hệ</h4>
            <p>📍 {settings.address}</p>
            <p>📞 {settings.hotline}</p>
            <p>✉️ {settings.support_email}</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p style={{color: "#9ca3af", fontSize: "0.875rem"}}>
            © {new Date().getFullYear()} {settings.site_name}. Bảo lưu mọi quyền.
          </p>
        </div>
      </div>
    </footer>
    )
}