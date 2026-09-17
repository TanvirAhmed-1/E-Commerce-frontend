"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, Sparkles } from "lucide-react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export interface ISlideItem {
  _id?: string;
  title?: string;
  image: string;
  link?: string;
  badge?: string;
}

interface HeroCarouselClientProps {
  slides: ISlideItem[];
}

export default function HeroCarouselClient({ slides }: HeroCarouselClientProps) {
  const autoplay = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api, slides]);

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
            const isExternal =
              item.link?.startsWith("http://") || item.link?.startsWith("https://");
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

                {/* Gradient and Content Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 sm:p-6 md:p-8 lg:p-10">
                  <div className="max-w-2xl space-y-1.5 sm:space-y-2">
                    {item.badge && (
                      <span className="inline-flex items-center gap-1 text-[9px] sm:text-[11px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full w-fit border border-white/25 shadow-sm">
                        <Sparkles size={11} className="text-amber-300" />
                        {item.badge}
                      </span>
                    )}

                    {item.title && (
                      <h2 className="text-white text-base sm:text-2xl md:text-3xl lg:text-3xl font-black tracking-tight leading-tight drop-shadow-md">
                        {item.title}
                      </h2>
                    )}

                    <div className="pt-1 flex items-center">
                      <span className="inline-flex items-center gap-1.5 bg-[#fd651e] hover:bg-[#a73a00] text-white font-bold text-[11px] sm:text-xs md:text-sm px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-md transition-all transform active:scale-95 group-hover:gap-2.5 cursor-pointer">
                        Shop Now
                        <ArrowRight
                          size={13}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );

            return (
              <CarouselItem
                key={item._id || index}
                className="pl-0 w-full h-[180px] sm:h-[240px] md:h-[300px] lg:h-[340px] xl:h-[360px] relative shrink-0"
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

      {/* Modern Dots Indicators - No Left/Right Arrow Buttons */}
      {count > 1 && (
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-1.5 z-20 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/10">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => api?.scrollTo(index)}
              className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                current === index
                  ? "bg-white w-5 sm:w-6 shadow-sm"
                  : "bg-white/40 hover:bg-white/70 w-1 sm:w-1.5"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
