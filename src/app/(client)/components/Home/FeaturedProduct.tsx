import ProductCarousel from "@/app/controllers/carousel/ProductCarousel";
import Link from "next/link";
import { useEffect, useState } from "react";
import useCartControllers  from "@/app/(client)/cart/useCartControllers";

export default function BestSellerSection(){
    const [products, setProducts] = useState([]);
    const { addToCart: cartAddToCart } = useCartControllers();
    
    useEffect(() => {
        fetch('/api/products?sort=popular&limit=all')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error(err));
    }, []);
    
    return(
        <section className="gradient-bg" style={{padding: "3rem 0"}}>
            <div className="container">
                <div className="section-header">
                    <h2>Sản Phẩm Nổi Bật</h2>
                    <p>Những mùi hương được yêu thích nhất, mang đến trải nghiệm tuyệt vời</p>
                </div>

                <ProductCarousel>
            {/* <!-- Product 1 --> */}
            {products.map((product: any) => (
            <div
             key={product.id}
             className="product-card">
              <div className="product-image-container">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image" />
                <div className="product-badge" style={{background: "#ef4444"}}>
                  Bestseller
                </div>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">{new Intl.NumberFormat('vi-VN').format((product.price || 0) * 25000)} VND</span>
                  <div className="rating">
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  </div>
                </div>
                <div className="sales-count">Đã bán: {product.salesCount}</div>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                  <Link href={`/products/${product.id}`} className="btn btn-dark" style={{flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.875rem'}}>Xem Chi Tiết</Link>
                  <button 
                    className="btn btn-gradient" 
                    onClick={() => {
                      const productImage = typeof product.image === 'string'
                        ? [product.image]
                        : Array.isArray(product.image)
                        ? product.image
                        : [];
                      cartAddToCart({
                        id: String(product.id),
                        name: product.name,
                        price: (product.price || 0) * 25000,
                        image: productImage,
                      })
                    }}
                    style={{flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.875rem'}}
                  >Thêm Vào Giỏ</button>
                </div>
                <Link href={`/products/${product.id}`} className="btn btn-gradient btn-full">Xem Chi Tiết</Link>
              </div>
            </div>
            ))}
            {/* <!-- Product 2 --> */}
            <div className="product-card">
              <div className="product-image-container">
                <img
                  src="../images/vanilla.jpg"
                  alt="Vanilla Dream"
                  className="product-image" />
                <div className="product-badge" style={{background: "#ef4444"}}>
                  Bestseller
                </div>
              </div>
              <div className="product-info">
                <h3 className="product-name">Vanilla Dream</h3>
                <p className="product-description">Hương vani ngọt ngào</p>
                <div className="product-footer">
                  <span className="product-price">280.000đ</span>
                  <div className="rating">
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  </div>
                </div>
                <div className="sales-count">Đã bán: 1,987</div>
                <Link href="/product-detail/2" className="btn btn-gradient btn-full">Xem Chi Tiết</Link>
              </div>
            </div>

            {/* <!-- Product 3 --> */}
            <div className="product-card">
              <div className="product-image-container">
                <img
                  src="../images/rose.jpg"
                  alt="Rose Garden"
                  className="product-image" />
              </div>
              <div className="product-info">
                <h3 className="product-name">Rose Garden</h3>
                <p className="product-description">Hương hoa hồng quyến rũ</p>
                <div className="product-footer">
                  <span className="product-price">420.000đ</span>
                  <div className="rating">
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  </div>
                </div>
                <Link href="/product-detail/3" className="btn btn-gradient btn-full">Xem Chi Tiết</Link>
              </div>
            </div>

            {/* <!-- Product 2 --> */}
            <div className="product-card">
              <div className="product-image-container">
                <img
                  src="../images/vanilla.jpg"
                  alt="Vanilla Dream"
                  className="product-image" />
              </div>
              <div className="product-info">
                <h3 className="product-name">Vanilla Dream</h3>
                <p className="product-description">Hương vani ngọt ngào</p>
                <div className="product-footer">
                  <span className="product-price">280.000đ</span>
                  <div className="rating">
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  </div>
                </div>
                <Link href="/product-detail/2" className="btn btn-gradient btn-full">Xem Chi Tiết</Link>
              </div>
            </div>

            {/* <!-- Product 3 --> */}
            <div className="product-card">
              <div className="product-image-container">
                <img
                  src="../images/lavender.jpg"
                  alt="Lavender Bliss"
                  className="product-image" />
              </div>
              <div className="product-info">
                <h3 className="product-name">Lavender Bliss</h3>
                <p className="product-description">Hương oải hương nhẹ nhàng</p>
                <div className="product-footer">
                  <span className="product-price">350.000đ</span>
                  <div className="rating">
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  </div>
                </div>
                <Link href="/product-detail/1" className="btn btn-gradient btn-full">Xem Chi Tiết</Link>
              </div>
            </div>

            {/* <!-- Product 4 --> */}
            <div className="product-card">
              <div className="product-image-container">
                <img
                  src="../images/ocean.jpg"
                  alt="Ocean Wave"
                  className="product-image" />
              </div>
              <div className="product-info">
                <h3 className="product-name">Ocean Wave</h3>
                <p className="product-description">Hương đại dương tươi mát</p>
                <div className="product-footer">
                  <span className="product-price">320.000đ</span>
                  <div className="rating">
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  </div>
                </div>
                <Link href="/product-detail/4" className="btn btn-gradient btn-full">Xem Chi Tiết</Link>
              </div>
            </div>

            {/* <!-- Product 5 --> */}
            <div className="product-card">
              <div className="product-image-container">
                <img
                  src="../images/jasmine.jpg"
                  alt="Jasmine Night"
                  className="product-image" />
              </div>
              <div className="product-info">
                <h3 className="product-name">Jasmine Night</h3>
                <p className="product-description">Hương hoa nhài dịu dàng</p>
                <div className="product-footer">
                  <span className="product-price">380.000đ</span>
                  <div className="rating">
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  </div>
                </div>
                <Link href="/product-detail/6" className="btn btn-gradient btn-full">Xem Chi Tiết</Link>
              </div>
            </div>

            {/* <!-- Product 6 --> */}
            <div className="product-card">
              <div className="product-image-container">
                <img
                  src="../images/cinnamon.jpg"
                  alt="Cinnamon Spice"
                  className="product-image" />
              </div>
              <div className="product-info">
                <h3 className="product-name">Cinnamon Spice</h3>
                <p className="product-description">Hương quế ấm áp</p>
                <div className="product-footer">
                  <span className="product-price">290.000đ</span>
                  <div className="rating">
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="star" viewBox="0 0 20 20">
                      <path
                        d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  </div>
                </div>
                <Link href="/product-detail/5" className="btn btn-gradient btn-full">Xem Chi Tiết</Link>
              </div>
            </div>
            </ProductCarousel>

            <div style={{textAlign: "center", marginTop: "3rem"}}>
                <a
                    href="products.html"
                    className="btn btn-dark"
                    style={{padding: "1rem 3rem"}}
                    >Xem Tất Cả Sản Phẩm</a>
            </div>
            </div>
        </section>
    )
}