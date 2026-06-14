"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { useGetHomeSlidersQuery } from "@/redux/features/home/homeApi";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface ISlider {
  _id: string;
  title?: string;
  image: string;
  link?: string;
  priority: number;
  isActive: boolean;
}

const DEFAULT_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop",
    title: "Summer Collection",
  },
  {
    image: "https://images.unsplash.com/photo-1472851294608-062f824d296e?q=80&w=1200&auto=format&fit=crop",
    title: "New Arrivals",
  },
  {
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop",
    title: "Exclusive Offers",
  },
];

const HomeCarousel = () => {
  const { data: sliderResponse, isLoading } = useGetHomeSlidersQuery(undefined);
  
  const autoplay = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );
  
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  // Extract sliders or fallback to default slides
  const slides = React.useMemo(() => {
    if (sliderResponse?.data && sliderResponse.data.length > 0) {
      return sliderResponse.data.map((slider: ISlider) => ({
        image: slider.image,
        title: slider.title || "Special Offer",
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
      <div className="w-full h-[270px] md:h-[400px] lg:h-[600px] bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center">
        <span className="text-gray-400 font-medium">Loading slider...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center">
      <Carousel
        setApi={setApi}
        className="w-full rounded-2xl overflow-hidden"
        plugins={[autoplay.current]}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {slides.map((item: { image: string; title: string }, index: number) => (
            <CarouselItem
              key={index}
              className="w-full h-[270px] md:h-[400px] lg:h-[600px]"
            >
              <div className="h-full w-full relative flex justify-center">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  priority={index === 0}
                  className="rounded-2xl object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                />
                {/* Visual Overlay for text readability if title is present */}
                {item.title && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent flex items-end p-6 md:p-12 rounded-2xl">
                    <h3 className="text-white text-xl md:text-3xl font-extrabold tracking-tight">
                      {item.title}
                    </h3>
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => api?.scrollTo(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              current === index ? "bg-blue-500 w-6" : "bg-gray-300 w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeCarousel;
