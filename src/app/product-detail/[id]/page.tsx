'use client';

import useCartControllers from "@/app/cart/useCartControllers";
import "@/style/product-detail.css";

export default function ProductDetail() {
    const { addToCart: cartAddToCart } = useCartControllers();
    
    return (
    <div>
        <div className="breadcrumb">
        <div className="container">
            <a href="index.html">Trang Chủ</a>
            <span>/</span>
            <a href="products.html">Sản Phẩm</a>
            <span>/</span>
            <span id="product-name-breadcrumb">Chi Tiết</span>
        </div>
    </div>

    {/* <!-- Product Detail Section --> */}
    <section style={{padding: "3rem 0", background: "linear-gradient(135deg, #fef3c7, #ffe4e6)"}}>
        <div className="container">
            <div className="product-detail-container">
                {/* <!-- Image Gallery --> */}
                <div className="product-gallery">
                    <div className="main-image-container">
                        <img id="main-image" src="../images/lavender.jpg" alt="Product" className="main-product-image" />
                        <div className="product-badge-detail" id="product-badge">New</div>
                    </div>
                    <div className="thumbnail-container">
                        <img src="../images/lavender.jpg" alt="Thumbnail 1" className="thumbnail active" onClick={() => {}} />
                        <img src="../images/vanilla.jpg" alt="Thumbnail 2" className="thumbnail" onClick={() => {}} />
                        <img src="../images/rose.jpg" alt="Thumbnail 3" className="thumbnail" onClick={() => {}} />
                        <img src="../images/ocean.jpg" alt="Thumbnail 4" className="thumbnail" onClick={() => {}} />
                    </div>
                </div>

                {/* <!-- Product Info --> */}
                <div className="product-detail-info">
                    <h1 id="product-title" className="product-detail-title">Lavender Bliss</h1>
                    
                    <div className="product-meta">
                        <div className="rating-large">
                            <div className="stars">
                                <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                            </div>
                            <span className="rating-text">(4.9 - 128 đánh giá)</span>
                        </div>
                        <div className="view-count">
                            <svg width="20" height="20" fill="none" stroke="#6b7280" viewBox="0 0 24 24">
                                <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span id="view-count">1,234</span> lượt xem
                        </div>
                    </div>

                    <div className="price-section">
                        <span className="current-price" id="product-price">350.000đ</span>
                        <span className="original-price">450.000đ</span>
                        <span className="discount-badge">-22%</span>
                    </div>

                    <p id="product-description" className="product-detail-description">
                        Nến thơm Lavender Bliss mang đến hương thơm oải hương nhẹ nhàng, giúp thư giãn tinh thần và cải thiện giấc ngủ. 
                        Được làm từ 100% sáp đậu nành tự nhiên và tinh dầu oải hương nguyên chất.
                    </p>

                    {/* <!-- Stock Status --> */}
                    <div className="stock-info">
                        <span className="stock-label">Tình trạng:</span>
                        <span className="stock-status in-stock" id="stock-status">Còn hàng (<span id="stock-quantity">45</span> sản phẩm)</span>
                    </div>

                    {/* <!-- Quantity Selector --> */}
                    <div className="quantity-section">
                        <label className="quantity-label">Số lượng:</label>
                        <div className="quantity-controls">
                            <button className="qty-btn" onClick={() => {}}>-</button>
                            <input type="number" id="quantity" value="1" min="1" max="45" readOnly />
                            <button className="qty-btn" onClick={() => {}}>+</button>
                        </div>
                        <span className="max-qty-text">Tối đa: <span id="max-qty">45</span> sản phẩm</span>
                    </div>

                    {/* <!-- Action Buttons --> */}
                    <div className="product-actions-detail">
                        <button className="btn btn-gradient btn-large" onClick={() => {}}>
                            <svg width="20" height="20" fill="none" stroke="white" viewBox="0 0 24 24" style={{ marginRight: "0.5rem" }}>
                                <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Thêm Vào Giỏ Hàng
                        </button>
                        <button className="btn btn-dark btn-large" onClick={() => {}}>Mua Ngay</button>
                    </div>

                    {/* <!-- Features --> */}
                    <div className="product-features">
                        <div className="feature-item">
                            <svg width="24" height="24" fill="none" stroke="#059669" viewBox="0 0 24 24">
                                <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Miễn phí vận chuyển cho đơn từ 500k</span>
                        </div>
                        <div className="feature-item">
                            <svg width="24" height="24" fill="none" stroke="#059669" viewBox="0 0 24 24">
                                <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Đổi trả trong vòng 7 ngày</span>
                        </div>
                        <div className="feature-item">
                            <svg width="24" height="24" fill="none" stroke="#059669" viewBox="0 0 24 24">
                                <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth="2" 
                                d="M5 13l4 4L19 7" />
                            </svg>
                            <span>100% nguyên liệu tự nhiên</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Product Tabs --> */}
            <div className="product-tabs">
                <div className="tab-buttons">
                    <button className="tab-btn active" onClick={() => {}}>Mô Tả</button>
                    <button className="tab-btn" onClick={() => {}}>Thông Số</button>
                    <button className="tab-btn" onClick={() => {}}>Đánh Giá (<span id="review-count">128</span>)</button>
                </div>

                <div className="tab-content">
                    {/* <!-- Description Tab --> */}
                    <div id="description-tab" className="tab-pane active">
                        <h3>Mô Tả Sản Phẩm</h3>
                        <p>Nến thơm Lavender Bliss là sự kết hợp hoàn hảo giữa nghệ thuật chế tác thủ công và khoa học hương liệu hiện đại. Mỗi cây nến được đổ thủ công tỉ mỉ, sử dụng 100% sáp đậu nành tự nhiên - một nguồn nguyên liệu bền vững và thân thiện với môi trường.</p>
                        
                        <h4>Đặc điểm nổi bật:</h4>
                        <ul>
                            <li>Hương thơm oải hương Pháp nguyên chất, mang lại cảm giác thư giãn sâu</li>
                            <li>Thời gian cháy: 40-45 giờ</li>
                            <li>Không chứa paraffin, không độc hại</li>
                            <li>Bấc nến làm từ bông tự nhiên, cháy đều và sạch</li>
                            <li>Thiết kế sang trọng, phù hợp làm quà tặng</li>
                        </ul>

                        <h4>Công dụng:</h4>
                        <ul>
                            <li>Giảm căng thẳng, lo âu</li>
                            <li>Cải thiện chất lượng giấc ngủ</li>
                            <li>Tạo không gian thư giãn, ấm cúng</li>
                            <li>Khử mùi tự nhiên</li>
                        </ul>
                    </div>

                    {/* <!-- Specifications Tab --> */}
                    <div id="specifications-tab" className="tab-pane">
                        <h3>Thông Số Kỹ Thuật</h3>
                        <table className="specs-table">
                            <tbody>
                                <tr>
                                    <td className="spec-label">Kích thước:</td>
                                    <td>Đường kính 8cm x Cao 10cm</td>
                                </tr>
                                <tr>
                                    <td className="spec-label">Trọng lượng:</td>
                                    <td>250g</td>
                                </tr>
                                <tr>
                                    <td className="spec-label">Chất liệu:</td>
                                    <td>Sáp đậu nành 100% tự nhiên</td>
                                </tr>
                                <tr>
                                    <td className="spec-label">Hương thơm:</td>
                                    <td>Tinh dầu oải hương Pháp</td>
                                </tr>
                                <tr>
                                    <td className="spec-label">Bấc nến:</td>
                                    <td>Bông tự nhiên</td>
                                </tr>
                                <tr>
                                    <td className="spec-label">Thời gian cháy:</td>
                                    <td>40-45 giờ</td>
                                </tr>
                                <tr>
                                    <td className="spec-label">Xuất xứ:</td>
                                    <td>Việt Nam</td>
                                </tr>
                                <tr>
                                    <td className="spec-label">Hạn sử dụng:</td>
                                    <td>24 tháng kể từ ngày sản xuất</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* <!-- Reviews Tab --> */}
                    <div id="reviews-tab" className="tab-pane">
                        <h3>Đánh Giá Từ Khách Hàng</h3>
                        
                        <div className="review-summary">
                            <div className="review-score">
                                <div className="score-number">4.9</div>
                                <div className="stars">
                                    <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                    <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                    <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                    <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                    <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                </div>
                                <div className="total-reviews">128 đánh giá</div>
                            </div>
                        </div>

                        <div className="reviews-list">
                            <div className="review-item">
                                <div className="review-header">
                                    <div className="reviewer-info">
                                        <div className="reviewer-avatar">N</div>
                                        <div>
                                            <div className="reviewer-name">Nguyễn Thị Mai</div>
                                            <div className="review-date">15/12/2024</div>
                                        </div>
                                    </div>
                                    <div className="review-rating">
                                        <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                        <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                        <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                        <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                        <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                    </div>
                                </div>
                                <p className="review-text">Sản phẩm rất tuyệt vời! Mùi hương nhẹ nhàng, giúp mình ngủ ngon hơn rất nhiều. Đóng gói cẩn thận, giao hàng nhanh. Sẽ ủng hộ shop lâu dài!</p>
                            </div>

                            <div className="review-item">
                                <div className="review-header">
                                    <div className="reviewer-info">
                                        <div className="reviewer-avatar">T</div>
                                        <div>
                                            <div className="reviewer-name">Trần Văn Hùng</div>
                                            <div className="review-date">10/12/2024</div>
                                        </div>
                                    </div>
                                    <div className="review-rating">
                                        <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                        <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                        <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                        <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                        <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                    </div>
                                </div>
                                <p className="review-text">Chất lượng tốt, mùi thơm dễ chịu không gắt. Cháy đều và lâu. Mua làm quà tặng rất ý nghĩa!</p>
                            </div>

                            <div className="review-item">
                                <div className="review-header">
                                    <div className="reviewer-info">
                                        <div className="reviewer-avatar">L</div>
                                        <div>
                                            <div className="reviewer-name">Lê Thị Hương</div>
                                            <div className="review-date">05/12/2024</div>
                                        </div>
                                    </div>
                                    <div className="review-rating">
                                        <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                        <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                        <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                        <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                        <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                    </div>
                                </div>
                                <p className="review-text">Rất hài lòng với sản phẩm. Thiết kế đẹp, sang trọng. Hương thơm dễ chịu, không quá nồng. Giá cả hợp lý!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <!-- Related Products --> */}
            <div className="related-products">
                <h2 className="section-title">Sản Phẩm Liên Quan</h2>
                <div className="products-grid">
                    <div className="product-card">
                        <div className="product-image-container">
                            <img src="../images/vanilla.jpg" alt="Vanilla Dream" className="product-image" />
                        </div>
                        <div className="product-info">
                            <h3 className="product-name">Vanilla Dream</h3>
                            <p className="product-description">Hương vani ngọt ngào</p>
                            <div className="product-footer">
                                <span className="product-price">280.000đ</span>
                                <div className="rating">
                                    <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                    <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                    <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                    <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                    <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                </div>
                            </div>
                            <a href="product-detail.html?id=2" className="btn btn-gradient btn-full">Xem Chi Tiết</a>
                        </div>
                    </div>

                    <div className="product-card">
                        <div className="product-image-container">
                            <img src="../images/rose.jpg" alt="Rose Garden" className="product-image" />
                        </div>
                        <div className="product-info">
                            <h3 className="product-name">Rose Garden</h3>
                            <p className="product-description">Hương hoa hồng quyến rũ</p>
                            <div className="product-footer">
                                <span className="product-price">420.000đ</span>
                                <div className="rating">
                                    <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                    <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                    <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                    <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                    <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                </div>
                            </div>
                            <a href="product-detail.html?id=3" className="btn btn-gradient btn-full">Xem Chi Tiết</a>
                        </div>
                    </div>

                    <div className="product-card">
                        <div className="product-image-container">
                            <img src="../images/ocean.jpg" alt="Ocean Breeze" className="product-image" />
                        </div>
                        <div className="product-info">
                            <h3 className="product-name">Ocean Breeze</h3>
                            <p className="product-description">Hương biển cả tươi mát</p>
                            <div className="product-footer">
                                <span className="product-price">320.000đ</span>
                                <div className="rating">
                                    <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                    <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                    <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                    <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                    <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                </div>
                            </div>
                            <a href="product-detail.html?id=4" className="btn btn-gradient btn-full">Xem Chi Tiết</a>
                        </div>
                    </div>

                    <div className="product-card">
                        <div className="product-image-container">
                            <img src="../images/jasmine.jpg" alt="Jasmine Night" className="product-image" />
                        </div>
                        <div className="product-info">
                            <h3 className="product-name">Jasmine Night</h3>
                            <p className="product-description">Hương hoa nhài dịu dàng</p>
                            <div className="product-footer">
                                <span className="product-price">380.000đ</span>
                                <div className="rating">
                                    <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                    <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                    <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                    <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                    <svg className="star" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                                </div>
                            </div>
                            <a href="product-detail.html?id=6" className="btn btn-gradient btn-full">Xem Chi Tiết</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </div>
    );
}