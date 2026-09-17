"use client";

import React from "react";
import Link from "next/link";

interface CatalogBannerProps {
  categoryTitle?: string;
  categorySubtitle?: string;
}

export const CatalogBanner: React.FC<CatalogBannerProps> = ({
  categoryTitle = "Plastic Household Products",
  categorySubtitle = "Durable and useful plastic products for your everyday home needs. Quality you can trust.",
}) => {
  return (
    <div className="w-full bg-[#f2f3ff] dark:bg-[#09090e] border-b border-slate-200/60 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
          <Link href="/" className="hover:text-[#003820] dark:hover:text-[#95d4ac] font-medium">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#003820] dark:hover:text-[#95d4ac] font-medium">
            Categories
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-bold">{categoryTitle}</span>
        </nav>

        {/* Banner Grid */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-xl">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {categoryTitle}
            </h1>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {categorySubtitle}
            </p>
          </div>

          <div className="w-full md:w-64 h-28 bg-white dark:bg-[#121320] rounded-xl p-2 shadow-xs border border-slate-200/60 dark:border-slate-800 flex items-center justify-center shrink-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBQPx0ClXeLOyEyW7rduqs2_uozwRdKPhI9QxdGEV15t4KU5ChYGsNHQExxZiuFTPfKD1kR70iBtEvDp_COwkKwevFUyHnRj1BqamdABr-mXLxZVVpNRqCO5jJ8a6vabbJY6b8bBXYDMJFg7-pHppv5hrYxi_A17FH96XW4rcpEgLUMnwzvjYlBivV4TrSHtlcEGmURy5EOaLRLDbByVOCIH4CJRDy00YVVs8_LFY8RU5vkisSTH5qkQ"
              alt="Category Banner Preview"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogBanner;
