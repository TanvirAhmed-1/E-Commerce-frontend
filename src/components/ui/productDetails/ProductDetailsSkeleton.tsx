"use client";

import React from "react";

export const ProductDetailsSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 w-full animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="h-5 w-64 bg-slate-200 dark:bg-slate-800 rounded mb-6"></div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column Gallery Skeleton */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="w-full aspect-square bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            ))}
          </div>
        </div>

        {/* Right Column Details Skeleton */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white dark:bg-[#121320] p-6 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col gap-4">
            <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-16 w-full bg-slate-100 dark:bg-slate-900 rounded-xl"></div>
            <div className="h-10 w-full bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
