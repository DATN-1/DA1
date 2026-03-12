import "../../style/contact.css";

export default function ContactPage() {
    return (
        <div>
             <section className="contact-hero">
        <div className="container">
            <h1>Liên Hệ Với Chúng Tôi</h1>
            <p>Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn</p>
        </div>
    </section>

    <main className="contact-main">
        <div className="container">
            <div className="contact-grid">
                {/* Contact Information */}
                <aside className="info-sidebar">
                    <div className="info-card address">
                        <div className="info-icon">
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div className="info-text">
                            <h3>Địa Chỉ</h3>
                            <p>123 Đường Nguyễn Huệ<br/>Quận 1, TP. Hồ Chí Minh</p>
                        </div>
                    </div>

                    <div className="info-card phone">
                        <div className="info-icon">
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <div className="info-text">
                            <h3>Điện Thoại</h3>
                            <p>Hotline: 1900 xxxx<br/>Mobile: 0901 234 567</p>
                        </div>
                    </div>

                    <div className="info-card email">
                        <div className="info-icon">
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="info-text">
                            <h3>Email</h3>
                            <p>info@aromicandle.vn<br/>support@aromicandle.vn</p>
                        </div>
                    </div>

                    <div className="info-card hours">
                        <div className="info-icon">
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="info-text">
                            <h3>Giờ Làm Việc</h3>
                            <p>Thứ 2 - Thứ 6: 8:00 - 18:00<br/>Thứ 7 - CN: 9:00 - 17:00</p>
                        </div>
                    </div>

                    <div className="social-card">
                        <h3>Kết Nối Với Chúng Tôi</h3>
                        <div className="social-icons-row">
                            <a href="#" className="social-icon-btn">FB</a>
                            <a href="#" className="social-icon-btn">IG</a>
                            <a href="#" className="social-icon-btn">TW</a>
                        </div>
                    </div>
                </aside>

                {/* <!-- Contact Form --> */}
                <div className="form-card">
                    <h2>Gửi Tin Nhắn Cho Chúng Tôi</h2>
                    <form id="contactForm" className="contact-form-inner">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Họ và Tên *</label>
                                <input type="text" className="form-input" placeholder="Nguyễn Văn A" required/>
                            </div>
                            <div className="form-group">
                                <label>Email *</label>
                                <input type="email" className="form-input" placeholder="email@example.com" required/>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Số Điện Thoại</label>
                                <input type="tel" className="form-input" placeholder="0901 234 567"/>
                            </div>
                            <div className="form-group">
                                <label>Chủ Đề</label>
                                <select className="form-select">
                                    <option value="">Chọn chủ đề</option>
                                    <option value="product">Thông tin sản phẩm</option>
                                    <option value="order">Đặt hàng</option>
                                    <option value="support">Hỗ trợ</option>
                                    <option value="other">Khác</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Tin Nhắn *</label>
                            <textarea className="form-textarea" placeholder="Nhập nội dung tin nhắn của bạn..." required></textarea>
                        </div>

                        <button type="submit" className="submit-btn">Gửi Tin Nhắn</button>
                    </form>
                </div>
            </div>

            {/* <!-- Map Section --> */}
            <div className="map-section">
                <h2>Vị Trí Cửa Hàng</h2>
                <div className="map-placeholder">
                    <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{marginBottom: "1rem"}}>
                        <path strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <p style={{fontWeight: "600", fontSize: "1.125rem"}}>123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</p>
                    <p>Bản đồ sẽ được tích hợp tại đây</p>
                </div>
            </div>
        </div>
    </main>
        </div>
    );
}