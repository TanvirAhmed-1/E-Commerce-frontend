import HomeCarousel from "@/components/ui/home/Carousel";
import FactoryProcess from "@/components/ui/home/FactoryProcess";
import HomeCatalogue from "@/components/ui/home/HomeCatalogue";


export default function Home() {
  return (
    <div className="px-4 container lg:max-w-[1400px] mx-auto relative">
      <HomeCarousel />
    </div>
  );
}
