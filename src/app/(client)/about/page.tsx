import '../../../style/about.css';
import Breadcrumb from "@/app/(client)/components/Breadcrumb";

export default function AboutPage() {
    return (
        <div>
            <div className="container">
                <Breadcrumb items={[
                    { label: "Trang Chủ", href: "/" },
                    { label: "Về Chúng Tôi" }
                ]} />
            </div>
            <section className="about-hero">
        <div className="container about-hero-content">
            <h1>Về Chúng Tôi</h1>
            <p>Câu chuyện về hành trình tạo nên những mùi hương đặc biệt</p>
        </div>
    </section>

    {/* <!-- Story Section --> */}
    <section className="story-section">
        <div className="container">
            <div className="story-grid">
                <div className="story-content">
                    <h2>Câu Chuyện Của Chúng Tôi</h2>
                    <div className="story-text">
                        <p>
                            <strong style={{color: "#d97706"}}>Aromi Candle</strong> được thành lập vào năm 2020 với niềm đam mê tạo ra những sản phẩm nến thơm chất lượng cao, 
                            mang đến không gian sống ấm cúng và thư giãn cho mọi gia đình Việt Nam.
                        </p>
                        <p>
                            Chúng tôi tin rằng mùi hương có sức mạnh kỳ diệu trong việc tạo nên những kỷ niệm đẹp, 
                            giúp con người kết nối với cảm xúc và tìm thấy sự bình yên trong cuộc sống hiện đại đầy bộn bề.
                        </p>
                        <p>
                            Mỗi cây nến của Aromi đều được chế tác thủ công với tình yêu và sự tỉ mỉ, 
                            sử dụng 100% sáp đậu nành tự nhiên và tinh dầu cao cấp nhập khẩu từ các nước có truyền thống lâu đời.
                        </p>
                    </div>
                </div>
                <div className="story-image-wrapper">
                    <img src="../images/lavender.jpg" alt="Our Story" className="story-image" />
                    <div className="experience-badge">
                        <p className="years">4+</p>
                        <p>Năm kinh nghiệm</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/* <!-- Values Section --> */}
    <section className="values-section">
        <div className="container">
            <h2 className="section-title">Giá Trị Cốt Lõi</h2>
            <div className="values-grid">
                <div className="value-card quality">
                    <div className="value-icon">
                        <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3>Chất Lượng</h3>
                    <p>Cam kết sử dụng 100% nguyên liệu tự nhiên, an toàn cho sức khỏe và thân thiện với môi trường</p>
                </div>

                <div className="value-card dedication">
                    <div className="value-icon">
                        <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <h3>Tận Tâm</h3>
                    <p>Mỗi sản phẩm được chế tác thủ công với sự tỉ mỉ và tình yêu, mang đến trải nghiệm tốt nhất</p>
                </div>

                <div className="value-card sustainable">
                    <div className="value-icon">
                        <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3>Bền Vững</h3>
                    <p>Cam kết bảo vệ môi trường với bao bì tái chế và quy trình sản xuất xanh</p>
                </div>
            </div>
        </div>
    </section>

    {/* <!-- Team Section --> */}
    <section className="team-section">
        <div className="container">
            <h2 className="section-title">Đội Ngũ Của Chúng Tôi</h2>
            <div className="team-grid">
                <div className="team-card">
                    <div className="team-image-wrapper">
                        <img src="../images/lavender.jpg" alt="Nguyễn Thị Mai" className="team-image" />
                        <div className="team-overlay"></div>
                    </div>
                    <h3>Nguyễn Thị Mai</h3>
                    <p>Founder & CEO</p>
                </div>
                <div className="team-card">
                    <div className="team-image-wrapper">
                        <img src="../images/vanilla.jpg" alt="Trần Văn Nam" className="team-image" />
                        <div className="team-overlay"></div>
                    </div>
                    <h3>Trần Văn Nam</h3>
                    <p>Master Chandler</p>
                </div>
                <div className="team-card">
                    <div className="team-image-wrapper">
                        <img src="../images/rose.jpg" alt="Lê Thị Hoa" className="team-image" />
                        <div className="team-overlay"></div>
                    </div>
                    <h3>Lê Thị Hoa</h3>
                    <p>Creative Director</p>
                </div>
                <div className="team-card">
                    <div className="team-image-wrapper">
                        <img src="../images/ocean.jpg" alt="Phạm Minh Tuấn" className="team-image" />
                        <div className="team-overlay"></div>
                    </div>
                    <h3>Phạm Minh Tuấn</h3>
                    <p>Quality Manager</p>
                </div>
            </div>
        </div>
    </section>

    {/* <!-- Stats Section --> */}
    <section className="stats-section">
        <div className="container">
            <div className="stats-grid">
                <div className="stat-item">
                    <p className="number">10,000+</p>
                    <p className="label">Khách hàng hài lòng</p>
                </div>
                <div className="stat-item">
                    <p className="number">50+</p>
                    <p className="label">Mùi hương độc đáo</p>
                </div>
                <div className="stat-item">
                    <p className="number">100%</p>
                    <p className="label">Nguyên liệu tự nhiên</p>
                </div>
                <div className="stat-item">
                    <p className="number">4.9★</p>
                    <p className="label">Đánh giá trung bình</p>
                </div>
            </div>
        </div>
    </section>

    {/* <!-- CTA Section --> */}
    <section className="cta-section">
        <div className="container">
            <h2>Sẵn Sàng Khám Phá?</h2>
            <p>Hãy để Aromi Candle mang đến những trải nghiệm mùi hương tuyệt vời cho không gian sống của bạn</p>
            <a href="products.html" className="btn btn-primary" style={{padding: "1.25rem 3rem", fontSize: "1.25rem"}}>Khám Phá Sản Phẩm</a>
        </div>
    </section>

        </div>
    );
}