'use client';

import Link from "next/link";
import "../../style/pay.css";

export default function CheckoutPage() {
    return (
        <div>
            <div className="container">
      {/* <!-- Breadcrumb --> */}
      <div className="breadcrumb">
        <Link href="/" className="text-gray-600 hover:text-gray-900">Trang Chủ</Link>
        <span>/</span>
        <Link href="/cart" className="text-gray-600 hover:text-gray-900">Giỏ Hàng</Link>
        <span>/</span>
        <span>Thanh Toán</span>
      </div>

      <section className="checkout-section">
        <h1 className="section-title" style={{textAlign: 'left', marginBottom: '2rem'}}>
          Hoàn Tất Đơn Hàng
        </h1>

        <form id="checkoutForm" className="checkout-grid">
          {/* Left: Shipping Info */}
          <div className="checkout-left">
            <div className="checkout-card">
              <h2 className="checkout-title">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Thông Tin Giao Hàng
              </h2>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">Họ và tên</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Nhập họ và tên của bạn"
                    required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="email@example.com"
                    required />
                </div>
                <div className="form-group">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="Số điện thoại của bạn"
                    required />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">Địa chỉ nhận hàng</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Số nhà, tên đường, phường/xã..."
                    required />
                </div>
                <div className="form-group">
                  <label className="form-label">Tỉnh / Thành phố</label>
                  <select className="form-input" required>
                    <option value="">Chọn Tỉnh / Thành phố</option>
                    <option value="hcm">TP. Hồ Chí Minh</option>
                    <option value="hn">Hà Nội</option>
                    <option value="dn">Đà Nẵng</option>
                    {/* <!-- Add more as needed --> */}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Quận / Huyện</label>
                  <select className="form-input" required>
                    <option value="">Chọn Quận / Huyện</option>
                  </select>
                </div>
                <div className="form-group full-width" style={{marginBottom: '0'}}>
                  <label className="form-label">Ghi chú đơn hàng (tùy chọn)</label>
                  <textarea
                    className="form-input"
                    style={{height: '100px', resize: 'none'}}
                    placeholder="Lưu ý cho người giao hàng..."></textarea>
                </div>
              </div>
            </div>

          </div>

          {/* <!-- Right: Payment & Summary --> */}
          <aside className="checkout-right">
            <div className="checkout-card">
              <h2 className="checkout-title">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Phương Thức Thanh Toán
              </h2>

              <div className="payment-methods">
                <label className="payment-option active" htmlFor="payment-cod">
                  <input type="radio" name="payment" id="payment-cod" defaultChecked/>
                  <div className="payment-icon">
                    <svg
                      width="24"
                      height="24"
                      fill="none"
                      stroke="#b45309"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="payment-details">
                    <span className="payment-name"
                      >Thanh toán khi nhận hàng (COD)</span
                    >
                    <span className="payment-desc"
                      >Thanh toán bằng tiền mặt khi shipper giao hàng</span
                    >
                  </div>
                </label>

                <label className="payment-option" htmlFor="payment-bank">
                  <input type="radio" name="payment" id="payment-bank" />
                  <div className="payment-icon">
                    <svg
                      width="24"
                      height="24"
                      fill="none"
                      stroke="#2563eb"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div className="payment-details">
                    <span className="payment-name">Chuyển khoản ngân hàng</span>
                    <span className="payment-desc"
                      >Quét mã QR hoặc chuyển khoản qua ứng dụng ngân hàng</span
                    >
                  </div>
                </label>

                <label className="payment-option" htmlFor="payment-momo">
                  <input type="radio" name="payment" id="payment-momo" />
                  <div className="payment-icon">
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        background: '#a50064',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '8px',
                        color: 'white',
                        fontWeight: 'bold',
                      }}>
                      MoMo
                    </div>
                  </div>
                  <div className="payment-details">
                    <span className="payment-name">Ví điện tử MoMo</span>
                    <span className="payment-desc"
                      >Thanh toán nhanh qua ứng dụng MoMo</span
                    >
                  </div>
                </label>
              </div>
            </div>

            <div className="checkout-card">
              <h2 className="checkout-title">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Đơn Hàng
              </h2>


              <div className="order-items" id="checkoutItems">
                {/* <!-- Items will be populated by JS --> */}
                <div className="mini-item">
                  <img src="../images/lavender.jpg" alt="" className="mini-image" />
                  <div className="mini-details">
                    <span className="mini-name">Lavender Bliss</span>
                    <div className="mini-meta">
                      <span>Số lượng: 1</span>
                      <span className="font-bold">350.000đ</span>
                    </div>
                  </div>
                </div>
                <div className="mini-item">
                  <img src="../images/vanilla.jpg" alt="" className="mini-image" />
                  <div className="mini-details">
                    <span className="mini-name">Vanilla Dream</span>
                    <div className="mini-meta">
                      <span>Số lượng: 1</span>
                      <span className="font-bold">280.000đ</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="summary-details">
                <div className="summary-line">
                  <span>Tạm tính</span>
                  <span id="checkoutSubtotal">630.000đ</span>
                </div>
                <div className="summary-line">
                  <span>Phí vận chuyển</span>
                  <span className="text-green-600">Miễn phí</span>
                </div>
                <div className="summary-line">
                  <span>Giảm giá</span>
                  <span>-0đ</span>
                </div>
                <div className="summary-line total">
                  <span>Tổng cộng</span>
                  <span className="price" id="checkoutTotal">630.000đ</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-gradient btn-full place-order-btn">
                Đặt Hàng Ngay
              </button>

              <Link
                href="/cart"
                className="continue-shopping"
                style={{marginTop: '1.5rem'}}>
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay lại giỏ hàng
              </Link>
            </div>
          </aside>
        </form>
      </section>
    </div>

    {/* <!-- Success Modal --> */}
    <div id="successModal" className="modal-overlay">
      <div className="modal-content">
        <div className="success-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 style={{fontSize: '1.75rem', color: '#111827', marginBottom: '1rem'}}>
          Đặt hàng thành công!
        </h2>
        <p style={{color: '#6b7280', marginBottom: '2rem', lineHeight: '1.6'}}>
          Cảm ơn bạn đã tin tưởng Aromi Candle. Chúng tôi sẽ sớm liên hệ để xác
          nhận đơn hàng.
        </p>
        <Link href="/" className="btn btn-gradient btn-full"
          >Quay Lại Trang Chủ </Link>
      </div>
    </div>
        </div>
    );
}