"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Layers,
  ShoppingBag,
} from "lucide-react";
import { useGetMenuCategoryQuery } from "@/redux/features/home/homeApi";

interface ParentCategory {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  thumbnail?: string;
  icon?: string;
  description?: string;
  productsCount?: number;
  children?: any[];
}

export const CategoryIconsRow: React.FC = () => {
  const { data: menuCategoryRes, isLoading } = useGetMenuCategoryQuery(undefined);

  const [autoplay] = useState(() =>
    Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
      dragFree: true,
    },
    [autoplay]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Extract all parent categories directly from the API response
  const parentCategories: ParentCategory[] = useMemo(() => {
    const rawData = menuCategoryRes?.data;
    if (Array.isArray(rawData)) {
      return rawData;
    }
    return [];
  }, [menuCategoryRes]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect, parentCategories]);

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  // Loading skeleton state
  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-6 w-full">
        <div className="flex items-center justify-between mb-5">
          <div className="space-y-2">
            <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
            <div className="h-7 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="w-9 h-9 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
            <div className="w-9 h-9 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#121320] p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 animate-pulse flex flex-col items-center gap-3"
            >
              <div className="w-20 h-20 rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-3 w-16 bg-slate-100 dark:bg-slate-850 rounded" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // If no parent categories from API, do not render empty section
  if (parentCategories.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-6 w-full select-none">
      {/* Header Container */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
        <div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore Categories
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Browse our wide range of products by parent department
          </p>
        </div>

        {/* Action / Slider Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Link
            href="/products"
            className="hidden md:inline-flex items-center gap-1 text-xs font-bold text-[#003820] dark:text-[#95d4ac] hover:text-[#fd651e] dark:hover:text-[#fd651e] transition-colors mr-2 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>

          {parentCategories.length > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={scrollPrev}
                type="button"
                aria-label="Previous categories"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-[#003820] hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white hover:border-transparent transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <ChevronLeft size={17} />
              </button>
              <button
                onClick={scrollNext}
                type="button"
                aria-label="Next categories"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-[#003820] hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white hover:border-transparent transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Categories Carousel */}
      <div
        className="overflow-hidden cursor-grab active:cursor-grabbing -mx-2 px-2 py-2"
        ref={emblaRef}
      >
        <div className="flex">
          {parentCategories.map((cat) => {
            const catId = cat._id || cat.slug || cat.name;
            const catImage = cat.image || cat.thumbnail;
            const hasImgError = imageErrors[catId] || !catImage;
            const categoryHref = `/products?category=${encodeURIComponent(cat.slug || cat.name)}`;
            const subCount = cat.children?.length;

            return (
              <div
                key={catId}
                className="basis-[68%] sm:basis-[42%] md:basis-1/3 lg:basis-1/4 xl:basis-1/5 shrink-0 min-w-0 pr-3.5"
              >
                <Link
                  href={categoryHref}
                  className="bg-white dark:bg-[#121320] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-300 flex flex-col items-center text-center group h-full relative overflow-hidden"
                >
                  {/* Category Image Container */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden mb-3.5 ring-4 ring-slate-100 dark:ring-slate-800/80 group-hover:ring-emerald-500/30 dark:group-hover:ring-emerald-400/30 group-hover:scale-105 transition-all duration-300 shadow-sm bg-slate-50 dark:bg-slate-800 shrink-0 flex items-center justify-center">
                    {!hasImgError && catImage ? (
                      <Image
                        src={catImage}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 768px) 100px, 120px"
                        className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                        onError={() => handleImageError(catId)}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100/50 dark:from-emerald-950/40 dark:to-slate-900 text-[#003820] dark:text-[#95d4ac]">
                        <Layers size={28} className="text-emerald-600 dark:text-emerald-400 mb-1" />
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                          {cat.name?.slice(0, 2) || "CAT"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Title & Subcategory Details */}
                  <div className="flex flex-col items-center w-full">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-1 w-full">
                      {cat.name}
                    </span>

                    {cat.description && (
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {cat.description}
                      </span>
                    )}

                    {typeof subCount === "number" && subCount > 0 && (
                      <span className="mt-2 text-[10px] font-semibold text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 flex items-center gap-1 transition-colors">
                        <ShoppingBag size={11} />
                        <span>{subCount} Subcategories</span>
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile/Tablet Pagination Dots */}
      {scrollSnaps.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-4 sm:hidden">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => scrollTo(index)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                selectedIndex === index
                  ? "bg-[#003820] dark:bg-emerald-400 w-5 shadow-xs"
                  : "bg-slate-200 dark:bg-slate-700 w-1.5"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default CategoryIconsRow;
