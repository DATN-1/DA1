export default function PartnerSection(){
    return(
         <section style={{padding: "4rem 0", background: "#f9fafb"}}>
      <div className="container">
        <div className="section-header" style={{marginBottom: "3rem"}}>
          <h2>Đối Tác Của Chúng Tôi</h2>
          <p>Được tin tưởng bởi các thương hiệu hàng đầu</p>
        </div>

        <div className="partners-grid">
          <div className="partner-logo">Partner 1</div>
          <div className="partner-logo">Partner 2</div>
          <div className="partner-logo">Partner 3</div>
          <div className="partner-logo">Partner 4</div>
          <div className="partner-logo">Partner 5</div>
          <div className="partner-logo">Partner 6</div>
        </div>
      </div>
    </section>
    )
}