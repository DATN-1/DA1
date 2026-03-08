import { text } from "stream/consumers"

export default function WhyChooseUsSection(){
    return(
        <section className="gradient-amber-rose" style={{padding: "3rem 0", color: "white"}}>
      <div className="container">
        {/* Tiêu đề căn giữa */}
        <div style={{textAlign: "center", marginBottom: "2rem"}}>
          <h2
            style={{
              fontSize: "2.25rem",
              fontWeight: "bold",
              marginBottom: "0.75rem"
            }}>
            Tại Sao Chọn Aromi?
          </h2>
          <p
            style={{
              fontSize: "1.1rem",
              opacity: "0.9",
              maxWidth: "600px",
              margin: "0 auto",
            }}>
            Chúng tôi cam kết mang đến những sản phẩm chất lượng nhất cho bạn
          </p>
        </div>

        <div
          className="why-choose-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "2rem",
          }}>
          {/* Khung 1: Chất Lượng Đảm Bảo */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              padding: "1.5rem 1.25rem",
              borderRadius: "1rem",
              textAlign: "center",
            }}>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                width: "55px",
                height: "55px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
              }}>
              <svg
                width="28"
                height="28"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}>
              Chất Lượng Đảm Bảo
            </h3>
            <p style={{opacity: 0.9, fontSize: "0.9rem", lineHeight: "1.5"}}>
              Mỗi sản phẩm đều được kiểm tra kỹ lưỡng trước khi đến tay khách
              hàng
            </p>
          </div>

          {/* Khung 2: Giá Cả Hợp Lý */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              padding: "1.5rem 1.25rem",
              borderRadius: "1rem",
              textAlign: "center",
            }}>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                width: "55px",
                height: "55px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
              }}>
              <svg
                width="28"
                height="28"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}>
              Giá Cả Hợp Lý
            </h3>
            <p style={{opacity: 0.9, fontSize: "0.9rem", lineHeight: "1.5"}}>
              Cam kết mang đến sản phẩm chất lượng với mức giá tốt nhất thị
              trường
            </p>
          </div>

          {/* Khung 3: Hỗ Trợ Tận Tâm */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              padding: "1.5rem 1.25rem",
              borderRadius: "1rem",
              textAlign: "center",
            }}>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                width: "55px",
                height: "55px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
              }}>
              <svg
                width="28"
                height="28"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}>
              Hỗ Trợ Tận Tâm
            </h3>
            <p style={{opacity: 0.9, fontSize: "0.9rem", lineHeight: "1.5"}}>
              Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn 24/7
            </p>
          </div>
        </div>
      </div>
    </section>       
    )
}