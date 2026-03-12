'use client';

import ProductCarousel from "../../src/app/controllers/carousel/ProductCarousel";
import Link from "next/link";
import { useEffect, useState } from "react";
<<<<<<< HEAD
import useCartControllers from "../../src/app/cart/useCartControllers";

export default function BestSellerSection(){
    const [products, setProducts] = useState([]);
    const { addToCart } = useCartControllers();
    
    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => setProducts(data))
=======
import { format } from "url";

export default function BestSellerSection(){
    const [products, setProducts] = useState([]);
    
    useEffect(() => {
        fetch('/api/products?sort=popular&limit=all')
            .then(res => res.json())
            .then(data => setProducts(products))
>>>>>>> 1e602eb8ac2e589c7f831c8f4b2e4866074d80f5
            .catch(err => console.error(err));
    }, []);
    
    return(
        <section className="gradient-bg" style={{padding: "3rem 0"}}>
            <div className="container">
                <div className="section-header">
                    <h2>Sản Phẩm Bán Chạy</h2>
                    <p>Những sản phẩm được yêu thích nhất</p>
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
<<<<<<< HEAD
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
                      addToCart({
                        id: String(product.id),
                        name: product.name,
                        price: (product.price || 0) * 25000,
                        image: productImage,
                      })
                    }}
                    style={{flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.875rem'}}
                  >Thêm Vào Giỏ</button>
                </div>
=======
                <Link href={`/products/${product.id}`} className="btn btn-gradient btn-full">Xem Chi Tiết</Link>
>>>>>>> 1e602eb8ac2e589c7f831c8f4b2e4866074d80f5
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
                <div className="product-badge" style={{background: "#ef4444"}}>
                  Bestseller
                </div>
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
                <div className="sales-count">Đã bán: 1,654</div>
                <Link href="/product-detail/3" className="btn btn-gradient btn-full">Xem Chi Tiết</Link>
              </div>
            </div>

            {/* <!-- Product 4 --> */}
            <div className="product-card">
              <div className="product-image-container">
                <img
                  src="../images/jasmine.jpg"
                  alt="Jasmine Dream"
                  className="product-image" />
                <div className="product-badge" style={{background: "#ef4444"}}>
                  Bestseller
                </div>
              </div>
              <div className="product-info">
                <h3 className="product-name">Jasmine Dream</h3>
                <p className="product-description">Hương hoa nhài quyến rũ</p>
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
                <div className="sales-count">Đã bán: 1,432</div>
                <Link href="/product-detail/6" className="btn btn-gradient btn-full">Xem Chi Tiết</Link>
              </div>
            </div>

            {/* <!-- Product 5 --> */}
            <div className="product-card">
              <div className="product-image-container">
                <img
                  src="../images/cinnamon.jpg"
                  alt="Cinnamon Top"
                  className="product-image" />
                <div className="product-badge" style={{background: "#ef4444"}}>
                  Bestseller
                </div>
              </div>
              <div className="product-info">
                <h3 className="product-name">Cinnamon Top</h3>
                <p className="product-description">Hương quế nồng ấm</p>
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
                <div className="sales-count">Đã bán: 1,215</div>
                <Link href="/product-detail/5" className="btn btn-gradient btn-full">Xem Chi Tiết</Link>
              </div>
            </div>

            {/* <!-- Product 6 --> */}
            <div className="product-card">
              <div className="product-image-container">
                <img
                  src="../images/ocean.jpg"
                  alt="Ocean Magic"
                  className="product-image" />
                <div className="product-badge" style={{background: "#ef4444"}}>
                  Bestseller
                </div>
              </div>
              <div className="product-info">
                <h3 className="product-name">Ocean Magic</h3>
                <p className="product-description">Hương biển cả tươi mới</p>
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
                <div className="sales-count">Đã bán: 985</div>
                <Link href="/product-detail/4" className="btn btn-gradient btn-full">Xem Chi Tiết</Link>
              </div>
            </div>
            
         
          </ProductCarousel>
     </div>
        
        
      </section>
      
    )
}