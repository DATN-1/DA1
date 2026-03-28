import '@/style/index.css';
import Breadcrumb from "@/app/(client)/components/Breadcrumb";

export default function BlogPage() {
  return (
    <div>
      <div className="container">
        <Breadcrumb items={[
          { label: "Trang Chủ", href: "/" },
          { label: "Góc Chia Sẻ" }
        ]} />
      </div>
      <section className="gradient-bg" style={{ padding: "5rem 0", textAlign: "center" }}>
        <div className="container">
          <h1 style={{ fontSize: "3.5rem", fontWeight: "bold", marginBottom: "1.5rem" }} className="text-gradient">
            Góc Chia Sẻ
          </h1>
          <p style={{ fontSize: "1.25rem", color: "#6b7280", maxWidth: "700px", margin: "0 auto" }}>
            Khám phá thế giới nến thơm, những mẹo trang trí và bí quyết tạo nên không gian sống lý tưởng
          </p>
        </div>
      </section>

      {/* Blog List Section */}
      <section style={{ padding: "5rem 0", background: "white" }}>
        <div className="container">
          <div className="blog-grid">
            {/* Blog 1 */}
            <article className="blog-card">
            <div className="blog-image">
              <img src="../images/lavender.jpg" alt="Thư giãn với nến thơm" />
              <div className="blog-category">Thư Giãn</div>
            </div>
            <div className="blog-content">
              <div className="blog-meta">
                <span>📅 04/02/2026</span>
                <span>👤 Bởi Aromi Team</span>
              </div>
              <h3>Cách Kết Hợp Nến Thơm Cho Giấc Ngủ Ngon</h3>
              <p>Hương oải hương và nhài là những lựa chọn tuyệt vời để giúp bạn xua tan căng thẳng sau một ngày dài làm việc...</p>
              <a href="#" className="blog-link">Đọc Thêm →</a>
            </div>
          </article>

          {/* Blog 2 */}
          <article className="blog-card">
            <div className="blog-image">
              <img src="../images/vanilla.jpg" alt="Trang trí nhà cửa" />
              <div className="blog-category">Trang Trí</div>
            </div>
            <div className="blog-content">
              <div className="blog-meta">
                <span>📅 02/02/2026</span>
                <span>👤 Bởi Aromi Team</span>
              </div>
              <h3>5 Ý Tưởng Trang Trí Bàn Tiệc Với Nến Thơm</h3>
              <p>Nến không chỉ mang lại hương thơm mà còn là điểm nhấn thị giác tuyệt đẹp cho mọi bữa tiệc gia đình...</p>
              <a href="#" className="blog-link">Đọc Thêm →</a>
            </div>
          </article>

          {/* Blog 3 */}
          <article className="blog-card">
            <div className="blog-image">
              <img src="../images/ocean.jpg" alt="Kiến thức nến thơm" />
              <div className="blog-category">Kiến Thức</div>
            </div>
            <div className="blog-content">
              <div className="blog-meta">
                <span>📅 28/01/2026</span>
                <span>👤 Bởi Aromi Team</span>
              </div>
              <h3>Phân Biệt Các Loại Sáp Nến Phổ Biến Hiện Nay</h3>
              <p>Tại sao nến sáp đậu nành lại tốt hơn cho sức khỏe so với sáp paraffin thông thường? Hãy cùng tìm hiểu...</p>
              <a href="#" className="blog-link">Đọc Thêm →</a>
            </div>
          </article>

          {/* Blog 4 */}
          <article className="blog-card">
            <div className="blog-image">
              <img src="../images/rose.jpg" alt="Hương thơm tinh tế" />
              <div className="blog-category">Hương Thơm</div>
            </div>
            <div className="blog-content">
              <div className="blog-meta">
                <span>📅 25/01/2026</span>
                <span>👤 Bởi Aromi Team</span>
              </div>
              <h3>Bí Quyết Giữ Hương Thơm Nến Bền Lâu</h3>
              <p>Cách cắt tim nến và quản lý thời gian đốt nến để tối ưu hóa khả năng tỏa hương cho nến thơm của bạn...</p>
              <a href="#" className="blog-link">Đọc Thêm →</a>
            </div>
          </article>

          {/* Blog 5 */}
          <article className="blog-card">
            <div className="blog-image">
              <img src="../images/jasmine.jpg" alt="Phong cách sống" />
              <div className="blog-category">Lifestyle</div>
            </div>
            <div className="blog-content">
              <div className="blog-meta">
                <span>📅 20/01/2026</span>
                <span>👤 Bởi Aromi Team</span>
              </div>
              <h3>Tạo Không Gian Spa Tại Nhà Với Hương Thơm</h3>
              <p>Biến phòng tắm của bạn thành một spa cao cấp chỉ với vài bước đơn giản và nến thơm nồng nàn...</p>
              <a href="#" className="blog-link">Đọc Thêm →</a>
            </div>
          </article>

          {/* Blog 6 */}
          <article className="blog-card">
            <div className="blog-image">
              <img src="../images/cinnamon.jpg" alt="Mùa đông ấm áp" />
              <div className="blog-category">Mùa Đông</div>
            </div>
            <div className="blog-content">
              <div className="blog-meta">
                <span>📅 15/01/2026</span>
                <span>👤 Bởi Aromi Team</span>
              </div>
              <h3>Hương Quế Và Gừng: Sự Ấm Áp Cho Những Ngày Đông</h3>
              <p>Khám phá lý do tại sao các note hương gia vị lại được ưa chuộng nhất vào mùa lễ hội cuối năm...</p>
              <a href="#" className="blog-link">Đọc Thêm →</a>
            </div>
          </article>
        </div>
      </div>
    </section>
    </div>
  );
}