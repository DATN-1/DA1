'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useCartControllers from "./useCartControllers";
import "@/style/cart.css";

export default function Cart() {
    const { cartItems, RemoveItem, UpdateQty, handleClearCart } = useCartControllers();
    const router = useRouter();

    // ---- Checkbox selection ----
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Mặc định không tick sản phẩm nào cả

    const allChecked = cartItems.length > 0 && cartItems.every(i => selectedIds.has(i.id));
    const someChecked = cartItems.some(i => selectedIds.has(i.id));

    const toggleAll = () => {
        if (allChecked) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(cartItems.map(i => i.id)));
        }
    };

    const toggleItem = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    // ---- Tính tiền chỉ cho sản phẩm được chọn ----
    const selectedItems = cartItems.filter(i => selectedIds.has(i.id));
    const selectedTotal = selectedItems.reduce((sum, i) => sum + i.totalPrice, 0);

    const [couponCode, setCouponCode] = useState('');
    const [couponError, setCouponError] = useState('');
    const [couponSuccess, setCouponSuccess] = useState('');
    const [discountAmount, setDiscountAmount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [applyingCoupon, setApplyingCoupon] = useState(false);

    const shippingFee = (selectedTotal - discountAmount) < 500000 && selectedItems.length > 0 ? 30000 : 0;
    const finalTotal = selectedTotal - discountAmount + shippingFee;

    const [isLoggedIn, setIsLoggedIn] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsLoggedIn(!!window.localStorage.getItem('currentUser'));
        }
    }, []);

    // Tính lại discount khi selectedTotal thay đổi
    useEffect(() => {
        if (appliedCoupon) {
            if (appliedCoupon.discount_type === 'percentage') {
                setDiscountAmount(Math.round((selectedTotal * appliedCoupon.discount_value) / 100));
            } else {
                setDiscountAmount(Math.min(appliedCoupon.discount_value, selectedTotal));
            }
        }
    }, [selectedTotal, appliedCoupon]);

    const handleQuantityChange = (id: string, newQty: number) => {
        if (newQty >= 1) UpdateQty(id, newQty);
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) { setCouponError('Vui lòng nhập mã giảm giá'); return; }
        setApplyingCoupon(true);
        setCouponError('');
        setCouponSuccess('');
        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponCode, orderAmount: selectedTotal }),
            });
            const data = await res.json();
            if (!res.ok) {
                setCouponError(data.error || 'Mã không hợp lệ');
                setAppliedCoupon(null);
                setDiscountAmount(0);
            } else {
                setAppliedCoupon(data.coupon);
                setDiscountAmount(data.discountAmount);
                setCouponSuccess(`Áp dụng thành công! Giảm ${new Intl.NumberFormat('vi-VN').format(data.discountAmount)}đ`);
            }
        } catch {
            setCouponError('Lỗi kết nối, thử lại sau');
        } finally {
            setApplyingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        setCouponCode('');
        setCouponSuccess('');
        setCouponError('');
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
            return;
        }
        if (typeof window !== 'undefined') {
            // Lưu sản phẩm được chọn để checkout dùng
            localStorage.setItem('checkoutItems', JSON.stringify(selectedItems));
            if (appliedCoupon) {
                localStorage.setItem('appliedCoupon', JSON.stringify({ coupon: appliedCoupon, discountAmount }));
            } else {
                localStorage.removeItem('appliedCoupon');
            }
        }
        router.push('/checkout');
    };

    return (
        <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
            <Link href="/" className="text-gray-600 hover:text-gray-900">Trang Chủ</Link>
            <span>/</span>
            <span>Giỏ Hàng</span>
        </div>

        <section className="cart-section">
            <h1 className="section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>Giỏ Hàng Của Bạn</h1>

            <div className="cart-container">
                {/* Shopping Cart List */}
                <div className="cart-content">
                    <div className="cart-items-wrapper">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            {/* Chọn tất cả */}
                            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                                <input
                                    type="checkbox"
                                    checked={allChecked}
                                    ref={el => { if (el) el.indeterminate = !allChecked && someChecked; }}
                                    onChange={toggleAll}
                                    style={{ width: 18, height: 18, accentColor: '#f59e0b', cursor: 'pointer' }}
                                />
                                Chọn tất cả ({selectedIds.size}/{cartItems.length})
                            </label>

                            <button className="remove-btn" onClick={() => handleClearCart()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Xóa Tất Cả
                            </button>
                        </div>
                        <table className="cart-table">
                            <thead>
                                <tr>
                                    <th style={{ width: 40 }}></th>
                                    <th>Sản Phẩm</th>
                                    <th>Giá</th>
                                    <th>Số Lượng</th>
                                    <th>Tạm Tính</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody id="cartTableBody">
                                {cartItems.length > 0 ? (
                                    cartItems.map((item) => (
                                        <tr key={item.id} className="cart-item" data-price={item.price}
                                            style={{ opacity: selectedIds.has(item.id) ? 1 : 0.5, transition: 'opacity 0.2s' }}>
                                            {/* Checkbox */}
                                            <td style={{ textAlign: 'center' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.has(item.id)}
                                                    onChange={() => toggleItem(item.id)}
                                                    style={{ width: 18, height: 18, accentColor: '#f59e0b', cursor: 'pointer' }}
                                                />
                                            </td>
                                            <td className="item-info">
                                                <img src={typeof item.image === 'string' ? item.image : item.image[0]} alt={item.name} className="item-image" />
                                                <div className="item-details">
                                                    <h3>{item.name}</h3>
                                                </div>
                                            </td>
                                            <td className="item-price">{new Intl.NumberFormat('vi-VN').format(item.price)} VND</td>
                                            <td>
                                                <div className="cart-qty">
                                                    <button className="qty-btn-sm" onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                                                    <input type="number" className="qty-input-sm" value={item.quantity} min="1" readOnly />
                                                    <button className="qty-btn-sm" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                                                </div>
                                            </td>
                                            <td className="item-total" style={{fontWeight: 'bold', color: '#1f2937'}}>{new Intl.NumberFormat('vi-VN').format(item.totalPrice)} VND</td>
                                            <td>
                                                <button className="remove-btn" onClick={() => RemoveItem(item.id)}>
                                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} style={{textAlign: 'center', padding: '2rem', color: '#6b7280'}}>
                                            Giỏ hàng trống. <Link href="/products" style={{color: '#d97706', textDecoration: 'underline'}}>Tiếp tục mua sắm</Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Order Summary */}
                <aside className="cart-summary">
                    <h2 className="summary-title">Tóm tắt đơn hàng</h2>

                    {/* Thông tin sản phẩm đã chọn */}
                    <div style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                        Đã chọn <strong style={{ color: '#f59e0b' }}>{selectedItems.length}</strong> / {cartItems.length} sản phẩm
                    </div>

                    <div className="summary-row">
                        <span>Tạm tính</span>
                        <span>{new Intl.NumberFormat('vi-VN').format(selectedTotal)} VND</span>
                    </div>
                    {discountAmount > 0 && (
                        <div className="summary-row" style={{ color: '#10b981' }}>
                            <span>Giảm giá</span>
                            <span>-{new Intl.NumberFormat('vi-VN').format(discountAmount)} VND</span>
                        </div>
                    )}
                    <div className="summary-row">
                        <span>Phí vận chuyển</span>
                        <span style={{ color: shippingFee === 0 ? '#10b981' : 'inherit' }}>
                            {shippingFee === 0 ? 'Miễn phí' : `${new Intl.NumberFormat('vi-VN').format(shippingFee)} VND`}
                        </span>
                    </div>
                    {shippingFee > 0 && (
                        <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>
                            Mua thêm {new Intl.NumberFormat('vi-VN').format(500000 - (selectedTotal - discountAmount))}đ để miễn phí ship
                        </div>
                    )}

                    <div className="summary-row total">
                        <span>Tổng cộng</span>
                        <span className="price" id="totalAmount">{new Intl.NumberFormat('vi-VN').format(finalTotal)} VND</span>
                    </div>

                    {!isLoggedIn ? (
                        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                            <p style={{ color: '#e11d48', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 500 }}>Vui lòng đăng nhập để thanh toán</p>
                            <button className="btn btn-gradient btn-full checkout-btn disabled" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                                Tiến Hành Thanh Toán
                            </button>
                        </div>
                    ) : (
                        <button
                            className={`btn btn-gradient btn-full checkout-btn${selectedItems.length === 0 ? ' disabled' : ''}`}
                            onClick={handleCheckout}
                            disabled={selectedItems.length === 0}
                            style={selectedItems.length === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                        >
                            Tiến Hành Thanh Toán ({selectedItems.length} sản phẩm)
                        </button>
                    )}

                    <Link href="/products" className="continue-shopping">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Tiếp tục mua sắm
                    </Link>
                </aside>
            </div>
        </section>
    </div>
    );
}