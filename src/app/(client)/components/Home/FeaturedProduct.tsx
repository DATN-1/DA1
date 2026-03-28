'use client';

import ProductCarousel from "@/app/controllers/carousel/ProductCarousel";
import Link from "next/link";
import { useEffect, useState } from "react";
import useCartControllers  from "@/app/(client)/cart/useCartControllers";

export default function FeaturedProductSection(){
    const [products, setProducts] = useState<any[]>([]);
    const { addToCart: cartAddToCart } = useCartControllers();
    
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
                <Link href={`/products/${product.id}`} className="btn btn-gradient btn-full">Xem Chi Tiết</Link>
              </div>
            </div>
            ))}
            </ProductCarousel>

            <div style={{textAlign: "center", marginTop: "3rem"}}>
              <Link
                href="/products"
                    className="btn btn-dark"
                    style={{padding: "1rem 3rem"}}
                >Xem Tất Cả Sản Phẩm</Link>
            </div>
            </div>
        </section>
    )
}