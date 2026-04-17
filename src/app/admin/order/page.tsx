'use client';

import { useEffect, useState } from "react";

// Thứ tự các trạng thái - chỉ được đi tiến, không được lùi
const STATUS_FLOW = ['pending', 'processing', 'shipped', 'delivered'];
const STATUS_LABELS: Record<string, string> = {
    pending: 'Chờ xác nhận',
    processing: 'Đang xử lý',
    shipped: 'Đang giao hàng',
    delivered: 'Đã giao thành công',
    cancelled: 'Đã hủy',
};
const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    pending:    { bg: '#fef3c7', color: '#d97706' },
    processing: { bg: '#e0e7ff', color: '#4f46e5' },
    shipped:    { bg: '#dbeafe', color: '#2563eb' },
    delivered:  { bg: '#dcfce7', color: '#16a34a' },
    cancelled:  { bg: '#fee2e2', color: '#dc2626' },
};

function getNextStatus(current: string): string | null {
    const idx = STATUS_FLOW.indexOf(current);
    if (idx === -1 || idx >= STATUS_FLOW.length - 1) return null;
    return STATUS_FLOW[idx + 1];
}

export default function OrderAdmin() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewOrder, setViewOrder] = useState<any | null>(null);
    const [confirmNext, setConfirmNext] = useState<{ order: any; nextStatus: string } | null>(null);
    const [confirmCancel, setConfirmCancel] = useState<any | null>(null);
    const [updating, setUpdating] = useState<number | null>(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [search, setSearch] = useState('');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/order');
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setOrders(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
            }
        } catch (error) {
            console.error("Fetch order error", error);
        }
        setLoading(false);
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleAdvanceStatus = async () => {
        if (!confirmNext) return;
        setUpdating(confirmNext.order.id);
        try {
            const res = await fetch('/api/order', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: confirmNext.order.id, status: confirmNext.nextStatus })
            });
            if (res.ok) { setConfirmNext(null); fetchOrders(); }
            else alert('Cập nhật thất bại!');
        } catch { alert('Lỗi kết nối!'); }
        setUpdating(null);
    };

    const handleCancelOrder = async () => {
        if (!confirmCancel) return;
        setUpdating(confirmCancel.id);
        try {
            const res = await fetch('/api/order', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: confirmCancel.id, status: 'cancelled' })
            });
            if (res.ok) { setConfirmCancel(null); fetchOrders(); }
            else alert('Cập nhật thất bại!');
        } catch { alert('Lỗi kết nối!'); }
        setUpdating(null);
    };

    const formatMoney = (val: number) => new Intl.NumberFormat('vi-VN').format(val || 0) + 'đ';
    const formatDate = (d: string) => {
        const date = new Date(d);
        return `${String(date.getDate()).padStart(2,'0')}/${String(date.getMonth()+1).padStart(2,'0')}/${date.getFullYear()} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
    };

    const statusBadge = (status: string) => {
        const s = STATUS_COLORS[status] || { bg: '#f1f5f9', color: '#64748b' };
        return (
            <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color }}>
                {STATUS_LABELS[status] || status}
            </span>
        );
    };

    const filtered = orders.filter(o => {
        if (filterStatus !== 'all' && o.status !== filterStatus) return false;
        if (search.trim()) {
            const q = search.toLowerCase();
            return (o.order_code || '').toLowerCase().includes(q) || (o.recipient_name || '').toLowerCase().includes(q);
        }
        return true;
    });

    return (
        <div className="content-padding">
            <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Quản lý đơn hàng</h2>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <input
                            placeholder="Tìm mã đơn / tên khách..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 13, width: 220 }}
                        />
                        <select
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 13 }}
                        >
                            <option value="all">Tất cả trạng thái</option>
                            {Object.entries(STATUS_LABELS).map(([k, v]) => (
                                <option key={k} value={k}>{v}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Đang tải dữ liệu...</div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Mã đơn</th>
                                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Khách hàng</th>
                                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Tổng tiền</th>
                                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Thanh toán</th>
                                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Ngày đặt</th>
                                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Trạng thái</th>
                                    <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 600, color: '#374151' }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 && (
                                    <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: '#9ca3af' }}>Không có đơn hàng nào</td></tr>
                                )}
                                {filtered.map(order => {
                                    const next = getNextStatus(order.status);
                                    const canCancel = order.status !== 'delivered' && order.status !== 'cancelled';
                                    return (
                                        <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '10px 14px', fontWeight: 700, color: '#1e293b' }}>{order.order_code}</td>
                                            <td style={{ padding: '10px 14px' }}>
                                                <div style={{ fontWeight: 500 }}>{order.recipient_name}</div>
                                                <div style={{ fontSize: 12, color: '#6b7280' }}>{order.recipient_phone}</div>
                                            </td>
                                            <td style={{ padding: '10px 14px' }}>
                                                <div style={{ fontSize: 12, color: '#6b7280' }}>Gốc: {formatMoney(order.original_amount ?? order.total_amount)}</div>
                                                {Number(order.discount_amount) > 0 && (
                                                    <div style={{ fontSize: 12, color: '#ef4444' }}>- Giảm: {formatMoney(order.discount_amount)} <small>({order.coupon_code})</small></div>
                                                )}
                                                <div style={{ fontWeight: 700, color: '#b45309' }}>Thu: {formatMoney(order.total_amount)}</div>
                                            </td>
                                            <td style={{ padding: '10px 14px' }}>
                                                {order.payment_method === 'banking' ? 'Chuyển khoản' : order.payment_method === 'momo' ? 'MoMo' : 'COD'}
                                            </td>
                                            <td style={{ padding: '10px 14px', color: '#64748b', whiteSpace: 'nowrap' }}>{formatDate(order.created_at)}</td>
                                            <td style={{ padding: '10px 14px' }}>{statusBadge(order.status)}</td>
                                            <td style={{ padding: '10px 14px' }}>
                                                <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'nowrap' }}>
                                                    {/* Xem chi tiết */}
                                                    <button
                                                        onClick={() => setViewOrder(order)}
                                                        title="Xem chi tiết"
                                                        style={{ background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, padding: '5px 8px', cursor: 'pointer' }}
                                                    >
                                                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                                        </svg>
                                                    </button>

                                                    {/* Chuyển trạng thái tiếp theo */}
                                                    {next && (
                                                        <button
                                                            onClick={() => setConfirmNext({ order, nextStatus: next })}
                                                            disabled={updating === order.id}
                                                            title={`Chuyển sang: ${STATUS_LABELS[next]}`}
                                                            style={{ background: '#10b981', color: 'white', border: 'none', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}
                                                        >
                                                            {STATUS_LABELS[next]} →
                                                        </button>
                                                    )}

                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal: Xem chi tiết đơn */}
            {viewOrder && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', borderRadius: 14, padding: '2rem', maxWidth: 520, width: '90%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.25rem', textAlign: 'center' }}>Chi tiết đơn hàng</h2>
                        <div style={{ background: '#f8fafc', borderRadius: 8, padding: '1rem', marginBottom: '1.25rem', fontSize: 14 }}>
                            <p style={{ margin: '6px 0' }}><strong>Mã đơn:</strong> {viewOrder.order_code}</p>
                            <p style={{ margin: '6px 0' }}><strong>Khách hàng:</strong> {viewOrder.recipient_name}</p>
                            <p style={{ margin: '6px 0' }}><strong>Điện thoại:</strong> {viewOrder.recipient_phone}</p>
                            <p style={{ margin: '6px 0' }}><strong>Địa chỉ:</strong> {viewOrder.shipping_address}</p>
                            <p style={{ margin: '6px 0' }}><strong>Thanh toán:</strong> {viewOrder.payment_method === 'banking' ? 'Chuyển khoản' : viewOrder.payment_method === 'momo' ? 'Ví MoMo' : 'Tiền mặt khi nhận (COD)'}</p>
                            <p style={{ margin: '6px 0' }}><strong>Trạng thái:</strong> {statusBadge(viewOrder.status)}</p>
                            <p style={{ margin: '6px 0' }}><strong>Tiền gốc:</strong> {formatMoney(viewOrder.original_amount ?? viewOrder.total_amount)}</p>
                            {Number(viewOrder.discount_amount) > 0 && (
                                <p style={{ margin: '6px 0', color: '#ef4444' }}><strong>Giảm giá ({viewOrder.coupon_code}):</strong> -{formatMoney(viewOrder.discount_amount)}</p>
                            )}
                            <p style={{ margin: '6px 0', color: '#b45309', fontSize: 16 }}><strong>Tổng thu:</strong> {formatMoney(viewOrder.total_amount)}</p>
                        </div>
                        {viewOrder.items && viewOrder.items.length > 0 && (
                            <div style={{ marginBottom: '1.25rem' }}>
                                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Sản phẩm đặt mua</h3>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
                                    <thead style={{ background: '#f3f4f6' }}>
                                        <tr>
                                            <th style={{ padding: '8px 10px', textAlign: 'left' }}>Sản phẩm</th>
                                            <th style={{ padding: '8px 10px', textAlign: 'center' }}>SL</th>
                                            <th style={{ padding: '8px 10px', textAlign: 'right' }}>Giá</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {viewOrder.items.map((item: any) => (
                                            <tr key={item.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                                <td style={{ padding: '8px 10px' }}>{item.product_name || `SP #${item.product_id}`}</td>
                                                <td style={{ padding: '8px 10px', textAlign: 'center' }}>x{item.quantity}</td>
                                                <td style={{ padding: '8px 10px', textAlign: 'right', color: '#b45309' }}>{formatMoney(item.price)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <button onClick={() => setViewOrder(null)} style={{ width: '100%', padding: '0.75rem', background: '#1e293b', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                            Đóng
                        </button>
                    </div>
                </div>
            )}

            {/* Modal: Xác nhận chuyển trạng thái */}
            {confirmNext && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', borderRadius: 14, padding: '2rem', maxWidth: 420, width: '90%', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
                        <div style={{ width: 56, height: 56, background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                            <svg fill="none" stroke="#10b981" viewBox="0 0 24 24" style={{ width: 28, height: 28 }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/>
                            </svg>
                        </div>
                        <h2 style={{ fontSize: '1.15rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>Xác nhận cập nhật trạng thái?</h2>
                        <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: 14, lineHeight: 1.6 }}>
                            Đơn <strong>{confirmNext.order.order_code}</strong> sẽ được chuyển sang:<br/>
                            <span style={{ color: '#10b981', fontWeight: 700, fontSize: 15 }}>{STATUS_LABELS[confirmNext.nextStatus]}</span><br/>
                            <small style={{ color: '#9ca3af' }}>Lưu ý: Không thể hoàn tác về trạng thái cũ.</small>
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button onClick={() => setConfirmNext(null)} style={{ flex: 1, padding: '0.7rem', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
                                Hủy bỏ
                            </button>
                            <button onClick={handleAdvanceStatus} disabled={!!updating} style={{ flex: 1, padding: '0.7rem', background: '#10b981', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                                {updating ? 'Đang cập nhật...' : 'Xác nhận'}
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}