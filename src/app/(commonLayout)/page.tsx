import React, { Suspense } from "react";
import HeroCarousel from "@/components/ui/home/HeroCarousel";
import HeroCarouselSkeleton from "@/components/ui/home/HeroCarouselSkeleton";
import HomeMainContent from "@/components/ui/home/HomeMainContent";

export default function Home() {
  return (
    <div className="w-full flex flex-col gap-2">
      {/* 1. Server-Side Sliders Carousel with Suspense Streaming */}
      <section className="w-full">
        <Suspense fallback={<HeroCarouselSkeleton />}>
          <HeroCarousel />
        </Suspense>
      </section>

      {/* 2. Interactive Client Content */}
      <HomeMainContent />
    </div>
  );
}
