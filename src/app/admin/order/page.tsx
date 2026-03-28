'use client';

import { useEffect, useState } from "react";

export default function OrderAdmin() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modals state
    const [viewOrder, setViewOrder] = useState<any | null>(null);
    const [confirmPaymentOrder, setConfirmPaymentOrder] = useState<any | null>(null);
    const [cancelOrder, setCancelOrder] = useState<any | null>(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/order');
            const data = await res.json();
            // Sắp xếp mới nhất lên đầu
            if (Array.isArray(data)) {
                setOrders(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleConfirmPayment = async () => {
        if (!confirmPaymentOrder) return;
        try {
            // Chuyển trạng thái sang đang giao hàng (shipping) sau khi xác nhận thanh toán
            const res = await fetch('/api/order', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: confirmPaymentOrder.id, status: 'shipped', payment_status: 'paid' })
            });
            if (res.ok) {
                setConfirmPaymentOrder(null);
                fetchOrders();
            }
        } catch (error) {
            console.error(error);
            alert("Lỗi cập nhật!");
        }
    };

    const handleCancelOrderSubmit = async () => {
        if (!cancelOrder) return;
        try {
            const res = await fetch('/api/order', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: cancelOrder.id, status: 'cancelled' })
            });
            if (res.ok) {
                setCancelOrder(null);
                fetchOrders();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const renderStatusBadge = (status: string) => {
        if (!status) return <span className="badge" style={{ background: '#fef3c7', color: '#d97706', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>Chưa thanh toán</span>;
        switch (status) {
            case 'pending':
            case 'chưa thanh toán':
                return <span className="badge" style={{ background: '#fef3c7', color: '#d97706', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>Chưa thanh toán</span>;
            case 'shipping':
            case 'shipped':
            case 'processing':
            case 'đang giao hàng':
                return <span className="badge" style={{ background: '#e0e7ff', color: '#059669', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>Đang giao hàng</span>;
            case 'completed':
            case 'delivered':
            case 'hoàn thành':
                return <span className="badge badge-success" style={{ background: '#dcfce3', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>Hoàn thành</span>;
            case 'cancelled':
            case 'đã hủy':
                return <span className="badge badge-danger" style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>Đã hủy</span>;
            default:
                return <span className="badge">{status}</span>;
        }
    };

    const formatMoney = (val: number) => new Intl.NumberFormat('vi-VN').format(val || 0) + 'đ';

    return (
        <div className="content-padding">
            <div className="data-card" style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <div className="card-header" style={{ marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Danh sách đơn hàng</h2>
                </div>
                
                {loading ? (
                    <div>Đang tải dữ liệu...</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
                                <th style={{ padding: '12px' }}>Mã Đơn</th>
                                <th style={{ padding: '12px' }}>Khách Hàng</th>
                                <th style={{ padding: '12px' }}>Tổng Tiền</th>
                                <th style={{ padding: '12px' }}>Thanh Toán</th>
                                <th style={{ padding: '12px' }}>Ngày Đặt</th>
                                <th style={{ padding: '12px' }}>Trạng Thái</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{order.order_code}</td>
                                    <td style={{ padding: '12px' }}>
                                        <div>{order.recipient_name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{order.recipient_phone}</div>
                                    </td>
                                    <td style={{ padding: '12px', color: '#b45309', fontWeight: 'bold' }}>{formatMoney(order.total_amount)}</td>
                                    <td style={{ padding: '12px' }}>{order.payment_method === 'banking' ? 'Chuyển khoản' : order.payment_method === 'momo' ? 'MoMo' : 'COD'}</td>
                                    <td style={{ padding: '12px', fontSize: '0.85rem' }}>{new Date(order.created_at).toLocaleString('vi-VN')}</td>
                                    <td style={{ padding: '12px' }}>{renderStatusBadge(order.status)}</td>
                                    <td style={{ padding: '12px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                        
                                        {/* Action: Xem thông tin */}
                                        <button onClick={() => setViewOrder(order)} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer' }} title="Xem thông tin đơn hàng">
                                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                            </svg>
                                        </button>

                                        {/* Action: Xác nhận thanh toán (chỉ khi pending) */}
                                        {(!order.status || order.status === 'pending' || order.status === 'chưa thanh toán') && (
                                            <button onClick={() => setConfirmPaymentOrder(order)} style={{ background: '#10b981', color: 'white', border: 'none', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer' }} title="Xác nhận khách đã thanh toán">
                                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </button>
                                        )}

                                        {/* Action: Hủy đơn hàng */}
                                        {order.status !== 'completed' && order.status !== 'delivered' && order.status !== 'cancelled' && order.status !== 'hoàn thành' && order.status !== 'đã hủy' && (
                                            <button onClick={() => setCancelOrder(order)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer' }} title="Hủy đơn hàng">
                                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}

                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={7} style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>Chưa có đơn hàng nào</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal Popup: Xem thông tin đơn */}
            {viewOrder && (
                <div style={{ display: 'flex', zIndex: 9999, background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', padding: '2.5rem', borderRadius: '1rem', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto', textAlign: 'left', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center', color: '#111827' }}>Chi Tiết Đơn Hàng</h2>
                        
                        <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                            <p style={{ margin: '8px 0', fontSize: '1.05rem' }}><strong>Mã ĐH:</strong> {viewOrder.order_code}</p>
                            <p style={{ margin: '8px 0' }}><strong>Khách hàng:</strong> {viewOrder.recipient_name}</p>
                            <p style={{ margin: '8px 0' }}><strong>Điện thoại:</strong> {viewOrder.recipient_phone}</p>
                            <p style={{ margin: '8px 0' }}><strong>Địa chỉ:</strong> {viewOrder.shipping_address}</p>
                            <p style={{ margin: '8px 0' }}><strong>Phương thức:</strong> {viewOrder.payment_method === 'banking' ? 'Chuyển khoản VietQR' : viewOrder.payment_method === 'momo' ? 'Ví MoMo' : 'Thanh toán tiền mặt (COD)'}</p>
                            <p style={{ margin: '8px 0', color: '#b45309', fontSize: '1.1rem' }}><strong>Tổng tiền:</strong> {formatMoney(viewOrder.total_amount)}</p>
                        </div>

                        {viewOrder.items && viewOrder.items.length > 0 && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', color: '#374151' }}>Chi tiết sản phẩm</h3>
                                <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                        <thead style={{ background: '#f3f4f6' }}>
                                            <tr>
                                                <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Sản phẩm</th>
                                                <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>SL</th>
                                                <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>Giá</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {viewOrder.items.map((item: any) => (
                                                <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                    <td style={{ padding: '8px' }}>
                                                        <span style={{ fontWeight: '500' }}>{item.product_name || `ID SP: ${item.product_id}`}</span>
                                                    </td>
                                                    <td style={{ padding: '8px', textAlign: 'center' }}>x{item.quantity}</td>
                                                    <td style={{ padding: '8px', textAlign: 'right', color: '#b45309' }}>{formatMoney(item.price)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        <button className="btn btn-dark btn-full" style={{ width: '100%', padding: '1rem', background: '#374151', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setViewOrder(null)}>Đóng</button>
                    </div>
                </div>
            )}

            {/* Modal Popup: Xác nhận thanh toán */}
            {confirmPaymentOrder && (
                <div style={{ display: 'flex', zIndex: 9999, background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', maxWidth: '450px', width: '90%', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ width: 64, height: 64, background: '#ecfdf5', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 32, height: 32 }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>Xác nhận đã thanh toán?</h2>
                        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                            Bạn có chắc chắn khách hàng của đơn <strong>{confirmPaymentOrder.order_code}</strong> đã thanh toán số tiền <strong>{formatMoney(confirmPaymentOrder.total_amount)}</strong> thành công chưa? <br/>Hệ thống sẽ chuyển trạng thái sang đang giao hàng.
                        </p>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button onClick={() => setConfirmPaymentOrder(null)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                                Hủy
                            </button>
                            <button onClick={handleConfirmPayment} style={{ flex: 1, padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' }}>
                                Xác Nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Popup: Xác nhận Hủy Đơn Hàng */}
            {cancelOrder && (
                <div style={{ display: 'flex', zIndex: 9999, background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', maxWidth: '450px', width: '90%', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <div style={{ width: 64, height: 64, background: '#fee2e2', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 32, height: 32 }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>Xác nhận hủy đơn?</h2>
                        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                            Bạn có chắc chắn muốn hủy đơn hàng <strong>{cancelOrder.order_code}</strong> không? Thao tác này sẽ không được hoàn tác và đơn hàng sẽ bị đánh dấu hủy.
                        </p>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button onClick={() => setCancelOrder(null)} style={{ flex: 1, padding: '12px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                                Trở về
                            </button>
                            <button onClick={handleCancelOrderSubmit} style={{ flex: 1, padding: '12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)' }}>
                                Xác Nhận Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}