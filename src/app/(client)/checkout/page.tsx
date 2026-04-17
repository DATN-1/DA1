'use client';

import Link from "next/link";
import "@/style/pay.css";
import useCartControllers from "@/app/(client)/cart/useCartControllers";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CheckoutPayment from "./checkout";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, handleClearSelectedCart } = useCartControllers();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [shippingFee, setShippingFee] = useState(0);

  // Sản phẩm được chọn từ giỏ hàng
  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);

  // Coupon states
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);
  const [showCoupons, setShowCoupons] = useState(false);

  // Order UI states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successQR, setSuccessQR] = useState<string | null>(null);
  const [orderCode, setOrderCode] = useState("");
  const [showPaymentScreen, setShowPaymentScreen] = useState(false);
  const [finalAmount, setFinalAmount] = useState(0);

  // Tính tổng tiền từ các sản phẩm được chọn
  const selectedTotal = checkoutItems.reduce((sum: number, i: any) => sum + i.totalPrice, 0);
  const effectiveTotal = selectedTotal - discountAmount;
  const effectiveShippingFee = effectiveTotal < 500000 && checkoutItems.length > 0 ? 30000 : 0;
  const grandTotal = effectiveTotal + effectiveShippingFee;

  useEffect(() => {
    setShippingFee(effectiveShippingFee);
  }, [effectiveShippingFee]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      address: ""
  });


  useEffect(() => {
    setMounted(true);
    // Lấy danh sách Tỉnh/Thành Phố khi vừa mở trang
    fetch('/api/provinces')
      .then(res => res.json())
      .then(data => setProvinces(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching provinces:", err));

    const loadProfile = async () => {
        try {
            const savedUser = window.localStorage.getItem('currentUser');
            setIsLoggedIn(!!savedUser);
            
            if (!savedUser) {
                return;
            }

            if (savedUser) {
                const res = await fetch('/api/auth/profile');
                if (res.ok) {
                    const data = await res.json();
                    if (data.user) {
                        setFormData(prev => ({
                            ...prev,
                            name: data.user.full_name || prev.name,
                            email: data.user.email || prev.email,
                            phone: data.user.phone || prev.phone,
                        }));
                    }
                    if (data.address) {
                        setFormData(prev => ({
                            ...prev,
                            name: data.address.recipient_name || prev.name,
                            phone: data.address.phone || prev.phone,
                            address: data.address.address_line || prev.address,
                        }));
                        if (data.address.province_code) setSelectedProvince(data.address.province_code);
                        if (data.address.district_code) {
                            // Cần chờ district load xong nên set setTimeout nhỏ
                            setTimeout(() => setSelectedDistrict(data.address.district_code), 500); 
                        }
                    }
                }
            }
        } catch (e) {}
    };
    loadProfile();
    // Load sản phẩm được chọn từ localStorage
    try {
      const saved = window.localStorage.getItem('checkoutItems');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCheckoutItems(parsed);
        } else {
          // Fallback: dùng toàn bộ giỏ hàng
          setCheckoutItems(cartItems);
        }
      } else {
        setCheckoutItems(cartItems);
      }
    } catch { setCheckoutItems(cartItems); }
    // Load mã giảm giá đã áp dụng từ giỏ hàng
    try {
      const savedCoupon = window.localStorage.getItem('appliedCoupon');
      if (savedCoupon) {
        const parsed = JSON.parse(savedCoupon);
        if (parsed?.coupon && parsed?.discountAmount) {
          setAppliedCoupon(parsed.coupon);
          setDiscountAmount(parsed.discountAmount);
          setCouponCode(parsed.coupon.code || '');
          setCouponSuccess(`Đã áp dụng mã: ${parsed.coupon.code} - Giảm ${new Intl.NumberFormat('vi-VN').format(parsed.discountAmount)}đ`);
        }
      }
    } catch {}
    fetch('/api/coupons').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setAvailableCoupons(d.filter((c: any) => c.status === 'active'));
    }).catch(() => {});
  }, []);

  // Lấy Quận/Huyện khi chọn một Tỉnh/Thành
  useEffect(() => {
    if (!selectedProvince) {
      setDistricts([]);
      setSelectedDistrict("");
      return;
    }
    fetch(`/api/provinces/${selectedProvince}`)
      .then(res => res.json())
      .then(data => {
        setDistricts(data.districts || []);
        setSelectedDistrict("");
      })
      .catch(err => console.error("Error fetching districts:", err));
  }, [selectedProvince]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!mounted || checkoutItems.length === 0) {
      return alert("Vui lòng chọn ít nhất một sản phẩm!");
    }

    const eventFormData = new FormData(e.currentTarget);
    const customerName = eventFormData.get('name')?.toString().trim() || '';
    const customerPhone = eventFormData.get('phone')?.toString().trim() || '';
    const pName = provinces.find(p => p.code == selectedProvince)?.name || "";
    const dName = districts.find(d => d.code == selectedDistrict)?.name || "";
    const fullAddress = `${formData.address}, ${dName}, ${pName}`;

    const payload = {
      recipient_name: customerName,
      recipient_phone: customerPhone,
      shipping_address: fullAddress,
      total_amount: grandTotal,
      original_amount: selectedTotal,
      discount_amount: discountAmount,
      coupon_code: appliedCoupon?.code || null,
      shipping_fee: effectiveShippingFee,
      payment_method: paymentMethod,
      items: checkoutItems.map((item: any) => ({
        id: item.id,
        name: item.name,
        variant: item.variant,
        quantity: item.quantity,
        price: item.price
      }))
    };

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setOrderCode(data.order_code);
        setFinalAmount(grandTotal); // đã bao gồm giảm giá + phí ship
        handleClearSelectedCart(checkoutItems.map((i: any) => i.id));
        setIsModalOpen(true);
      } else {
        alert("Lỗi khi tạo đơn hàng: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi kết nối");
    }
  };

  if (showPaymentScreen) {
    return <CheckoutPayment orderCode={orderCode} amount={finalAmount} />;
  }

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
          <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>
            Hoàn Tất Đơn Hàng
          </h1>

          <form id="checkoutForm" className="checkout-grid" onSubmit={handleSubmit}>
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
                      name="name"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                      placeholder="Nhập họ và tên của bạn"
                      required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                      placeholder="email@example.com"
                      required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Số điện thoại</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-input"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                      placeholder="Số điện thoại của bạn"
                      required />
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">Số nhà, Tên đường, Phường/Xã</label>
                    <input
                      type="text"
                      name="address"
                      className="form-input"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))}
                      placeholder="Số nhà, tên đường, phường/xã..."
                      required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tỉnh / Thành phố</label>
                    <select
                      className="form-input"
                      required
                      value={selectedProvince}
                      onChange={(e) => setSelectedProvince(e.target.value)}
                    >
                      <option value="">Chọn Tỉnh / Thành phố</option>
                      {provinces.map((prov) => (
                        <option key={prov.code} value={prov.code}>{prov.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Quận / Huyện</label>
                    <select
                      className="form-input"
                      required
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      disabled={!selectedProvince}
                    >
                      <option value="">Chọn Quận / Huyện</option>
                      {districts.map((dist) => (
                        <option key={dist.code} value={dist.code}>{dist.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group full-width" style={{ marginBottom: '0' }}>
                    <label className="form-label">Ghi chú đơn hàng (tùy chọn)</label>
                    <textarea
                      className="form-input"
                      style={{ height: '100px', resize: 'none' }}
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
                  <label className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`} htmlFor="payment-cod">
                    <input type="radio" name="payment" id="payment-cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
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
                      <span className="payment-name">Thanh toán khi nhận hàng (COD)</span>
                      <span className="payment-desc">Thanh toán bằng tiền mặt khi shipper giao hàng</span>
                    </div>
                  </label>

                  <label className={`payment-option ${paymentMethod === 'banking' ? 'active' : ''}`} htmlFor="payment-bank">
                    <input type="radio" name="payment" id="payment-bank" checked={paymentMethod === 'banking'} onChange={() => setPaymentMethod('banking')} />
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
                      <span className="payment-desc">Quét mã QR hoặc chuyển khoản qua ứng dụng ngân hàng</span>
                    </div>
                  </label>

                  <label className={`payment-option ${paymentMethod === 'momo' ? 'active' : ''}`} htmlFor="payment-momo">
                    <input type="radio" name="payment" id="payment-momo" checked={paymentMethod === 'momo'} onChange={() => setPaymentMethod('momo')} />
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
                      <span className="payment-desc">Thanh toán nhanh qua ứng dụng MoMo</span>
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
                  {mounted && checkoutItems.length === 0 && (
                    <div style={{ textAlign: "center", padding: "1rem" }}>
                      Chưa có sản phẩm trong giỏ hàng.
                    </div>
                  )}
                  {mounted && checkoutItems.map((item) => {
                    const productImage =
                      typeof item.image === "string"
                        ? (() => {
                          try {
                            const parsed = JSON.parse(item.image);
                            return Array.isArray(parsed) && parsed[0]
                              ? parsed[0]
                              : item.image;
                          } catch {
                            return item.image;
                          }
                        })()
                        : Array.isArray(item.image) && item.image[0]
                          ? item.image[0]
                          : "/images/default-product.png";

                    return (
                      <div className="mini-item" key={item.id}>
                        <img src={productImage} alt={item.name} className="mini-image" />
                        <div className="mini-details">
                          <span className="mini-name">{item.name}</span>
                          <div className="mini-meta">
                            <span>Số lượng: {item.quantity}</span>
                            <span className="font-bold">
                              {new Intl.NumberFormat("vi-VN").format(item.totalPrice)}đ
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="summary-details">
                  {/* Coupon section */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                      <input
                        className="form-input"
                        style={{ flex: 1, padding: '8px 12px', fontSize: 13 }}
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Nhập mã giảm giá..."
                        disabled={!!appliedCoupon}
                      />
                      {appliedCoupon ? (
                        <button type="button" onClick={() => { setAppliedCoupon(null); setDiscountAmount(0); setCouponCode(''); setCouponSuccess(''); }} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 6, padding: '8px 12px', cursor: 'pointer', fontSize: 13, color: '#374151', whiteSpace: 'nowrap' }}>Bỏ mã</button>
                      ) : (
                        <button type="button" onClick={async () => {
                          if (!couponCode.trim()) return;
                          setApplyingCoupon(true); setCouponError(''); setCouponSuccess('');
                          try {
                            const res = await fetch('/api/coupons/validate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: couponCode, orderAmount: selectedTotal }) });
                            const d = await res.json();
                            if (!res.ok) { setCouponError(d.error || 'Mã không hợp lệ'); } else { setAppliedCoupon(d.coupon); setDiscountAmount(d.discountAmount); setCouponSuccess(`Giảm ${new Intl.NumberFormat('vi-VN').format(d.discountAmount)}đ`); }
                          } catch { setCouponError('Lỗi kết nối'); } finally { setApplyingCoupon(false); }
                        }} disabled={applyingCoupon} style={{ background: '#6366f1', color: 'white', border: 'none', borderRadius: 6, padding: '8px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {applyingCoupon ? '...' : 'Áp dụng'}
                        </button>
                      )}
                    </div>
                    {couponError && <div style={{ color: '#e11d48', fontSize: 12, marginBottom: 4 }}>⚠ {couponError}</div>}
                    {couponSuccess && <div style={{ color: '#16a34a', fontSize: 12, marginBottom: 4 }}>✓ {couponSuccess}</div>}
                    {availableCoupons.length > 0 && (
                      <button type="button" onClick={() => setShowCoupons(!showCoupons)} style={{ background: 'none', border: 'none', color: '#6366f1', fontSize: 12, cursor: 'pointer', padding: 0 }}>
                        {showCoupons ? '▴ Ẩn mã' : `▾ Xem ${availableCoupons.length} mã có sẵn`}
                      </button>
                    )}
                    {showCoupons && (
                      <div style={{ marginTop: 6, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', maxHeight: 140, overflowY: 'auto' }}>
                        {availableCoupons.filter(c => !c.min_order_value || selectedTotal >= c.min_order_value).map((c: any) => (
                          <div key={c.code} onClick={() => { setCouponCode(c.code); setShowCoupons(false); }} style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', fontSize: 12 }}>
                            <span style={{ fontWeight: 700, color: '#6366f1', marginRight: 8 }}>{c.code}</span>
                            <span style={{ color: '#374151' }}>{c.description || (c.discount_type === 'percentage' ? `Giảm ${c.discount_value}%` : `Giảm ${Number(c.discount_value).toLocaleString('vi-VN')}đ`)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="summary-line">
                    <span>Tạm tính</span>
                    <span>{mounted ? new Intl.NumberFormat('vi-VN').format(selectedTotal) + 'đ' : '0đ'}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="summary-line" style={{ color: '#16a34a' }}>
                      <span>Giảm giá ({appliedCoupon?.code})</span>
                      <span>-{new Intl.NumberFormat('vi-VN').format(discountAmount)}đ</span>
                    </div>
                  )}
                  <div className="summary-line">
                    <span>Phí vận chuyển</span>
                    <span style={{ color: effectiveShippingFee === 0 ? '#16a34a' : undefined }}>{effectiveShippingFee === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN').format(effectiveShippingFee) + 'đ'}</span>
                  </div>
                  <div className="summary-line total">
                    <span>Tổng cộng</span>
                    <span className="price">{mounted ? new Intl.NumberFormat('vi-VN').format(grandTotal) + 'đ' : '0đ'}</span>
                  </div>
                </div>

                {!isLoggedIn ? (
                  <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <p style={{ color: '#e11d48', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 500 }}>Bạn cần đăng nhập để tiếp tục thanh toán</p>
                    <button
                      type="button"
                      disabled
                      className="btn btn-gradient btn-full place-order-btn"
                      style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                      Đặt Hàng Ngay
                    </button>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-gradient btn-full place-order-btn">
                    Đặt Hàng Ngay
                  </button>
                )}

                <Link
                  href="/cart"
                  className="continue-shopping"
                  style={{ marginTop: '1.5rem' }}>
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
      {isModalOpen && (
        <div id="successModal" className="modal-overlay active" style={{ display: 'flex', zIndex: 9999, background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', opacity: 1, visibility: 'visible' }}>
          <div className="modal-content" style={{ background: 'white', padding: '2rem', borderRadius: '1rem', maxWidth: '500px', width: '90%', textAlign: 'center' }}>
            <div className="success-icon" style={{ width: 64, height: 64, background: '#10b981', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 32, height: 32 }}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 style={{ fontSize: '1.75rem', color: '#111827', marginBottom: '1rem', fontWeight: 'bold' }}>
              Đặt hàng thành công!
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              Mã đơn hàng: <strong>{orderCode}</strong><br />
              Cảm ơn bạn đã tin tưởng Aromi Candle.
            </p>

            {paymentMethod === 'banking' || paymentMethod === 'momo' ? (
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                <Link href="/" className="btn btn-dark" style={{ flex: 1, padding: "1rem" }}>Trang Chủ</Link>
                <button onClick={() => {
                  setIsModalOpen(false);
                  setShowPaymentScreen(true);
                }} className="btn btn-gradient" style={{ flex: 1, padding: "1rem" }}>Thanh Toán Ngay</button>
              </div>
            ) : (
              <Link href="/" className="btn btn-gradient btn-full">Tiếp Tục Mua Sắm</Link>
            )}

          </div>
        </div>
      )}
    </div>
  );
}