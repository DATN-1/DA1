'use client';

import "@/style/contact.css";
import Breadcrumb from "@/app/(client)/components/Breadcrumb";
import { FormEvent, useState } from "react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');
    const [settings, setSettings] = useState({
        hotline: '1900 xxxx',
        support_email: 'info@aromicandle.vn',
        address: '123 Đường Nguyễn Huệ, Quận 1, TP.HCM'
    });

    import('react').then(({ useEffect }) => {
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
    }).catch(()=>{});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('sending');
        setStatusMessage('');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus('error');
                setStatusMessage(data.error || 'Gửi tin nhắn thất bại. Vui lòng thử lại.');
                return;
            }

            setStatus('success');
            setStatusMessage(data.message || 'Gửi tin nhắn thành công!');
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        } catch {
            setStatus('error');
            setStatusMessage('Không thể kết nối đến server. Vui lòng thử lại sau.');
        }
    };

    return (
        <div>
            <div className="container">
                <Breadcrumb items={[
                    { label: "Trang Chủ", href: "/" },
                    { label: "Liên Hệ" }
                ]} />
            </div>
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
                            <p>{settings.address}</p>
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
                            <p>Hotline: {settings.hotline}</p>
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
                            <p>{settings.support_email}</p>
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

                </aside>

                {/* Contact Form */}
                <div className="form-card">
                    <h2>Gửi Tin Nhắn Cho Chúng Tôi</h2>

                    {status === 'success' && (
                        <div className="contact-alert contact-alert-success">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            {statusMessage}
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="contact-alert contact-alert-error">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {statusMessage}
                        </div>
                    )}

                    <form id="contactForm" className="contact-form-inner" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Họ và Tên *</label>
                                <input type="text" name="name" className="form-input" placeholder="Nguyễn Văn A" required value={formData.name} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Email *</label>
                                <input type="email" name="email" className="form-input" placeholder="email@example.com" required value={formData.email} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Số Điện Thoại</label>
                                <input type="tel" name="phone" className="form-input" placeholder="0901 234 567" value={formData.phone} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Chủ Đề</label>
                                <select name="subject" className="form-select" value={formData.subject} onChange={handleChange}>
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
                            <textarea name="message" className="form-textarea" placeholder="Nhập nội dung tin nhắn của bạn..." required value={formData.message} onChange={handleChange}></textarea>
                        </div>

                        <button type="submit" className="submit-btn" disabled={status === 'sending'}>
                            {status === 'sending' ? (
                                <>
                                    <span className="submit-spinner"></span>
                                    Đang gửi...
                                </>
                            ) : 'Gửi Tin Nhắn'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Map Section */}
            <div className="map-section">
                <h2>Vị Trí Cửa Hàng</h2>
                <div style={{ borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', border: '1px solid #e5e7eb' }}>
                    <iframe
                        title="Aromi Store Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4997035870434!2d106.62905527480797!3d10.852179589310955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529919d4da461%3A0x7a5e3b5a5e2c6e0a!2sQTSC%209%20Building!5e0!3m2!1svi!2s!4v1713287000000!5m2!1svi!2s"
                        width="100%"
                        height="420"
                        style={{ border: 0, display: 'block' }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4b5563', fontSize: '0.95rem' }}>
                    <svg width="18" height="18" fill="none" stroke="#f43f5e" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span><strong>QTSC 9 Building</strong>, Đ. Tô Ký, Tân Chánh Hiệp, Trung Mỹ Tây, Hồ Chí Minh, Việt Nam</span>
                </div>
            </div>

        </div>
    </main>
        </div>
    );
}