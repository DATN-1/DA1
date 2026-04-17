'use client';

import ProductCarousel from "@/app/controllers/carousel/ProductCarousel";
import Link from "next/link";
import { useEffect, useState } from "react";
import { renderStars } from "@/app/(client)/components/StarRating";


export default function BestSellerSection(){
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
                  <span className="product-price">{new Intl.NumberFormat('vi-VN').format((product.price || 0))} VND</span>
                  {renderStars(product.average_rating)}

                </div>
                <div className="sales-count">Đã bán: {product.salesCount}</div>
                <Link href={`/products/${product.id}`} className="btn btn-gradient btn-full">Xem Chi Tiết</Link>
              </div>
            </div>
            ))}
           
            
         
          </ProductCarousel>
     </div>
        
        
      </section>
      
    )
}