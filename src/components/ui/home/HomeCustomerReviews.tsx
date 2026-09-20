"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Quote,
  CheckCircle2,
  Sparkles,
  MapPin,
} from "lucide-react";

interface ReviewItem {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
  initials: string;
  avatarColor: string;
  date: string;
  verified: boolean;
}

const REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    name: "Farhana Akter",
    location: "Dhaka",
    rating: 5,
    comment:
      "Product quality is really good. Delivery was on time. Very satisfied with the service!",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
    initials: "FA",
    avatarColor: "bg-emerald-700",
    date: "2 days ago",
    verified: true,
  },
  {
    id: "rev-2",
    name: "Rafiq Hasan",
    location: "Chittagong",
    rating: 5,
    comment:
      "The rice cooker works perfectly. Great service, authentic product and solid packaging.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop",
    initials: "RH",
    avatarColor: "bg-blue-700",
    date: "5 days ago",
    verified: true,
  },
  {
    id: "rev-3",
    name: "Sumaiya Islam",
    location: "Sylhet",
    rating: 5,
    comment:
      "Nice selection of plastic products and kitchenware. Fast delivery, will shop again!",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
    initials: "SI",
    avatarColor: "bg-purple-700",
    date: "1 week ago",
    verified: true,
  },
  {
    id: "rev-4",
    name: "Tanvir Ahmed",
    location: "Rajshahi",
    rating: 5,
    comment:
      "Ordered household storage boxes. Premium build quality and super fast dispatch. Highly recommend!",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop",
    initials: "TA",
    avatarColor: "bg-amber-700",
    date: "1 week ago",
    verified: true,
  },
  {
    id: "rev-5",
    name: "Nusrat Jahan",
    location: "Khulna",
    rating: 5,
    comment:
      "Exceptional shopping experience! The airtight jars exceeded my expectations. Genuine quality.",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop",
    initials: "NJ",
    avatarColor: "bg-rose-700",
    date: "2 weeks ago",
    verified: true,
  },
  {
    id: "rev-6",
    name: "Anisur Rahman",
    location: "Barisal",
    rating: 5,
    comment:
      "Genuinely impressed with their prompt customer support and original products. 10/10 service!",
    avatar:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=256&auto=format&fit=crop",
    initials: "AR",
    avatarColor: "bg-teal-700",
    date: "3 weeks ago",
    verified: true,
  },
];

export const HomeCustomerReviews: React.FC = () => {
  const [autoplay] = useState(() =>
    Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
    },
    [autoplay]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

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
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
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
  }, [emblaApi, onSelect]);

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full select-none">
      {/* Header Container */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-2">
            <Sparkles size={13} className="text-emerald-600 dark:text-emerald-400" />
            <span>Verified Testimonials</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Customer Reviews
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real feedback from thousands of satisfied customers across Bangladesh
          </p>
        </div>

        {/* Action / Slider Controls */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Average Rating Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              4.9/5.0
            </span>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={scrollPrev}
              type="button"
              aria-label="Previous review"
              className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-[#003820] hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white hover:border-transparent transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={scrollNext}
              type="button"
              aria-label="Next review"
              className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-[#003820] hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white hover:border-transparent transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Slider Viewport */}
      <div className="overflow-hidden cursor-grab active:cursor-grabbing -mx-2 px-2 py-2" ref={emblaRef}>
        <div className="flex">
          {REVIEWS.map((rev) => {
            const hasImgError = imageErrors[rev.id];

            return (
              <div
                key={rev.id}
                className="basis-[88%] sm:basis-[65%] md:basis-1/2 lg:basis-1/3 shrink-0 min-w-0 pr-4"
              >
                <div className="h-full bg-white dark:bg-[#121320] p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/90 shadow-xs hover:shadow-md hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
                  {/* Subtle decorative background quote */}
                  <Quote
                    size={56}
                    className="absolute -bottom-2 -right-2 text-slate-100 dark:text-slate-800/40 pointer-events-none transition-transform group-hover:scale-110 duration-500"
                  />

                  {/* Card Content */}
                  <div className="space-y-3.5 relative z-10">
                    {/* Top: Avatar & Info */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 ring-2 ring-emerald-500/20 shadow-xs bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          {!hasImgError ? (
                            <Image
                              src={rev.avatar}
                              alt={rev.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                              onError={() => handleImageError(rev.id)}
                            />
                          ) : (
                            <span
                              className={`w-full h-full text-white font-bold text-xs flex items-center justify-center ${rev.avatarColor}`}
                            >
                              {rev.initials}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {rev.name}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <MapPin size={11} className="text-slate-400" />
                            {rev.location}
                          </span>
                        </div>
                      </div>

                      {/* Verified Badge */}
                      {rev.verified && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/40 shrink-0">
                          <CheckCircle2 size={11} className="text-emerald-600 dark:text-emerald-400" />
                          <span className="hidden sm:inline">Verified</span>
                        </span>
                      )}
                    </div>

                    {/* Middle: Review Quote */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>

                  {/* Bottom: Stars & Date */}
                  <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < rev.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-200 dark:text-slate-700"
                          }
                        />
                      ))}
                    </div>

                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      {rev.date}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Dot Indicators */}
      {scrollSnaps.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-5">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide group ${index + 1}`}
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                selectedIndex === index
                  ? "bg-[#003820] dark:bg-emerald-400 w-7 shadow-xs"
                  : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 w-2"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HomeCustomerReviews;
