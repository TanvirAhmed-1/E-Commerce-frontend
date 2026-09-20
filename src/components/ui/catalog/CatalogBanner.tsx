"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Sparkles, ShieldCheck, Truck, Award } from "lucide-react";

interface CatalogBannerProps {
  categoryName?: string;
  categoryTitle?: string;
  categorySubtitle?: string;
  categoryBanner?: string;
  categoryImage?: string;
}

export const CatalogBanner: React.FC<CatalogBannerProps> = ({
  categoryName = "Plastic Household",
  categoryTitle,
  categorySubtitle,
  categoryBanner,
  categoryImage,
}) => {
  const displayTitle = categoryTitle || categoryName || "All Products";
  const displaySubtitle =
    categorySubtitle ||
    "Durable and useful products for your everyday home needs. Quality you can trust.";
  const displayImage = categoryBanner || categoryImage;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-4">
      <div className="w-full relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-r from-[#070a12] via-[#0d1322] to-[#080d1a] shadow-xl shadow-slate-950/30 p-6 sm:p-8 md:p-10">
        {/* Subtle Ambient Decorative Glows */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          {/* Left Text & Breadcrumbs */}
          <div className="flex flex-col gap-4 max-w-2xl w-full">
            {/* Breadcrumbs Pill */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs text-slate-300 font-medium select-none w-fit px-3.5 py-1.5 rounded-full bg-white/10 dark:bg-white/5 border border-white/10 backdrop-blur-md shadow-xs"
            >
              <Link
                href="/"
                className="hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                Home
              </Link>
              <ChevronRight size={12} className="opacity-50 text-slate-400" />
              <Link
                href="/products"
                className="hover:text-emerald-400 transition-colors"
              >
                Categories
              </Link>
              <ChevronRight size={12} className="opacity-50 text-slate-400" />
              <span className="text-emerald-400 font-bold capitalize truncate max-w-[200px] sm:max-w-xs">
                {categoryName}
              </span>
            </nav>

            {/* H1 Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight capitalize">
              {displayTitle}
            </h1>

            {/* Subtitle / Tagline */}
            <p className="text-xs sm:text-sm md:text-base text-slate-300/90 leading-relaxed font-normal max-w-xl">
              {displaySubtitle}
            </p>

            {/* Quality & Service Trust Badges */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 text-[11px] sm:text-xs font-semibold">
              <span className="px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5 shadow-xs">
                <Sparkles size={13} className="text-emerald-400" /> 100% Genuine
              </span>
              <span className="px-3 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 flex items-center gap-1.5 shadow-xs">
                <ShieldCheck size={13} className="text-blue-400" /> Warranty Supported
              </span>
              <span className="px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center gap-1.5 shadow-xs">
                <Truck size={13} className="text-amber-400" /> Fast Delivery
              </span>
            </div>
          </div>

          {/* Right Banner Image Showcase (Cleanly Framed, NO Dark Fog Mask) */}
          {displayImage ? (
            <div className="w-full lg:w-[480px] xl:w-[520px] h-48 sm:h-56 md:h-60 rounded-2xl overflow-hidden border border-white/15 shadow-2xl relative shrink-0 group bg-slate-950/50">
              <img
                src={displayImage}
                alt={displayTitle}
                className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          ) : (
            <div className="w-full lg:w-[400px] h-44 rounded-2xl border border-white/10 bg-white/5 flex flex-col items-center justify-center p-6 text-center shrink-0">
              <Award size={36} className="text-emerald-400 mb-2 opacity-80" />
              <p className="text-white font-bold text-sm">{displayTitle}</p>
              <p className="text-slate-400 text-xs mt-0.5">Top-grade Household Collection</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogBanner;
