import { getAllBrands } from '@/app/models/brand.model';
import PartnerCarousel from './PartnerCarousel';

export default async function PartnerSection() {
    const brands = await getAllBrands();

    return(
         <section style={{padding: "4rem 0", background: "#f9fafb"}}>
      <div className="container">
        <div className="section-header" style={{marginBottom: "3rem"}}>
          <h2>Đối Tác Của Chúng Tôi</h2>
          <p>Được tin tưởng bởi các thương hiệu hàng đầu</p>
        </div>

        <PartnerCarousel brands={brands} />
      </div>
    </section>
    )
}