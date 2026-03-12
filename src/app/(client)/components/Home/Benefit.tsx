export default function BenefitSection(){
    return(
         <section className="benefits">
      <div className="container">
        <div className="section-header">
          <h2>Cam Kết Của Chúng Tôi</h2>
          <p>Những giá trị cốt lõi mà Aromi Candle mang đến cho bạn</p>
        </div>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon" style={{background: "#fef3c7"}}>
              <svg
                width="32"
                height="32"
                fill="none"
                stroke="#d97706"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3>100% Tự Nhiên</h3>
            <p>Sáp đậu nành và tinh dầu thiên nhiên</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon" style={{background: "#ffe4e6"}}>
              <svg
                width="32"
                height="32"
                fill="none"
                stroke="#e11d48"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3>Giao Hàng Nhanh</h3>
            <p>Miễn phí vận chuyển đơn từ 500k</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon" style={{background: "#d1fae5"}}>
              <svg
                width="32"
                height="32"
                fill="none"
                stroke="#059669"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3>Đổi Trả 7 Ngày</h3>
            <p>Chính sách đổi trả linh hoạt</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon" style={{background: "#dbeafe"}}>
              <svg
                width="32"
                height="32"
                fill="none"
                stroke="#2563eb"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3>Thủ Công</h3>
            <p>Chế tác tỉ mỉ từng sản phẩm</p>
          </div>
        </div>
      </div>
    </section>
    )
}