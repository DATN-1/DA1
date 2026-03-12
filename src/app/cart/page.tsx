'use client';
import Link from "next/link";
import useCartControllers from "./useCartControllers";
import "@/style/cart.css";

export default function Cart() {
    const { cartItems, totalAmount, RemoveItem, UpdateQty, handleClearCart } = useCartControllers();
    
    const handleQuantityChange = (id: string, newQty: number) => {
        if (newQty >= 1) {
            UpdateQty(id, newQty);
        }
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
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                            <button className="remove-btn" onClick={() => handleClearCart()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth="2" 
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Xóa Tất Cả Giỏ Hàng
                            </button>
                        </div>
                        <table className="cart-table">
                            <thead>
                                <tr>
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
                                        <tr key={item.id} className="cart-item" data-price={item.price}>
                                            <td className="item-info">
                                                <img src={typeof item.image === 'string' ? item.image : item.image[0]} alt={item.name} className="item-image" />
                                                <div className="item-details">
                                                    <h3>{item.name}</h3>
                                                    <p>Số lượng:</p>
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
                                                        <path 
                                                        strokeLinecap="round" 
                                                        strokeLinejoin="round" 
                                                        strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} style={{textAlign: 'center', padding: '2rem', color: '#6b7280'}}>
                                            Giỏ hàng trống. <Link href="/products" style={{color: '#d97706', textDecoration: 'underline'}}>Tiếp tục mua sắm</Link>
                                        </td>
                                    </tr>
                                )}
                                {/* Dummy rows - commented out since we're using dynamic data */}
                                {cartItems.length > 0 ? null : (
                                    <>
                                <tr className="cart-item" data-price="350000" style={{display: 'none'}}>
                                    <td className="item-info">
                                        <img src="images/lavender.jpg" alt="Lavender Bliss" className="item-image" />
                                        <div className="item-details">
                                            <h3>Lavender Bliss</h3>
                                            <p>Size: M | 250g</p>
                                        </div>
                                    </td>
                                    <td className="item-price">350.000đ</td>
                                    <td>
                                        <div className="cart-qty">
                                            <button className="qty-btn-sm" onClick={() => UpdateQty('1', 1)}>-</button>
                                            <input type="number" className="qty-input-sm" value="1" min="1" readOnly />
                                            <button className="qty-btn-sm" onClick={() => UpdateQty('1', 2)}>+</button>
                                        </div>
                                    </td>
                                    <td className="item-total" style={{fontWeight: 'bold', color: '#1f2937'}}>350.000đ</td>
                                    <td>
                                        <button className="remove-btn" onClick={() => RemoveItem('1')}>
                                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                                <tr className="cart-item" data-price="280000" style={{display: 'none'}}>
                                    <td className="item-info">
                                        <img src="images/vanilla.jpg" alt="Vanilla Dream" className="item-image" />
                                        <div className="item-details">
                                            <h3>Vanilla Dream</h3>
                                            <p>Size: L | 400g</p>
                                        </div>
                                    </td>
                                    <td className="item-price">280.000đ</td>
                                    <td>
                                        <div className="cart-qty">
                                            <button className="qty-btn-sm" onClick={() => UpdateQty('2', 1)}>-</button>
                                            <input type="number" className="qty-input-sm" value="1" min="1" readOnly />
                                            <button className="qty-btn-sm" onClick={() => UpdateQty('2', 2)}>+</button>
                                        </div>
                                    </td>
                                    <td className="item-total" style={{ fontWeight: 'bold', color: '#1f2937' }}>280.000đ</td>
                                    <td>
                                        <button className="remove-btn" onClick={() => RemoveItem('2')}>
                                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth="2" 
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Order Summary */}
                <aside className="cart-summary">
                    <h2 className="summary-title">Tóm tắt đơn hàng</h2>
                    <div className="summary-row">
                        <span>Tạm tính</span>
                        <span id="subtotal">{new Intl.NumberFormat('vi-VN').format(totalAmount)} VND</span>
                    </div>
                    <div className="summary-row">
                        <span>Phí vận chuyển</span>
                        <span>0đ (Miễn phí)</span>
                    </div>
                    <div className="summary-row">
                        <span>Thuế (VAT)</span>
                        <span>0đ</span>
                    </div>
                    
                    <div className="promo-code">
                        <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Mã giảm giá</label>
                        <div className="promo-input-group">
                            <input type="text" className="promo-input" placeholder="Nhập mã của bạn" />
                            <button className="btn-apply">Áp dụng</button>
                        </div>
                    </div>

                    <div className="summary-row total">
                        <span>Tổng cộng</span>
                        <span className="price" id="totalAmount">{new Intl.NumberFormat('vi-VN').format(totalAmount)} VND</span>
                    </div>

                    <Link href="/checkout" className="btn btn-gradient btn-full checkout-btn" >
                        Tiến Hành Thanh Toán
                    </Link>

                    <Link href="/products" className="continue-shopping">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Tiếp tục mua sắm
                    </Link>
                </aside>
            </div>
        </section>
    </div>
    );
}