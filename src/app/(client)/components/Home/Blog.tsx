export default function BlogSection(){
    return(
        <section className="gradient-bg" style={{padding: "3rem 0"}}>
      <div className="container">
        <div className="section-header">
          <h2>Bài Viết Mới Nhất</h2>
          <p>Khám phá những kiến thức thú vị về nến thơm</p>
        </div>

        <div className="blog-grid">
          <article className="blog-card">
            <div className="blog-image">
              <img src="../images/lavender.jpg" alt="Blog post" />
              <div className="blog-category">Hướng dẫn</div>
            </div>
            <div className="blog-content">
              <div className="blog-meta">
                <span>📅 10/01/2026</span>
                <span>👤 Admin</span>
              </div>
              <h3>Cách Chọn Nến Thơm Phù Hợp Với Không Gian Sống</h3>
              <p>
                Khám phá bí quyết chọn lựa mùi hương nến thơm phù hợp với từng
                không gian trong ngôi nhà của bạn...
              </p>
              <a href="#" className="blog-link">Đọc thêm →</a>
            </div>
          </article>

          <article className="blog-card">
            <div className="blog-image">
              <img src="../images/rose.jpg" alt="Blog post" />
              <div className="blog-category">Kiến thức</div>
            </div>
            <div className="blog-content">
              <div className="blog-meta">
                <span>📅 08/01/2026</span>
                <span>👤 Admin</span>
              </div>
              <h3>Lợi Ích Của Nến Thơm Tự Nhiên Với Sức Khỏe</h3>
              <p>
                Tìm hiểu về những lợi ích tuyệt vời mà nến thơm tự nhiên mang
                lại cho sức khỏe và tinh thần...
              </p>
              <a href="#" className="blog-link">Đọc thêm →</a>
            </div>
          </article>

          <article className="blog-card">
            <div className="blog-image">
              <img src="../images/vanilla.jpg" alt="Blog post" />
              <div className="blog-category">Mẹo hay</div>
            </div>
            <div className="blog-content">
              <div className="blog-meta">
                <span>📅 05/01/2026</span>
                <span>👤 Admin</span>
              </div>
              <h3>Bảo Quản Nến Thơm Đúng Cách Để Giữ Hương Lâu</h3>
              <p>
                Những mẹo nhỏ giúp bạn bảo quản nến thơm đúng cách, giữ được
                hương thơm lâu dài và cháy đều...
              </p>
              <a href="#" className="blog-link">Đọc thêm →</a>
            </div>
          </article>
        </div>
      </div>
    </section>
    )
}