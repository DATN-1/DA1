import "@/style/index.css";
import HeroSection from "@/app/(client)/components/Home/Hero";
import NewProductSection from "@/app/(client)/components/Home/NewProduct";
import BestSellerSection from "@/app/(client)/components/Home/BestSeller";
import FeaturedProductSection from "@/app/(client)/components/Home/FeaturedProduct";
import PromotionsBanner from "@/app/(client)/components/Home/PromotionsBanner";
import CategoriesSection from "@/app/(client)/components/Home/Categories";
import BlogSection from "@/app/(client)/components/Home/Blog";
import BenefitSection from "@/app/(client)/components/Home/Benefit";
import ServiceSection from "@/app/(client)/components/Home/Service";
import PartnerSection from "@/app/(client)/components/Home/Partner";
import WhyChooseUsSection from "@/app/(client)/components/Home/WhyChooseUs";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <NewProductSection />
      <BestSellerSection />
      <FeaturedProductSection />
      <PromotionsBanner />
      <CategoriesSection />
      <BlogSection />
      <BenefitSection />
      <ServiceSection />
      <PartnerSection />
      <WhyChooseUsSection />
    </main>
  );
}
