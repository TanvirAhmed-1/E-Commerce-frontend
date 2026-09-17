"use client";

import React from "react";
import Link from "next/link";

export const HomeHero: React.FC = () => {
  return (
    <section className="w-full bg-[#f2f3ff] dark:bg-[#09090e] border-b border-slate-200/60 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline & CTAs */}
          <div className="md:col-span-6 flex flex-col gap-4">
            <span className="text-xs font-bold text-[#003820] dark:text-[#95d4ac] uppercase tracking-wider bg-[#b0f1c7]/40 dark:bg-[#0f5132]/60 px-3 py-1 rounded-full w-fit">
              Official Household Hub
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Everything Your Home Needs
            </h1>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
              Quality household and kitchen products, delivered safely to your doorstep across Bangladesh.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/products"
                className="bg-[#fd651e] hover:bg-[#a73a00] text-white font-bold px-6 py-3 rounded-lg text-xs md:text-sm shadow-md transition-all cursor-pointer active:scale-95"
              >
                Shop Now
              </Link>
              <Link
                href="/products"
                className="bg-white dark:bg-[#121320] text-[#003820] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold px-6 py-3 rounded-lg text-xs md:text-sm shadow-xs transition-all cursor-pointer"
              >
                Explore Categories
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Product Visual */}
          <div className="md:col-span-6 flex items-center justify-center relative">
            <div className="relative w-full aspect-[4/3] max-w-lg bg-white dark:bg-[#121320] rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden flex items-center justify-center">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBQPx0ClXeLOyEyW7rduqs2_uozwRdKPhI9QxdGEV15t4KU5ChYGsNHQExxZiuFTPfKD1kR70iBtEvDp_COwkKwevFUyHnRj1BqamdABr-mXLxZVVpNRqCO5jJ8a6vabbJY6b8bBXYDMJFg7-pHppv5hrYxi_A17FH96XW4rcpEgLUMnwzvjYlBivV4TrSHtlcEGmURy5EOaLRLDbByVOCIH4CJRDy00YVVs8_LFY8RU5vkisSTH5qkQ"
                alt="Everything Your Home Needs Showcase"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3 right-3 bg-[#003820] text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-xs">
                Top Deals 2025
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
