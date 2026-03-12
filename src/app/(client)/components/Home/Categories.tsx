
export default function CategoriesSection(){
    return(
        <section style={{padding: "3rem 0", background: "white"}}>
      <div className="container">
        <div className="section-header">
          <h2>Danh Mục Sản Phẩm</h2>
          <p>Khám phá bộ sưu tập nến thơm đa dạng theo từng chủ đề</p>
        </div>
        <div className="categories-grid">
          <a href="products.html?category=floral" className="category-card">
            <div className="category-icon">🌸</div>
            <h3>Hương Hoa</h3>
            <p>12 sản phẩm</p>
          </a>

          <a href="products.html?category=fresh" className="category-card">
            <div className="category-icon">🌿</div>
            <h3>Hương Tươi Mát</h3>
            <p>8 sản phẩm</p>
          </a>

          <a href="products.html?category=sweet" className="category-card">
            <div className="category-icon">🍰</div>
            <h3>Hương Ngọt Ngào</h3>
            <p>10 sản phẩm</p>
          </a>

          <a href="products.html?category=woody" className="category-card">
            <div className="category-icon">🌲</div>
            <h3>Hương Gỗ</h3>
            <p>6 sản phẩm</p>
          </a>
        </div>
      </div>
    </section>

    )
}