"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useGetActiveBannersQuery } from "@/redux/features/banner/bannerApi";

// Default Fallback Banner matching the brand aesthetic
const defaultBanners = [
  {
    _id: "default-1",
    title: "Upgrade Your Everyday Kitchen",
    subtitle: "LIMITED EDITION KITCHEN GEAR",
    description:
      "Experience the joy of effortless culinary mastery with authentic heavy-gauge cookers, steamers, and food processors.",
    buttonText: "Explore Appliances",
    buttonLink: "/products?category=Kitchenware",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCMJFzKFUf-nE5Yign340ZIpZcnhXX35cT0WqmzuJmVsuPm0eDjgK3kOHi0YrJW4jkirnkRlOs-hGHN-GuozjonjNFoED07EFNkPjS6Nx2WK6l2kyj3Ic4bUdj7fhc7cpjCDrnxd6_dTKLMl7Ku3xYzwpo-9ZV9Q_-AK5ve274yYgb0cKQlu6PvpmXWMWPjaftw6Lepn4JuQTa0erPseWLNl66x3FFE9sdOI--PNrKzoB2IXQ1O0jm2wA",
    bgColor: "#003820",
    textColor: "#ffffff",
    badgeColor: "#b0f1c7",
    buttonBgColor: "#fd651e",
  },
];

export const HomePromoBanner: React.FC = () => {
  const { data: bannerRes, isLoading } = useGetActiveBannersQuery(undefined);

  // Extract banners array with fallback
  const banners = useMemo(() => {
    if (bannerRes?.data && Array.isArray(bannerRes.data) && bannerRes.data.length > 0) {
      return bannerRes.data;
    }
    if (Array.isArray(bannerRes) && bannerRes.length > 0) {
      return bannerRes;
    }
    return defaultBanners;
  }, [bannerRes]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const bannerCount = banners.length;
  const isSlider = bannerCount > 1;

  // Auto-play interval (5.5 seconds), pause on hover
  useEffect(() => {
    if (!isSlider || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerCount);
    }, 5500);

    return () => clearInterval(timer);
  }, [bannerCount, isSlider, isHovered]);

  // Keep currentIndex in bounds if banners count changes
  useEffect(() => {
    if (currentIndex >= bannerCount) {
      setCurrentIndex(0);
    }
  }, [bannerCount, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? bannerCount - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % bannerCount);
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && isSlider) {
      handleNext();
    }
    if (isRightSwipe && isSlider) {
      handlePrev();
    }
  };

  const activeBanner = banners[currentIndex] || defaultBanners[0];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-6 w-full select-none">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          backgroundColor: activeBanner.bgColor || "#003820",
        }}
        className="rounded-2xl p-6 sm:p-8 md:p-10 relative overflow-hidden shadow-xl transition-colors duration-700 ease-in-out group"
      >
        {/* Subtle Decorative Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-black/10 rounded-full blur-2xl pointer-events-none -ml-16 -mb-16" />

        {/* Banner Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center relative z-10">
          {/* Left Column: Text & CTA */}
          <div className="md:col-span-7 flex flex-col gap-3.5 transition-all duration-500 ease-out">
            {activeBanner.subtitle && (
              <div className="inline-flex items-center">
                <span
                  style={{
                    color: activeBanner.badgeColor || "#b0f1c7",
                    backgroundColor: `${activeBanner.badgeColor || "#b0f1c7"}15`,
                  }}
                  className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-white/10"
                >
                  {activeBanner.subtitle}
                </span>
              </div>
            )}

            <h2
              style={{ color: activeBanner.textColor || "#ffffff" }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-black tracking-tight leading-tight drop-shadow-sm"
            >
              {activeBanner.title}
            </h2>

            {activeBanner.description && (
              <p className="text-xs sm:text-sm text-slate-200/90 max-w-lg leading-relaxed">
                {activeBanner.description}
              </p>
            )}

            <div className="pt-2 sm:pt-3">
              <Link
                href={activeBanner.buttonLink || "/products"}
                style={{
                  backgroundColor: activeBanner.buttonBgColor || "#fd651e",
                }}
                className="inline-flex items-center gap-2.5 text-white font-bold px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-black/20 hover:brightness-110 active:scale-95 transition-all duration-200 group/btn"
              >
                <span>{activeBanner.buttonText || "Explore Now"}</span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover/btn:translate-x-1"
                />
              </Link>
            </div>
          </div>

          {/* Right Column: Promotional Image */}
          <div className="md:col-span-5 flex items-center justify-center">
            <div className="relative w-full aspect-[4/3] max-w-sm rounded-xl overflow-hidden flex items-center justify-center p-2">
              <img
                key={activeBanner.imageUrl || currentIndex}
                src={activeBanner.imageUrl}
                alt={activeBanner.title || "Promotional Banner"}
                className="w-full h-full object-contain filter drop-shadow-2xl transition-all duration-500 transform hover:scale-105"
                loading="eager"
              />
            </div>
          </div>
        </div>

        {/* Carousel Navigation Arrows (Visible on hover if multiple banners) */}
        {isSlider && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                handlePrev();
              }}
              aria-label="Previous Slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 active:scale-90"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                handleNext();
              }}
              aria-label="Next Slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 active:scale-90"
            >
              <ChevronRight size={20} />
            </button>

            {/* Slider Dots / Pagination Indicators */}
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-20">
              {banners.map((_: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? "w-7 bg-white shadow-md"
                      : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default HomePromoBanner;
