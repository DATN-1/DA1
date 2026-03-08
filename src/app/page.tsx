import "@/style/index.css";
import HeroSection from "../../components/Home/Hero";
import NewProductSection from "../../components/Home/NewProduct";
import BestSellerSection from "../../components/Home/BestSeller";
import FeaturedProductSection from "../../components/Home/FeaturedProduct";
import PromotionsBanner from "../../components/Home/PromotionsBanner";
import CategoriesSection from "../../components/Home/Categories";
import BlogSection from "../../components/Home/Blog";
import BenefitSection from "../../components/Home/Benefit";
import ServiceSection from "../../components/Home/Service";
import PartnerSection from "../../components/Home/Partner";
import WhyChooseUsSection from "../../components/Home/WhyChooseUs";

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
