"use client";

import React from "react";
import { useProductContext } from "./ProductContext";

export const ProductPricingCard: React.FC = () => {
  const { currentPrice, originalPrice, discountPercentage } = useProductContext();

  const savingsAmount = originalPrice && originalPrice > currentPrice ? originalPrice - currentPrice : 0;

  return (
    <div className="bg-[#f2f3ff] dark:bg-[#09090e] p-4 rounded-xl flex flex-col gap-2 border border-slate-100 dark:border-slate-800/60">
      {/* Price and Discount Row */}
      <div className="flex flex-wrap items-baseline gap-3">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl md:text-3xl font-black text-[#003820] dark:text-[#95d4ac] tracking-tight">
            ৳ {currentPrice.toLocaleString("en-US")}
          </span>
        </div>
        {originalPrice && originalPrice > currentPrice && (
          <span className="text-base text-slate-400 dark:text-slate-500 line-through opacity-80">
            ৳ {originalPrice.toLocaleString("en-US")}
          </span>
        )}
        {discountPercentage && (
          <span className="bg-[#fd651e] text-white px-2 py-0.5 rounded text-xs font-bold shadow-xs">
            -{discountPercentage}% OFF
          </span>
        )}
      </div>

      {/* Savings Notice */}
      {savingsAmount > 0 && (
        <div className="flex items-center gap-1.5 text-[#0f5132] dark:text-[#95d4ac] text-xs font-bold pt-1 border-t border-slate-200/60 dark:border-slate-850">
          <span className="material-symbols-outlined text-[17px]">savings</span>
          <span>You save ৳ {savingsAmount.toLocaleString("en-US")} today!</span>
        </div>
      )}
    </div>
  );
};

export default ProductPricingCard;
