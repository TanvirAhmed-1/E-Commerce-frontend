"use client";

import React from "react";

interface ProductHeaderInfoProps {
  storeName?: string;
  stockCount: number;
  productName: string;
  rating?: number;
  totalRatingsCount?: number;
  answeredQuestionsCount?: number;
  unitsSoldCount?: string;
  onReviewsClick?: () => void;
}

export const ProductHeaderInfo: React.FC<ProductHeaderInfoProps> = ({
  storeName = "Prestige Bangladesh Official Store",
  stockCount,
  productName,
  rating = 4.8,
  totalRatingsCount = 142,
  answeredQuestionsCount = 58,
  unitsSoldCount = "2.4k+",
  onReviewsClick,
}) => {
  const isInStock = stockCount > 0;

  return (
    <div className="flex flex-col gap-2">
      {/* Official store badge & Stock status */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="bg-[#eaedff] dark:bg-[#1e1e38] px-2.5 py-0.5 rounded text-[#003820] dark:text-[#95d4ac] font-bold text-[11px] tracking-wider uppercase">
          {storeName}
        </span>
        <div className="flex items-center gap-1.5 text-xs font-bold">
          {isInStock ? (
            <>
              <span className="w-2 h-2 rounded-full bg-[#003820] dark:bg-[#00e5a3] animate-pulse"></span>
              <span className="text-[#003820] dark:text-[#95d4ac]">
                In Stock (Dhaka Hub - Ready to Dispatch)
              </span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="text-red-500 font-bold">Currently Out of Stock</span>
            </>
          )}
        </div>
      </div>

      {/* Product Title Headline */}
      <h1 className="text-xl md:text-2xl lg:text-[24px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
        {productName}
      </h1>

      {/* Ratings & Q&A counter */}
      <div className="flex flex-wrap items-center gap-3 py-1 text-xs">
        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200/60 dark:border-amber-900/40">
          <div className="flex text-amber-500">
            <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
            <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
            <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
            <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
            <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              star_half
            </span>
          </div>
          <span className="font-bold text-amber-900 dark:text-amber-400 text-xs">
            {rating.toFixed(1)}
          </span>
        </div>

        <button
          type="button"
          onClick={onReviewsClick}
          className="text-[#003820] dark:text-[#95d4ac] hover:underline font-semibold cursor-pointer"
        >
          {totalRatingsCount} Customer Ratings
        </button>

        <span className="text-slate-300 dark:text-slate-700">•</span>

        <span className="text-slate-500 dark:text-slate-400">
          {answeredQuestionsCount} Answered Questions
        </span>

        <span className="text-slate-300 dark:text-slate-700">•</span>

        <span className="text-slate-500 dark:text-slate-400">
          {unitsSoldCount} Units Sold
        </span>
      </div>
    </div>
  );
};

export default ProductHeaderInfo;
