'use client';
import { useEffect, useState, useMemo } from 'react';

type TimePeriod = 'today' | '7days' | '30days' | 'all' | 'custom';

// Chuyển dd/mm/yyyy → yyyy-mm-dd (để dùng trong Date)
function parseDMY(dmy: string): string {
    const parts = dmy.replace(/[^\d]/g, '');
    if (parts.length === 8) {
        return `${parts.slice(4, 8)}-${parts.slice(2, 4)}-${parts.slice(0, 2)}`;
    }
    return '';
}

// yyyy-mm-dd → dd/mm/yyyy
function isoToDMY(iso: string): string {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
}

// Format tự động khi gõ: thêm dấu / sau dd, mm
function autoFormatDMY(raw: string): string {
    const digits = raw.replace(/\D/g, '').slice(0, 8);
    let result = digits;
    if (digits.length > 2) result = digits.slice(0, 2) + '/' + digits.slice(2);
    if (digits.length > 4) result = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4);
    return result;
}

// Component đầu vào ngày có icon lịch
function DatePickerInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
    return (
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
            <input
                type="text"
                placeholder={placeholder || 'dd/mm/yyyy'}
                value={value}
                maxLength={10}
                onChange={(e) => onChange(autoFormatDMY(e.target.value))}
                style={{
                    padding: '0.4rem 2rem 0.4rem 0.5rem',
                    borderRadius: '0.4rem',
                    border: '1px solid #d1d5db',
                    outline: 'none',
                    fontSize: '0.85rem',
                    width: '120px',
                    letterSpacing: '0.05em',
                }}
            />
            {/* Input date ẩn để mở native calendar */}
            <input
                type="date"
                tabIndex={-1}
                onChange={(e) => onChange(isoToDMY(e.target.value))}
                style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    width: '28px',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer',
                    zIndex: 1,
                }}
            />
            {/* Icon lịch hiển thị */}
            <span style={{
                position: 'absolute',
                right: '0.4rem',
                color: '#9ca3af',
                pointerEvents: 'none',
                lineHeight: 1,
                fontSize: '1rem',
            }}>📅</span>
        </div>
    );
}

function formatCurrency(amount: number) {
    if (amount >= 1_000_000) {
        return (amount / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M đ';
    }
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

function isWithinPeriod(dateStr: string, period: TimePeriod, customStart?: string, customEnd?: string): boolean {
    if (period === 'all') return true;
    const date = new Date(dateStr);
    
    if (period === 'custom') {
        if (customStart && customEnd) {
            const start = new Date(customStart);
            start.setHours(0, 0, 0, 0);
            const end = new Date(customEnd);
            end.setHours(23, 59, 59, 999);
            return date >= start && date <= end;
        } else if (customStart) {
            const start = new Date(customStart);
            start.setHours(0, 0, 0, 0);
            return date >= start;
        } else if (customEnd) {
            const end = new Date(customEnd);
            end.setHours(23, 59, 59, 999);
            return date <= end;
        }
        return true;
    }

    const now = new Date();
    if (period === 'today') {
        return date.toDateString() === now.toDateString();
    }
    const diffMs = now.getTime() - date.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (period === '7days') return diffDays <= 7;
    if (period === '30days') return diffDays <= 30;
    return true;
}

const periodLabels: Record<TimePeriod, string> = {
    today: 'Hôm nay',
    '7days': '7 ngày',
    '30days': '30 ngày',
    all: 'Tất cả',
    custom: 'Tuỳ chọn',
};

export default function Admin() {
    const [products, setProducts] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [period, setPeriod] = useState<TimePeriod>('30days');
    // Lưu dạng dd/mm/yyyy để hiển thị
    const [customStart, setCustomStart] = useState<string>('');
    const [customEnd, setCustomEnd] = useState<string>('');
    // Dạng yyyy-mm-dd để dùng trong logic lọc
    const customStartISO = parseDMY(customStart);
    const customEndISO = parseDMY(customEnd);

    useEffect(() => {
        fetch('/api/products?sort=popular&limit=all')
            .then(res => res.json())
            .then(data => {
                const list =
                    Array.isArray(data) ? data :
                        Array.isArray(data?.products) ? data.products :
                            Array.isArray(data?.products?.products) ? data.products.products : [];
                setProducts(list);
            })
            .catch(err => console.error(err));

        fetch('/api/order')
            .then(res => res.json())
            .then(data => setOrders(Array.isArray(data) ? data : []))
            .catch(err => console.error(err));

        fetch('/api/users')
            .then(res => res.json())
            .then(data => setUsers(Array.isArray(data) ? data : []))
            .catch(err => console.error(err));
    }, []);

    const stats = useMemo(() => {
        const filteredOrders = orders.filter(o => {
            const dateField = o.created_at || o.createdAt || '';
            return isWithinPeriod(dateField, period, customStartISO, customEndISO);
        });

        const validOrdersForRevenue = filteredOrders.filter(o =>
            o.status !== 'cancelled' &&
            (o.payment_status === 'paid' || ['delivered', 'completed', 'confirmed', 'shipped'].includes(o.status))
        );
        const revenue = validOrdersForRevenue.reduce((sum: number, o: any) => sum + (Number(o.total_amount) || 0), 0);
        const orderCount = filteredOrders.length;

        const filteredUsers = users.filter(u => {
            const dateField = u.created_at || u.createdAt || '';
            return isWithinPeriod(dateField, period, customStartISO, customEndISO);
        });
        const customerCount = period === 'all' ? users.length : filteredUsers.length;

        const ratedProducts = products.filter(p => Number(p.review_count) > 0);
        const avgRating = ratedProducts.length > 0
            ? ratedProducts.reduce((sum: number, p: any) => sum + Number(p.average_rating || 0), 0) / ratedProducts.length
            : 0;

        return { revenue, orderCount, customerCount, avgRating };
    }, [orders, users, products, period, customStart, customEnd]);

    // Recent orders (latest 5, sorted by date)
    const recentOrders = useMemo(() => {
        return [...orders]
            .sort((a, b) => new Date(b.created_at || b.createdAt || 0).getTime() - new Date(a.created_at || a.createdAt || 0).getTime())
            .slice(0, 4);
    }, [orders]);

    const statusBadge = (status: string) => {
        const map: Record<string, { class: string; label: string }> = {
            pending: { class: 'badge-warning', label: 'Chờ xử lý' },
            confirmed: { class: 'badge-info', label: 'Đã xác nhận' },
            shipping: { class: 'badge-info', label: 'Đang giao' },
            delivered: { class: 'badge-success', label: 'Đã giao' },
            completed: { class: 'badge-success', label: 'Hoàn thành' },
            cancelled: { class: 'badge-danger', label: 'Đã hủy' },
        };
        const info = map[status] || { class: 'badge-warning', label: status };
        return <span className={`badge ${info.class}`}>{info.label}</span>;
    };

    // Low stock products
    const lowStockProducts = useMemo(() => {
        return products
            .filter(p => Number(p.stock) > 0 && Number(p.stock) <= 10)
            .sort((a, b) => Number(a.stock) - Number(b.stock))
            .slice(0, 5);
    }, [products]);

    return (
        <div className="content-padding">
            {/* Period Selector + Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1f2937', margin: 0 }}>Tổng quan</h2>
                    <div style={{ display: 'flex', gap: '0.4rem', background: '#f1f5f9', borderRadius: '0.5rem', padding: '0.25rem' }}>
                        {(Object.keys(periodLabels) as TimePeriod[]).map((key) => (
                            <button
                                key={key}
                                onClick={() => setPeriod(key)}
                                style={{
                                    padding: '0.4rem 0.85rem',
                                    borderRadius: '0.4rem',
                                    border: 'none',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    background: period === key ? 'linear-gradient(135deg, #f59e0b, #f43f5e)' : 'transparent',
                                    color: period === key ? '#fff' : '#6b7280',
                                    boxShadow: period === key ? '0 2px 8px rgba(245,158,11,0.3)' : 'none',
                                }}
                            >
                                {periodLabels[key]}
                            </button>
                        ))}
                    </div>
                </div>

                {period === 'custom' && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>Từ ngày:</label>
                            <DatePickerInput value={customStart} onChange={setCustomStart} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>Đến ngày:</label>
                            <DatePickerInput value={customEnd} onChange={setCustomEnd} />
                        </div>
                    </div>
                )}
            </div>

            <div className="card-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#dbeafe', color: '#1e40af' }}>
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="stat-info">
                        <h3>Doanh Thu</h3>
                        <p>{formatCurrency(stats.revenue)}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#d1fae5', color: '#065f46' }}>
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <div className="stat-info">
                        <h3>Đơn Hàng</h3>
                        <p>{stats.orderCount}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fef3c7', color: '#92400e' }}>
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <div className="stat-info">
                        <h3>Khách Hàng</h3>
                        <p>{stats.customerCount}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#fee2e2', color: '#991b1b' }}>
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                    </div>
                    <div className="stat-info">
                        <h3>Đánh giá AVG</h3>
                        <p>{stats.avgRating > 0 ? stats.avgRating.toFixed(1) + ' / 5.0' : '—'}</p>
                    </div>
                </div>
            </div>

            {/* Dashboard Advanced Grid */}
            <div className="dashboard-grid">
                {/* Top Products */}
                <div className="data-card">
                    <div className="card-header">
                        <h2>Sản phẩm bán chạy</h2>
                        <a href="products.html" className="btn-view-all">Xem tất cả</a>
                    </div>
                    {products.slice(0, 5).map((product) => (
                        <div key={product.id} className="top-product-item">
                            <img src={product.image} className="top-product-img" />
                            <div className="top-product-info">
                                <span className="top-product-name">{product.name}</span>
                                <span className="top-product-sales">{product.stock} sản phẩm còn lại</span>
                            </div>
                            <span className="top-product-price">{formatCurrency(Number(product.price))}</span>
                        </div>
                    ))}
                </div>

                {/* Recent Activity */}
                <div className="data-card">
                    <div className="card-header">
                        <h2>Hoạt động</h2>
                    </div>
                    <div className="activity-timeline">
                        {recentOrders.length === 0 && (
                            <div style={{ padding: '1rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>
                                Chưa có hoạt động nào
                            </div>
                        )}
                        {recentOrders.map((order, idx) => {
                            const dotClass = order.status === 'delivered' || order.status === 'completed' ? 'dot-success'
                                : order.status === 'cancelled' ? 'dot-danger'
                                    : order.status === 'shipping' || order.status === 'confirmed' ? 'dot-info'
                                        : 'dot-warning';
                            const timeAgo = (() => {
                                const diff = Date.now() - new Date(order.created_at || order.createdAt || 0).getTime();
                                const mins = Math.floor(diff / 60000);
                                if (mins < 1) return 'Vừa xong';
                                if (mins < 60) return `${mins} phút trước`;
                                const hours = Math.floor(mins / 60);
                                if (hours < 24) return `${hours} giờ trước`;
                                return `${Math.floor(hours / 24)} ngày trước`;
                            })();
                            return (
                                <div key={order.id || idx} className="activity-item">
                                    <div className={`activity-dot ${dotClass}`}></div>
                                    <div className="activity-content">
                                        <p>Đơn <strong>{order.order_code || `#${order.id}`}</strong>: {
                                            order.status === 'pending' ? 'Đơn hàng mới' :
                                                order.status === 'confirmed' ? 'Đã xác nhận' :
                                                    order.status === 'shipping' ? 'Đang giao hàng' :
                                                        order.status === 'delivered' ? 'Đã giao thành công' :
                                                            order.status === 'completed' ? 'Hoàn thành' :
                                                                order.status === 'cancelled' ? 'Đã hủy' : order.status
                                        } — {formatCurrency(Number(order.total_amount) || 0)}</p>
                                        <span className="time">{timeAgo}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {/* Low Stock Alerts */}
                <div className="data-card grid-card">
                    <div className="card-header">
                        <h2>Sắp hết hàng</h2>
                    </div>
                    <div className="stock-list">
                        {lowStockProducts.length === 0 && (
                            <div style={{ padding: '1rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>
                                Không có sản phẩm nào sắp hết hàng
                            </div>
                        )}
                        {lowStockProducts.map((product) => (
                            <div key={product.id} className="stock-item">
                                <div className="stock-badge">{product.stock}</div>
                                <div className="stock-info">
                                    <span className="stock-name">{product.name}</span>
                                    <span className="stock-count">Tồn kho: {product.stock} sản phẩm</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Orders Table */}
                <div className="data-card" style={{ gridColumn: '1 / -1' }}>
                    <div className="card-header">
                        <h2>Đơn hàng gần đây</h2>
                        <a href="/admin/order" className="btn-view-all">Xem tất cả</a>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Mã Đơn</th>
                                    <th>Khách Hàng</th>
                                    <th>Ngày Đặt</th>
                                    <th>Tổng Tiền</th>
                                    <th>Trạng Thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.length === 0 && (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: 'center', padding: '1.5rem', color: '#9ca3af' }}>
                                            Chưa có đơn hàng
                                        </td>
                                    </tr>
                                )}
                                {recentOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td>{order.order_code || `#${order.id}`}</td>
                                        <td>{order.recipient_name || '—'}</td>
                                        <td>
                                            {order.created_at ? (() => {
                                                const d = new Date(order.created_at);
                                                return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
                                            })() : '—'}
                                        </td>
                                        <td>{formatCurrency(Number(order.total_amount) || 0)}</td>
                                        <td>{statusBadge(order.status)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}