'use client';

import useCartControllers from "@/app/(client)/cart/useCartControllers";
import "@/style/product-detail.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type ProductTab = 'description' | 'specifications' | 'reviews';
type AuthUser = {
    id: number;
    email: string;
    full_name: string | null;
    role: 'admin' | 'customer';
};

function formatPrice(price: number | string | null | undefined) {
    return new Intl.NumberFormat('vi-VN').format(Math.round(Number(price) || 0));
}

function parseImageList(rawImage: unknown) {
    if (Array.isArray(rawImage)) {
        return rawImage.filter((image): image is string => typeof image === 'string' && image.trim().length > 0);
    }

    if (typeof rawImage === 'string' && rawImage.trim()) {
        try {
            const parsed = JSON.parse(rawImage);
            if (Array.isArray(parsed)) {
                return parsed.filter((image): image is string => typeof image === 'string' && image.trim().length > 0);
            }
        } catch {
            return [rawImage];
        }
        return [rawImage];
    }

    return [];
}

function renderStars(rating: number, inactiveClass = '') {
    const rounded = Math.round(rating);
    return Array.from({ length: 5 }, (_, index) => (
        <svg key={index} className={`star ${index >= rounded ? inactiveClass : ''}`.trim()} viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
    ));
}

export default function ProductDetail() {
    const params = useParams();
    const id = params.id as string;
    const { addToCart: cartAddToCart } = useCartControllers();

    const [product, setProduct] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [activeTab, setActiveTab] = useState<ProductTab>('description');
    const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewFeedback, setReviewFeedback] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            return;
        }

        const fetchProduct = async () => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const response = await fetch(`/api/products/${id}`);
                const data = await response.json();

                if (!response.ok) {
                    setProduct(null);
                    setErrorMessage(data?.error || 'Không lấy được sản phẩm');
                    return;
                }

                const fallbackImages = parseImageList(data?.image);
                const gallery = Array.isArray(data?.gallery) && data.gallery.length > 0 ? data.gallery : fallbackImages;

                setProduct({ ...data, gallery });
                setSelectedVariant(data?.variants?.[0] || null);
                setSelectedImage(gallery[0] || '/images/default-product.png');
            } catch {
                setProduct(null);
                setErrorMessage('Lỗi mạng hoặc lỗi hệ thống');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const savedUser = window.localStorage.getItem('currentUser');
        if (!savedUser) {
            setCurrentUser(null);
            return;
        }

        try {
            setCurrentUser(JSON.parse(savedUser));
        } catch {
            setCurrentUser(null);
        }
    }, []);

    useEffect(() => {
        if (!product) {
            return;
        }

        const baseGallery = (product.gallery && product.gallery.length > 0 ? product.gallery : parseImageList(product.image)).slice(0, 4);
        const variantGalleryMap = product?.variantGalleryMap && typeof product.variantGalleryMap === 'object' ? product.variantGalleryMap : {};
        
        // Nếu có ảnh biến thể trong DB và đã chọn biến thể, dùng ảnh riêng của biến thể
        // Nếu không có ảnh biến thể hoặc chưa chọn biến thể, dùng ảnh cơ sở
        const variantImagesExist = product?.variantImagesExist === true;
        const hasSelectedVariantImages = selectedVariant?.id && Array.isArray(variantGalleryMap[selectedVariant.id]) && variantGalleryMap[selectedVariant.id].length > 0;
        
        const nextGallery = (variantImagesExist && hasSelectedVariantImages)
            ? variantGalleryMap[selectedVariant.id]
            : baseGallery;

        if (!nextGallery.length) {
            return;
        }

        if (!selectedImage || !nextGallery.includes(selectedImage)) {
            setSelectedImage(nextGallery[0]);
        }
    }, [product, selectedVariant?.id, selectedImage]);

    if (isLoading) {
        return <div className="container"><div className="loading">Loading...</div></div>;
    }

    if (errorMessage) {
        return <div className="container"><div className="error">{errorMessage}</div></div>;
    }

    if (!product) {
        return <div className="container"><div className="error">Sản phẩm không tồn tại</div></div>;
    }

    const galleryImages = (product.gallery && product.gallery.length > 0 ? product.gallery : parseImageList(product.image)).slice(0, 4);
    const variantGalleryMap = product?.variantGalleryMap && typeof product.variantGalleryMap === 'object' ? product.variantGalleryMap : {};
    const variantImagesExist = product?.variantImagesExist === true;
    const hasSelectedVariantImages = selectedVariant?.id && Array.isArray(variantGalleryMap[selectedVariant.id]) && variantGalleryMap[selectedVariant.id].length > 0;
    
    // Xác định gallery hiển thị: nếu có ảnh biến thể và đã chọn biến thể, dùng ảnh riêng
    // Nếu không, dùng ảnh cơ sở (tất cả biến thể dùng chung)
    const activeGallery = (variantImagesExist && hasSelectedVariantImages)
        ? variantGalleryMap[selectedVariant.id]
        : galleryImages;
    const mainImage = selectedImage || activeGallery[0] || '/images/default-product.png';
    const displayPrice = Number(selectedVariant?.price ?? product?.price ?? 0);
    const originalPrice = Number(product?.price ?? displayPrice);
    const displayStock = Number(selectedVariant?.stock ?? product?.stock ?? 0);
    const maxQty = Math.max(displayStock, 1);
    const averageRating = Number(product?.average_rating ?? 0);
    const reviewCount = Number(product?.review_count ?? product?.reviews?.length ?? 0);
    const relatedProducts = Array.isArray(product?.relatedProducts) ? product.relatedProducts : [];
    const reviews = Array.isArray(product?.reviews) && product.reviews.length > 0
        ? product.reviews
        : [
                {
                    id: 1,
                    reviewer_name: 'Khách hàng Aromi',
                    rating: averageRating > 0 ? Math.round(averageRating) : 5,
                    comment: `${product.name} có mùi hương dễ chịu, phù hợp để thư giãn sau một ngày dài và làm không gian sống ấm cúng hơn.`,
                    created_at: new Date().toISOString(),
                },
                {
                    id: 2,
                    reviewer_name: 'Minh Anh',
                    rating: 5,
                    comment: `Thiết kế đẹp, đóng gói cẩn thận và rất hợp để làm quà tặng. ${product.category_name || 'Sản phẩm'} này dùng trong phòng ngủ hoặc phòng khách đều ổn.`,
                    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                },
            ];

    const canSubmitReview = !!currentUser;

    const specificationRows = [
        ['Thương hiệu', product.brand_name || 'Aromi Candle'],
        ['Danh mục', product.category_name || 'Nến thơm cao cấp'],
        ['Biến thể đang chọn', selectedVariant?.size || product?.weight || 'Tiêu chuẩn'],
        ['Mã sản phẩm', selectedVariant?.sku || product?.slug || `AROMI-${product.id}`],
        ['Tồn kho', `${displayStock} sản phẩm`],
        ['Chất liệu gợi ý', 'Sáp đậu nành thiên nhiên, tinh dầu cao cấp'],
        ['Không gian phù hợp', 'Phòng ngủ, phòng khách, góc làm việc'],
        ['Trải nghiệm mùi hương', `Phù hợp với ${product.name}, tạo cảm giác thư giãn và ấm cúng.`],
    ];

    const descriptionHighlights = [
        `${product.name} thuộc dòng ${product.category_name || 'nến thơm'} với mùi hương được phối để tạo cảm giác thư giãn và sạch không gian.`,
        `Thiết kế phù hợp để sử dụng hằng ngày hoặc làm quà tặng, đặc biệt khi kết hợp cùng không gian phòng ngủ và phòng khách.`,
        `Biến thể ${selectedVariant?.size || product?.weight || 'tiêu chuẩn'} giúp bạn dễ chọn dung tích phù hợp với nhu cầu sử dụng thực tế.`,
    ];

    const handleAddToCart = (goToCart = false) => {
        if (product?.variants?.length > 0 && !selectedVariant) {
            alert('Vui lòng chọn kích cỡ sản phẩm');
            return;
        }

        cartAddToCart(
            {
                id: String(product.id),
                name: product.name,
                price: displayPrice,
                image: activeGallery.length > 0 ? activeGallery : [mainImage],
                variant: selectedVariant
                    ? {
                            id: selectedVariant.id,
                            size: selectedVariant.size,
                            price: Number(selectedVariant.price),
                            sku: selectedVariant.sku,
                        }
                    : undefined,
            },
            quantity,
        );

        if (goToCart) {
            window.location.href = '/cart';
        }
    };

    const handleSubmitReview = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setReviewFeedback(null);

        if (!currentUser?.id) {
            setReviewFeedback('Bạn cần đăng nhập để gửi đánh giá.');
            return;
        }

        if (reviewComment.trim().length < 8) {
            setReviewFeedback('Nội dung đánh giá tối thiểu 8 ký tự.');
            return;
        }

        setReviewSubmitting(true);
        try {
            const response = await fetch(`/api/products/${product.id}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUser.id,
                    rating: reviewRating,
                    comment: reviewComment.trim(),
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                setReviewFeedback(data?.error || 'Không thể gửi đánh giá.');
                return;
            }

            const newReview = data?.review;
            if (newReview) {
                const oldCount = Number(product?.review_count ?? 0);
                const oldAverage = Number(product?.average_rating ?? 0);
                const nextCount = oldCount + 1;
                const nextAverage = ((oldAverage * oldCount) + Number(newReview.rating || 0)) / nextCount;

                setProduct((prev: any) => ({
                    ...prev,
                    reviews: [newReview, ...(Array.isArray(prev?.reviews) ? prev.reviews : [])],
                    review_count: nextCount,
                    average_rating: Number.isFinite(nextAverage) ? nextAverage : oldAverage,
                }));
            }

            setReviewComment('');
            setReviewRating(5);
            setReviewFeedback('Gửi đánh giá thành công. Cảm ơn bạn đã chia sẻ!');
            setActiveTab('reviews');
        } catch {
            setReviewFeedback('Lỗi mạng, vui lòng thử lại.');
        } finally {
            setReviewSubmitting(false);
        }
    };

    return (
        <div>
            <div className="breadcrumb breadcrumb-detail">
                <div className="container breadcrumb-container-left">
                    <nav className="breadcrumb-nav" aria-label="Breadcrumb">
                        <Link href="/" className="breadcrumb-link">Trang Chủ</Link>
                        <span className="breadcrumb-separator">/</span>
                        <Link href="/products" className="breadcrumb-link">Sản Phẩm</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span id="product-name-breadcrumb" className="breadcrumb-current">{product.name || 'Chi Tiết'}</span>
                    </nav>
                </div>
            </div>

            <section className="product-detail-section-shell">
                <div className="container">
                    <div className="product-detail-container">
                        <div className="product-gallery">
                            <div className="main-image-container detail-gallery-left">
                                <img id="main-image" src={mainImage} alt={product.name} className="main-product-image" />
                                <div className="product-badge-detail">{product.is_featured ? 'Featured' : 'New'}</div>
                            </div>
                            <div className="thumbnail-container">
                                {activeGallery.map((image: string, index: number) => (
                                    <button
                                        key={`${image}-${index}`}
                                        type="button"
                                        className={`thumbnail-button ${mainImage === image ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(image)}
                                    >
                                        <img src={image} alt={`${product.name} ${index + 1}`} className={`thumbnail ${mainImage === image ? 'active' : ''}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="product-detail-info">
                            <h1 className="product-detail-title">{product.name}</h1>

                            <div className="product-meta">
                                <div className="rating-large">
                                    <div className="stars">{renderStars(averageRating || 5)}</div>
                                    <span className="rating-text">({(averageRating || 5).toFixed(1)} - {reviewCount} đánh giá)</span>
                                </div>
                                <div className="view-count">
                                    <svg width="20" height="20" fill="none" stroke="#6b7280" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <span>{Math.max(128, reviewCount * 21 || 128)}</span> lượt xem
                                </div>
                            </div>

                            <div className="price-section">
                                <span className="current-price">{formatPrice(displayPrice)}đ</span>
                                {originalPrice > displayPrice && <span className="original-price">{formatPrice(originalPrice)}đ</span>}
                                {originalPrice > displayPrice && (
                                    <span className="discount-badge">-{Math.round(((originalPrice - displayPrice) / originalPrice) * 100)}%</span>
                                )}
                            </div>

                            <p className="product-detail-description">{product.description || `${product.name} mang lại trải nghiệm mùi hương tinh tế, dễ dùng hằng ngày và phù hợp nhiều không gian sống.`}</p>

                            {product?.variants?.length > 0 && (
                                <div className="variants-section">
                                    <label className="variants-label">
                                        Chọn biến thể:
                                        {variantImagesExist && <span style={{ fontSize: '0.85em', color: '#f59e0b', marginLeft: '8px' }}>ℹ️ Có ảnh riêng</span>}
                                    </label>
                                    <div className="variants-options">
                                        {product.variants.map((variant: any) => {
                                            const hasVariantImage = variantGalleryMap[variant.id]?.length > 0;
                                            return (
                                                <button
                                                    key={variant.id}
                                                    type="button"
                                                    className={`variant-option ${selectedVariant?.id === variant.id ? 'active' : ''}`}
                                                    onClick={() => {
                                                        setSelectedVariant(variant);
                                                        setQuantity(1);
                                                    }}
                                                    title={hasVariantImage && variantImagesExist ? 'Biến thể này có ảnh riêng' : 'Biến thể này dùng ảnh cơ sở'}
                                                >
                                                    <span className="variant-size">{variant.size}</span>
                                                    <span className="variant-price">{formatPrice(variant.price)}đ</span>
                                                    <span className="variant-stock">({variant.stock} sản phẩm)</span>
                                                    {hasVariantImage && variantImagesExist && <span style={{ marginLeft: '4px', fontSize: '0.9em' }}>✓</span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="stock-info">
                                <span className="stock-label">Tình trạng:</span>
                                <span className={`stock-status ${displayStock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                    {displayStock > 0 ? `Còn hàng (${displayStock} sản phẩm)` : 'Hết hàng'}
                                </span>
                            </div>

                            <div className="quantity-section">
                                <label className="quantity-label">Số lượng:</label>
                                <div className="quantity-controls">
                                    <button type="button" className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={displayStock <= 0}>-</button>
                                    <input type="number" value={quantity} min="1" max={maxQty} readOnly />
                                    <button type="button" className="qty-btn" onClick={() => setQuantity(Math.min(maxQty, quantity + 1))} disabled={displayStock <= 0}>+</button>
                                </div>
                                <span className="max-qty-text">Tối đa: <span>{maxQty}</span> sản phẩm</span>
                            </div>

                            <div className="product-actions-detail">
                                <button className="btn btn-gradient btn-large" onClick={() => handleAddToCart(false)} disabled={displayStock <= 0}>Thêm Vào Giỏ Hàng</button>
                                <button className="btn btn-dark btn-large" onClick={() => handleAddToCart(true)} disabled={displayStock <= 0}>Mua Ngay</button>
                            </div>

                            <div className="product-features">
                                <div className="feature-item"><span>Miễn phí vận chuyển cho đơn từ 500k</span></div>
                                <div className="feature-item"><span>Đổi trả trong vòng 7 ngày</span></div>
                                <div className="feature-item"><span>100% nguyên liệu tự nhiên</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="product-tabs">
                        <div className="tab-buttons">
                            <button type="button" className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>Mô Tả</button>
                            <button type="button" className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`} onClick={() => setActiveTab('specifications')}>Thông Số</button>
                            <button type="button" className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Đánh Giá ({reviews.length})</button>
                        </div>

                        <div className="tab-content">
                            <div className={`tab-pane ${activeTab === 'description' ? 'active' : ''}`}>
                                <h3>Mô Tả Sản Phẩm</h3>
                                <p>{product.description || `${product.name} là lựa chọn phù hợp cho những ai thích không gian sống có chiều sâu mùi hương và cảm giác thư giãn tự nhiên.`}</p>
                                <h4>Điểm nổi bật</h4>
                                <ul>
                                    {descriptionHighlights.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className={`tab-pane ${activeTab === 'specifications' ? 'active' : ''}`}>
                                <h3>Thông Số Kỹ Thuật</h3>
                                <table className="specs-table">
                                    <tbody>
                                        {specificationRows.map(([label, value]) => (
                                            <tr key={label}>
                                                <td className="spec-label">{label}:</td>
                                                <td>{value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className={`tab-pane ${activeTab === 'reviews' ? 'active' : ''}`}>
                                <h3>Đánh Giá Từ Khách Hàng</h3>
                                <div className="review-summary">
                                    <div className="review-score">
                                        <div className="score-number">{(averageRating || 5).toFixed(1)}</div>
                                        <div className="stars">{renderStars(averageRating || 5)}</div>
                                        <div className="total-reviews">{reviews.length} đánh giá gần nhất</div>
                                    </div>
                                </div>

                                <form className="review-form" onSubmit={handleSubmitReview}>
                                    <h4>Viết đánh giá của bạn</h4>
                                    {!canSubmitReview && (
                                        <p className="review-form-note">
                                            Vui lòng <Link href="/login">đăng nhập</Link> để gửi đánh giá.
                                        </p>
                                    )}
                                    <div className="review-rating-input">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                className={`review-star-btn ${reviewRating >= star ? 'active' : ''}`}
                                                onClick={() => setReviewRating(star)}
                                                disabled={!canSubmitReview || reviewSubmitting}
                                                aria-label={`Chọn ${star} sao`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        className="review-textarea"
                                        value={reviewComment}
                                        onChange={(event) => setReviewComment(event.target.value)}
                                        placeholder="Chia sẻ cảm nhận thực tế của bạn về sản phẩm..."
                                        rows={4}
                                        disabled={!canSubmitReview || reviewSubmitting}
                                    />
                                    <button type="submit" className="btn btn-gradient" disabled={!canSubmitReview || reviewSubmitting}>
                                        {reviewSubmitting ? 'Đang gửi...' : 'Gửi Đánh Giá'}
                                    </button>
                                    {reviewFeedback && (
                                        <p className={`review-feedback ${reviewFeedback.includes('thành công') ? 'success' : 'error'}`}>
                                            {reviewFeedback}
                                        </p>
                                    )}
                                </form>

                                <div className="reviews-list">
                                    {reviews.map((review: any) => {
                                        const reviewerName = review.reviewer_name || 'Khách hàng Aromi';
                                        const initials = reviewerName.split(' ').filter(Boolean).slice(0, 2).map((part: string) => part[0]?.toUpperCase()).join('') || 'A';
                                        return (
                                            <div key={review.id} className="review-item">
                                                <div className="review-header">
                                                    <div className="reviewer-info">
                                                        <div className="reviewer-avatar">{initials}</div>
                                                        <div>
                                                            <div className="reviewer-name">{reviewerName}</div>
                                                            <div className="review-date">{new Date(review.created_at).toLocaleDateString('vi-VN')}</div>
                                                        </div>
                                                    </div>
                                                    <div className="review-rating">{renderStars(Number(review.rating) || 5)}</div>
                                                </div>
                                                <p className="review-text">{review.comment || `${product.name} mang lại trải nghiệm mùi hương rất ổn định và dễ chịu.`}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="related-products">
                        <h2 className="section-title">Sản Phẩm Liên Quan</h2>
                        <div className="products-grid">
                            {relatedProducts.length === 0 && (
                                <div className="product-card">
                                    <div className="product-info">
                                        <h3 className="product-name">Chưa có sản phẩm liên quan</h3>
                                        <p className="product-description">Hệ thống sẽ cập nhật thêm các gợi ý phù hợp trong thời gian tới.</p>
                                    </div>
                                </div>
                            )}
                            {relatedProducts.map((relatedProduct: any) => {
                                const relatedImage = parseImageList(relatedProduct.image)[0] || '/images/default-product.png';
                                return (
                                    <div key={relatedProduct.id} className="product-card">
                                        <div className="product-image-container">
                                            <img src={relatedImage} alt={relatedProduct.name} className="product-image" />
                                        </div>
                                        <div className="product-info">
                                            <h3 className="product-name">{relatedProduct.name}</h3>
                                            <p className="product-description">{relatedProduct.description || 'Sản phẩm cùng nhóm mùi hương và trải nghiệm tương tự.'}</p>
                                            <div className="product-footer">
                                                <span className="product-price">{formatPrice(relatedProduct.price)}đ</span>
                                                <div className="rating">{renderStars(Number(relatedProduct.average_rating) || 5)}</div>
                                            </div>
                                            <Link href={`/products/${relatedProduct.id}`} className="btn btn-gradient btn-full">Xem Chi Tiết</Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}