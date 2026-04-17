'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type OrderItem = {
    id: number;
    product_name: string;
    product_image: string;
    variant_info: string;
    quantity: number;
    price: number;
};

type Order = {
    id: number;
    order_code: string;
    total_amount: number;
    payment_method: string;
    status: string;
    created_at: string;
    recipient_name: string;
    recipient_phone: string;
    shipping_address: string;
    original_amount?: number;
    discount_amount?: number;
    coupon_code?: string;
    items: OrderItem[];
};

const STATUS_FLOW = ['pending', 'processing', 'shipped', 'delivered'];

const STATUS_INFO: Record<string, { label: string; icon: string; color: string; bg: string; desc: string }> = {
    pending: {
        label: 'Chờ xác nhận',
        icon: '🕐',
        color: '#d97706',
        bg: '#fef3c7',
        desc: 'Đơn hàng đang chờ xác nhận từ cửa hàng',
    },
    processing: {
        label: 'Đang xử lý',
        icon: '📦',
        color: '#4f46e5',
        bg: '#e0e7ff',
        desc: 'Cửa hàng đang chuẩn bị hàng cho bạn',
    },
    shipped: {
        label: 'Đang giao hàng',
        icon: '🚚',
        color: '#2563eb',
        bg: '#dbeafe',
        desc: 'Đơn hàng đang trên đường giao đến bạn',
    },
    delivered: {
        label: 'Đã giao thành công',
        icon: '✅',
        color: '#16a34a',
        bg: '#dcfce7',
        desc: 'Bạn đã nhận được hàng. Cảm ơn bạn đã mua sắm!',
    },
    cancelled: {
        label: 'Đã hủy',
        icon: '❌',
        color: '#dc2626',
        bg: '#fee2e2',
        desc: 'Đơn hàng đã bị hủy',
    },
};

function OrderTimeline({ status }: { status: string }) {
    if (status === 'cancelled') {
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: '#fee2e2', borderRadius: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 20 }}>❌</span>
                <span style={{ color: '#dc2626', fontWeight: 600 }}>Đơn hàng đã bị hủy</span>
            </div>
        );
    }

    const currentIdx = STATUS_FLOW.indexOf(status);
    return (
        <div style={{ padding: '16px 0', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
                {STATUS_FLOW.map((s, idx) => {
                    const info = STATUS_INFO[s];
                    const done = idx <= currentIdx;
                    const active = idx === currentIdx;
                    return (
                        <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                            {/* Connector line */}
                            {idx < STATUS_FLOW.length - 1 && (
                                <div style={{
                                    position: 'absolute',
                                    top: 18,
                                    left: '50%',
                                    width: '100%',
                                    height: 3,
                                    background: done && idx < currentIdx ? '#10b981' : '#e5e7eb',
                                    zIndex: 0,
                                }} />
                            )}
                            {/* Circle */}
                            <div style={{
                                width: 36,
                                height: 36,
                                borderRadius: '50%',
                                background: done ? info.color : '#e5e7eb',
                                color: done ? 'white' : '#9ca3af',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: active ? 18 : 14,
                                fontWeight: 700,
                                zIndex: 1,
                                position: 'relative',
                                boxShadow: active ? `0 0 0 4px ${info.bg}` : 'none',
                                transition: 'all 0.3s',
                            }}>
                                {done ? (idx < currentIdx ? '✓' : info.icon) : idx + 1}
                            </div>
                            {/* Label */}
                            <div style={{ marginTop: 6, fontSize: 11, textAlign: 'center', color: done ? info.color : '#9ca3af', fontWeight: active ? 700 : 400, lineHeight: 1.3 }}>
                                {info.label}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function UserOrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [cancellingId, setCancellingId] = useState<number | null>(null);

    const handleCancelUserOrder = async (orderId: number) => {
        if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) return;
        setCancellingId(orderId);
        try {
            const res = await fetch('/api/order', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: orderId, status: 'cancelled' })
            });
            if (res.ok) {
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
                alert('Hủy đơn hàng thành công!');
            } else {
                alert('Không thể hủy đơn hàng lúc này.');
            }
        } catch (error) {
            console.error('Lỗi khi hủy đơn hàng:', error);
            alert('Đã xảy ra lỗi hệ thống.');
        } finally {
            setCancellingId(null);
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const currentUser = typeof window !== 'undefined' ? window.localStorage.getItem('currentUser') : null;
                if (!currentUser) { router.push('/login'); return; }

                const res = await fetch('/api/orders/user');
                if (!res.ok) {
                    if (res.status === 401) { router.push('/login'); return; }
                    throw new Error('Không thể tải đơn hàng');
                }
                const data = await res.json();
                setOrders(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [router]);

    const formatMoney = (val: number) => new Intl.NumberFormat('vi-VN').format(val || 0) + 'đ';
    const formatDate = (d: string) => new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const paymentLabel = (m: string) => m === 'banking' ? 'Chuyển khoản' : m === 'momo' ? 'Ví MoMo' : 'Tiền mặt khi nhận (COD)';

    const filtered = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

    if (loading) {
        return (
            <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 1rem', textAlign: 'center', color: '#64748b' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
                Đang tải danh sách đơn hàng...
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', background: '#f1f5f9', color: '#475569', textDecoration: 'none', fontSize: 18, transition: '0.2s' }}>
                        ←
                    </Link>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                        🛍️ Đơn hàng của tôi
                    </h1>
                </div>
                <Link href="/profile" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 500, fontSize: 14 }}>
                    Cài đặt tài khoản →
                </Link>
            </div>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {[
                    { key: 'all', label: 'Tất cả' },
                    { key: 'pending', label: '🕐 Chờ xác nhận' },
                    { key: 'processing', label: '📦 Đang xử lý' },
                    { key: 'shipped', label: '🚚 Đang giao' },
                    { key: 'delivered', label: '✅ Đã giao' },
                    { key: 'cancelled', label: '❌ Đã hủy' },
                ].map(tab => {
                    const count = tab.key === 'all' ? orders.length : orders.filter(o => o.status === tab.key).length;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setFilterStatus(tab.key)}
                            style={{
                                padding: '6px 14px',
                                borderRadius: 20,
                                border: '1px solid',
                                borderColor: filterStatus === tab.key ? '#6366f1' : '#e2e8f0',
                                background: filterStatus === tab.key ? '#6366f1' : 'white',
                                color: filterStatus === tab.key ? 'white' : '#374151',
                                fontWeight: filterStatus === tab.key ? 700 : 400,
                                cursor: 'pointer',
                                fontSize: 13,
                            }}
                        >
                            {tab.label} ({count})
                        </button>
                    );
                })}
            </div>

            {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#f8fafc', borderRadius: 16 }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
                    <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '1rem' }}>
                        {filterStatus === 'all' ? 'Bạn chưa có đơn hàng nào.' : 'Không có đơn hàng nào ở trạng thái này.'}
                    </p>
                    <Link href="/products" style={{ display: 'inline-block', padding: '0.75rem 2rem', background: '#6366f1', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
                        Mua sắm ngay
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filtered.map(order => {
                        const info = STATUS_INFO[order.status] || STATUS_INFO['pending'];
                        const isExpanded = expandedId === order.id;
                        return (
                            <div key={order.id} style={{ border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                                {/* Order header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 15 }}>{order.order_code}</div>
                                        <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{formatDate(order.created_at)}</div>
                                    </div>
                                    <span style={{ padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: info.bg, color: info.color }}>
                                        {info.icon} {info.label}
                                    </span>
                                </div>

                                {/* Timeline */}
                                <div style={{ padding: '16px 20px 0' }}>
                                    <OrderTimeline status={order.status} />
                                    {order.status !== 'cancelled' && (
                                        <p style={{ fontSize: 12, color: '#64748b', marginTop: -4, marginBottom: 12, textAlign: 'center' }}>
                                            {info.desc}
                                        </p>
                                    )}
                                </div>

                                {/* Product preview (first 2) */}
                                <div style={{ padding: '0 20px' }}>
                                    {order.items && order.items.slice(0, 2).map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: 12, padding: '10px 0', borderTop: '1px dashed #f1f5f9', alignItems: 'center' }}>
                                            <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0', flexShrink: 0, background: '#f9fafb' }}>
                                                <img
                                                    src={item.product_image || '/images/default-product.png'}
                                                    alt={item.product_name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    onError={(e) => { e.currentTarget.src = '/images/default-product.png'; }}
                                                />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontWeight: 500, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product_name}</div>
                                                {item.variant_info && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{item.variant_info}</div>}
                                                <div style={{ fontSize: 12, color: '#6b7280' }}>Số lượng: {item.quantity}</div>
                                            </div>
                                            <div style={{ fontWeight: 600, fontSize: 14, color: '#e11d48', flexShrink: 0 }}>
                                                {formatMoney(item.price * item.quantity)}
                                            </div>
                                        </div>
                                    ))}
                                    {order.items && order.items.length > 2 && !isExpanded && (
                                        <button onClick={() => setExpandedId(order.id)} style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: 13, padding: '8px 0', width: '100%', textAlign: 'center' }}>
                                            Xem thêm {order.items.length - 2} sản phẩm ▾
                                        </button>
                                    )}
                                    {isExpanded && order.items && order.items.slice(2).map((item, idx) => (
                                        <div key={idx + 2} style={{ display: 'flex', gap: 12, padding: '10px 0', borderTop: '1px dashed #f1f5f9', alignItems: 'center' }}>
                                            <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0', flexShrink: 0, background: '#f9fafb' }}>
                                                <img src={item.product_image || '/images/default-product.png'} alt={item.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = '/images/default-product.png'; }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontWeight: 500, fontSize: 14 }}>{item.product_name}</div>
                                                {item.variant_info && <div style={{ fontSize: 12, color: '#6b7280' }}>{item.variant_info}</div>}
                                                <div style={{ fontSize: 12, color: '#6b7280' }}>Số lượng: {item.quantity}</div>
                                            </div>
                                            <div style={{ fontWeight: 600, fontSize: 14, color: '#e11d48' }}>{formatMoney(item.price * item.quantity)}</div>
                                        </div>
                                    ))}
                                    {isExpanded && (
                                        <button onClick={() => setExpandedId(null)} style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: 13, padding: '8px 0', width: '100%', textAlign: 'center' }}>
                                            Thu gọn ▴
                                        </button>
                                    )}
                                </div>

                                {/* Footer */}
                                <div style={{ padding: '12px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                                    <div style={{ fontSize: 12, color: '#6b7280' }}>
                                        💳 {paymentLabel(order.payment_method)}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                                        {Number(order.discount_amount) > 0 && (
                                            <>
                                                <div style={{ fontSize: 13, color: '#6b7280' }}>Tiền gốc: <span style={{ textDecoration: 'line-through' }}>{formatMoney(order.original_amount ?? order.total_amount)}</span></div>
                                                <div style={{ fontSize: 13, color: '#10b981' }}>- Giảm giá {order.coupon_code ? `(${order.coupon_code})` : ''}: {formatMoney(order.discount_amount)}</div>
                                            </>
                                        )}
                                        <div>
                                            <span style={{ fontSize: 13, color: '#374151' }}>{Number(order.discount_amount) > 0 ? 'Thành tiền: ' : 'Tổng tiền: '}</span>
                                            <span style={{ fontWeight: 700, fontSize: 16, color: '#e11d48' }}>{formatMoney(order.total_amount)}</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Actions Area */}
                                {order.status === 'pending' && (
                                    <div style={{ padding: '0 20px 12px', background: '#f8fafc', borderTop: 'none', display: 'flex', justifyContent: 'flex-end' }}>
                                        <button 
                                            onClick={() => handleCancelUserOrder(order.id)}
                                            disabled={cancellingId === order.id}
                                            style={{ padding: '6px 14px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: '0.2s' }}
                                        >
                                            {cancellingId === order.id ? 'Đang xử lý...' : 'Hủy đơn hàng'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
