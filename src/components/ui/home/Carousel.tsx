"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { useGetHomeSlidersQuery, ISlider } from "@/redux/features/slider/sliderApi";
import { ArrowRight, Sparkles } from "lucide-react";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface SlideItem {
  _id?: string;
  title?: string;
  image: string;
  link?: string;
  badge?: string;
}

const DEFAULT_SLIDES: SlideItem[] = [
  {
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop",
    title: "Summer Essentials & Home Living",
    link: "/products",
    badge: "Exclusive Deals",
  },
  {
    image: "https://images.unsplash.com/photo-1472851294608-062f824d296e?q=80&w=1600&auto=format&fit=crop",
    title: "Modern Kitchenware & Appliances",
    link: "/products?category=Kitchenware",
    badge: "New Arrivals",
  },
  {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop",
    title: "Storage & Home Organization",
    link: "/products?category=Storage+%26+Organization",
    badge: "Special Discounts",
  },
];

export const HomeCarousel: React.FC = () => {
  const { data: sliderResponse, isLoading } = useGetHomeSlidersQuery(undefined);

  const autoplay = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  // Extract sliders or fallback to default slides
  const slides: SlideItem[] = React.useMemo(() => {
    if (sliderResponse?.data && Array.isArray(sliderResponse.data) && sliderResponse.data.length > 0) {
      return sliderResponse.data.map((slider: ISlider) => ({
        _id: slider._id,
        image: slider.image,
        title: slider.title || "",
        link: slider.link || "/products",
        badge: "Featured Offer",
      }));
    }
    return DEFAULT_SLIDES;
  }, [sliderResponse]);

  React.useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api, slides]);

  if (isLoading) {
    return (
      <div className="w-full h-[260px] sm:h-[380px] md:h-[480px] lg:h-[540px] bg-slate-100 dark:bg-slate-800/60 animate-pulse flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#003820] dark:border-[#95d4ac] border-t-transparent animate-spin" />
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
            Loading promotions...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group w-full select-none overflow-hidden">
      <Carousel
        setApi={setApi}
        className="w-full overflow-hidden"
        plugins={[autoplay.current]}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent className="ml-0">
          {slides.map((item, index) => {
            const isExternal = item.link?.startsWith("http://") || item.link?.startsWith("https://");
            const href = item.link || "/products";

            const SlideContent = (
              <div className="h-full w-full relative flex items-end">
                <Image
                  src={item.image}
                  alt={item.title || "Promotional Banner"}
                  fill
                  priority={index === 0}
                  className="object-cover object-center"
                  sizes="100vw"
                />

                {/* Gradient and Title Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-10 md:p-14 lg:p-16">
                  <div className="max-w-3xl space-y-2 md:space-y-3">
                    {item.badge && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] md:text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full w-fit border border-white/25 shadow-sm">
                        <Sparkles size={12} className="text-amber-300" />
                        {item.badge}
                      </span>
                    )}

                    {item.title && (
                      <h2 className="text-white text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight drop-shadow-md">
                        {item.title}
                      </h2>
                    )}

                    <div className="pt-2 flex items-center">
                      <span className="inline-flex items-center gap-2 bg-[#fd651e] hover:bg-[#a73a00] text-white font-bold text-xs md:text-sm px-5 py-2.5 md:px-6 md:py-3 rounded-xl shadow-lg transition-all transform active:scale-95 group-hover:gap-3 cursor-pointer">
                        Shop Now
                        <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );

            return (
              <CarouselItem
                key={item._id || index}
                className="pl-0 w-full h-[260px] sm:h-[380px] md:h-[480px] lg:h-[540px] relative shrink-0"
              >
                {isExternal ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full h-full cursor-pointer"
                  >
                    {SlideContent}
                  </a>
                ) : (
                  <Link href={href} className="block w-full h-full cursor-pointer">
                    {SlideContent}
                  </Link>
                )}
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {/* Modern Indicators (Dots) */}
      {count > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-20 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => api?.scrollTo(index)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                current === index
                  ? "bg-white w-6 sm:w-8 shadow-sm"
                  : "bg-white/40 hover:bg-white/70 w-1.5 sm:w-2"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeCarousel;
