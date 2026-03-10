export default function PromotionsBanner(){
    return(
        <section className="promo-banner">
      <div className="container">
        <div className="promo-content">
          <div className="promo-text">
            <h2>🎉 Ưu Đãi Đặc Biệt</h2>
            <p>Giảm giá lên đến 30% cho đơn hàng từ 1.000.000đ</p>
            <div className="promo-features">
              <span className="promo-tag">✨ Miễn phí vận chuyển</span>
              <span className="promo-tag">🎁 Quà tặng kèm</span>
              <span className="promo-tag">⚡ Giảm ngay 30%</span>
            </div>
            <a
              href="products.html"
              className="btn btn-primary"
              style={{marginTop: "1.5rem"}}
              >Mua Ngay</a>
          </div>
          <div className="promo-timer">
            <div className="timer-label">Ưu đãi kết thúc sau:</div>
            <div className="timer-display">
              <div className="timer-box">
                <div className="timer-value">02</div>
                <div className="timer-unit">Ngày</div>
              </div>
              <div className="timer-box">
                <div className="timer-value">14</div>
                <div className="timer-unit">Giờ</div>
              </div>
              <div className="timer-box">
                <div className="timer-value">35</div>
                <div className="timer-unit">Phút</div>
              </div>
              <div className="timer-box">
                <div className="timer-value">42</div>
                <div className="timer-unit">Giây</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    )
}