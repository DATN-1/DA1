import HeroCarousel from "@/app/controllers/carousel/HeroCarousel";
import Link from "next/link";

export default function HeroSection(){
    return(
        <section className="hero">
            <HeroCarousel>
                <div className="hero-slide active">
                    <div
                        className="hero-bg"
                        style={{
                            backgroundImage: "url('../images/lavender.jpg')",
                        }}
                    ></div>
                    <div className="hero-overlay"></div>
                    <div className="hero-content">
                        <h1>Khám Phá Thế Giới Hương Thơm</h1>
                        <p>
                            Nến thơm cao cấp được chế tác thủ công với 100% nguyên liệu tự
                            nhiên, mang đến không gian sống ấm cúng và thư giãn
                        </p>
                        <div className="btn-group">
                            <Link href="/products" className="btn btn-primary">Khám Phá Ngay</Link>
                            <Link href="/about" className="btn btn-secondary">Về Chúng Tôi</Link>
                        </div>
                    </div>
                </div>

                <div className="hero-slide">
                    <div
                        className="hero-bg"
                        style={{
                            backgroundImage: "url('../images/ocean.jpg')"
                        }}
                    ></div>
                    <div
                        className="hero-overlay"
                        style={{
                            background: "linear-gradient(to right, rgba(6, 182, 212, 0.9), rgba(59, 130, 246, 0.9))",
                        }}
                    ></div>

                    <div className="hero-content">
                        <h1>Hương Biển Cả Tươi Mát</h1>
                        <p>
                            Đắm mình trong làn gió biển mát lạnh, mang lại cảm giác sảng khoái
                            và tràn đầy năng lượng cho ngôi nhà của bạn
                        </p>
                        <div className="btn-group">
                            <Link href="/products" className="btn btn-primary">Xem Bộ Sưu Tập</Link>
                            <Link href="/contact" className="btn btn-secondary">Liên Hệ Ngay</Link>
                        </div>
                    </div>
                </div>

                <div className="hero-slide">
                    <div
                        className="hero-bg"
                        style={{backgroundImage: "url(../images/rose.jpg)"}}></div>
                    <div
                        className="hero-overlay"
                        style={{
                            background: "linear-gradient(to right, rgba(225, 29, 72, 0.9), rgba(147, 51, 234, 0.9))",
                        }}></div>
                    <div className="hero-content">
                        <h1>Vẻ Đẹp Quyến Rũ</h1>
                        <p>
                            Hương hoa hồng nồng nàn kết hợp cùng các tầng hương tinh tế, tạo nên
                            không gian lãng mạn và đẳng cấp
                        </p>
                        <div className="btn-group">
                            <Link href="/products" className="btn btn-primary">Mua Ngay</Link>
                            <Link href="/about" className="btn btn-secondary">Tìm Hiểu Thêm</Link>
                        </div>
                    </div>
                </div>
            </HeroCarousel>
        </section>
    );
}