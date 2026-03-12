import ProductCarousel from "@/app/controllers/carousel/ProductCarousel";
import Link from "next/link";

export default function FeaturedProductSection(){
    return(
        <section className="gradient-bg" style={{padding: "3rem 0"}}>
            <div className="container">
                <div className="section-header">
                    <h2>Sản Phẩm Nổi Bật</h2>
                    <p>Những mùi hương được yêu thích nhất, mang đến trải nghiệm tuyệt vời</p>
                </div>

                <ProductCarousel>
            {/* <!-- Product 1 --> */}
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