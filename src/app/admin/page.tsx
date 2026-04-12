'use client';
import { useEffect, useState } from 'react';

export default function Admin() {

    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/products?sort=popular&limit=all')
            .then(res => res.json())
            .then(data => {
              const danhsachsanpham = 
              Array.isArray(data) ? data :
              Array.isArray(data?.products) ? data.products : 
              Array.isArray(data?.products?.products) ? data.products.products : [];
              setProducts(danhsachsanpham);
            })
            .catch(err => console.error(err));
    }, []);
    
    return (
       <div className="content-padding">
            {/* Stats */}
            <div className="card-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{background: '#dbeafe', color: '#1e40af'}}>
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <div className="stat-info">
                        <h3>Doanh Thu Tháng</h3>
                        <p>125.400.000đ</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{background: '#d1fae5', color: '#065f46'}}>
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z"/>
                        </svg>
                    </div>
                    <div className="stat-info">
                        <h3>Đơn Hàng Mới</h3>
                        <p>48</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{background: '#fef3c7', color: '#92400e'}}>
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                        </svg>
                    </div>
                    <div className="stat-info">
                        <h3>Khách Hàng</h3>
                        <p>1,250</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{background: '#fee2e2', color: '#991b1b'}}>
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                        </svg>
                    </div>
                    <div className="stat-info">
                        <h3>Đánh giá AVG</h3>
                        <p>4.8 / 5.0</p>
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
                    {products.map((product) => (
                        <div key={product.id} className="top-product-item">
                            <img src={product.image} className="top-product-img"/>
                            <div className="top-product-info">
                                <span className="top-product-name">{product.name}</span>
                                <span className="top-product-sales">{product.stock} sản phẩm còn lại</span>
                            </div>
                            <span className="top-product-price">{product.price}</span>
                        </div>
                    ))}
                    {/* <div className="top-product-item">
                            <img src="../images/vanilla.jpg" className="top-product-img"/>
                            <div className="top-product-info">
                                <span className="top-product-name">Vanilla Dream</span>
                                <span className="top-product-sales">128 lượt bán</span>
                            </div>
                            <span className="top-product-price">280k</span>
                        </div>
                        <div className="top-product-item">
                            <img src="../images/ocean.jpg" className="top-product-img"/>
                            <div className="top-product-info">
                                <span className="top-product-name">Ocean Breeze</span>
                                <span className="top-product-sales">92 lượt bán</span>
                            </div>
                            <span className="top-product-price">320k</span>
                        </div> */}
                </div>

                {/* <!-- Recent Activity --> */}
                <div className="data-card">
                    <div className="card-header">
                        <h2>Hoạt động</h2>
                    </div>
                    <div className="activity-timeline">
                        <div className="activity-item">
                            <div className="activity-dot dot-success"></div>
                            <div className="activity-content">
                                <p><strong>Văn A</strong> đặt đơn #12349</p>
                                <span className="time">2 phút trước</span>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-dot dot-info"></div>
                            <div className="activity-content">
                                <p>Đơn #12345: <strong>Đã giao</strong></p>
                                <span className="time">15 phút trước</span>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-dot dot-warning"></div>
                            <div className="activity-content">
                                <p><strong>Rose Garden</strong> sắp hết</p>
                                <span className="time">1 giờ trước</span>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-dot dot-danger"></div>
                            <div className="activity-content">
                                <p><strong>Đơn #12340</strong>: Yêu cầu hủy đơn từ khách hàng</p>
                                <span className="time">3 giờ trước</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions & Reviews (The "Filler") */}
                <div className="data-card">
                    <div className="card-header">
                        <h2>Thao tác & Đánh giá</h2>
                    </div>
                    <div className="quick-actions-grid">
                        <a href="products.html" className="action-card">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                            </svg>
                            <span>Thêm SP</span>
                        </a>
                        <a href="#" className="action-card">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m0 0l-6-6m6 6H3"/>
                            </svg>
                            <span>Mã giảm</span>
                        </a>
                    </div>
                    <div className="review-list">
                        <div className="review-item">
                            <div className="review-header">
                                <span className="review-user">Mai Lan</span>
                                <div className="review-stars">★★★★★</div>
                            </div>
                            <p className="review-text">Mùi oải hương rất thơm và dễ chịu, đóng gói cẩn thận!</p>
                        </div>
                        <div className="review-item">
                            <div className="review-header">
                                <span className="review-user">Minh Tuấn</span>
                                <div className="review-stars">★★★★☆</div>
                            </div>
                            <p className="review-text">Nến cháy đều, nhưng hũ hơi nhỏ hơn mình tưởng.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Bottom Grid (Shortened Table + Alerts) */}
            <div className="bottom-grid">
                {/* Recent Orders Table */}
                <div className="data-card grid-card">
                    <div className="card-header">
                        <h2>Đơn hàng gần đây</h2>
                        <a href="orders.html" className="btn-view-all">Xem tất cả</a>
                    </div>
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
                            <tr>
                                <td>#12345</td>
                                <td>Nguyễn Văn A</td>
                                <td>10/02/2026</td>
                                <td>630k</td>
                                <td><span className="badge badge-success">Hoàn thành</span></td>
                            </tr>
                            <tr>
                                <td>#12346</td>
                                <td>Trần Thị B</td>
                                <td>10/02/2026</td>
                                <td>420k</td>
                                <td><span className="badge badge-warning">Đang xử lý</span></td>
                            </tr>
                            <tr>
                                <td>#12347</td>
                                <td>Lê Văn C</td>
                                <td>09/02/2026</td>
                                <td>1,25M</td>
                                <td><span className="badge badge-info">Đang giao</span></td>
                            </tr>
                            <tr>
                                <td>#12348</td>
                                <td>Phạm Minh D</td>
                                <td>09/02/2026</td>
                                <td>350k</td>
                                <td><span className="badge badge-danger">Đã hủy</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Low Stock Alerts */}
                <div className="data-card grid-card">
                    <div className="card-header">
                        <h2>Sắp hết hàng</h2>
                    </div>
                    <div className="stock-list">
                        <div className="stock-item">
                            <div className="stock-badge">5</div>
                            <div className="stock-info">
                                <span className="stock-name">Rose Garden (Size M)</span>
                                <span className="stock-count">Tồn kho: 02 hũ</span>
                            </div>
                        </div>
                        <div className="stock-item">
                            <div className="stock-badge">8</div>
                            <div className="stock-info">
                                <span className="stock-name">Ocean Breeze</span>
                                <span className="stock-count">Tồn kho: 04 hũ</span>
                            </div>
                        </div>
                        <div className="stock-item">
                            <div className="stock-badge">2</div>
                            <div className="stock-info">
                                <span className="stock-name">Vanilla Dream</span>
                                <span className="stock-count">Tồn kho: 05 hũ</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}