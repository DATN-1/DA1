export default function ServiceSection(){
    return(
        <section style={{padding: "3rem 0", background: "white"}}>
      <div className="container">
        <div className="section-header">
          <h2>Dịch Vụ Của Chúng Tôi</h2>
          <p>Cam kết mang đến trải nghiệm mua sắm tốt nhất</p>
        </div>

        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">
              <svg
                width="48"
                height="48"
                fill="none"
                stroke="#f59e0b"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h3>Đóng Gói Sang Trọng</h3>
            <p>
              Mỗi sản phẩm được đóng gói cẩn thận với thiết kế sang trọng, phù
              hợp làm quà tặng
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <svg
                width="48"
                height="48"
                fill="none"
                stroke="#f59e0b"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3>Giao Hàng Nhanh Chóng</h3>
            <p>Giao hàng trong vòng 24h tại nội thành, 2-3 ngày toàn quốc</p>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <svg
                width="48"
                height="48"
                fill="none"
                stroke="#f59e0b"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3>Bảo Hành Chất Lượng</h3>
            <p>Cam kết 100% hoàn tiền nếu sản phẩm không đúng mô tả</p>
          </div>

          <div className="service-card">
            <div className="service-icon">
              <svg
                width="48"
                height="48"
                fill="none"
                stroke="#f59e0b"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3>Tư Vấn Miễn Phí</h3>
            <p>
              Đội ngũ chuyên gia sẵn sàng tư vấn giúp bạn chọn sản phẩm phù hợp
            </p>
          </div>
        </div>
      </div>
    </section>
    )
}