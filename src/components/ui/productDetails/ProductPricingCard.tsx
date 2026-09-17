"use client";

import React from "react";

interface ProductPricingCardProps {
  currentPrice: number;
  originalPrice?: number;
  discountBadge?: string;
  savingsAmount?: number;
  emiMonths?: number;
}

export const ProductPricingCard: React.FC<ProductPricingCardProps> = ({
  currentPrice,
  originalPrice = 5200,
  discountBadge = "-26% OFF",
  savingsAmount,
  emiMonths = 6,
}) => {
  const basePrice = originalPrice || currentPrice;
  const calculatedSavings = savingsAmount ?? (basePrice > currentPrice ? basePrice - currentPrice : 0);
  const emiPerMonth = Math.round(currentPrice / emiMonths);

  return (
    <div className="bg-[#f2f3ff] dark:bg-[#09090e] p-4 rounded-xl flex flex-col gap-2 border border-slate-100 dark:border-slate-800/60">
      {/* Price and Discount Row */}
      <div className="flex flex-wrap items-baseline gap-3">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl md:text-3xl font-black text-[#003820] dark:text-[#95d4ac] tracking-tight">
            ৳ {currentPrice.toLocaleString("en-US")}
          </span>
        </div>
        {basePrice > currentPrice && (
          <span className="text-base text-slate-400 dark:text-slate-500 line-through opacity-80">
            ৳ {basePrice.toLocaleString("en-US")}
          </span>
        )}
        {discountBadge && (
          <span className="bg-[#fd651e] text-white px-2 py-0.5 rounded text-xs font-bold shadow-xs">
            {discountBadge}
          </span>
        )}
      </div>

      {/* Savings & Tax Notice */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-850">
        {calculatedSavings > 0 ? (
          <div className="flex items-center gap-1.5 text-[#0f5132] dark:text-[#95d4ac] text-xs font-bold">
            <span className="material-symbols-outlined text-[17px]">savings</span>
            <span>You save ৳ {calculatedSavings.toLocaleString("en-US")} today!</span>
          </div>
        ) : (
          <div className="text-xs text-slate-500 dark:text-slate-400">Best price guaranteed</div>
        )}
        <span className="text-[11px] text-slate-500 dark:text-slate-400 bg-white dark:bg-[#121320] px-2 py-0.5 rounded border border-slate-200/60 dark:border-slate-800">
          Prices include all VAT & SD
        </span>
      </div>

      {/* EMI Option */}
      <div className="flex items-center gap-2 pt-1 text-xs text-slate-600 dark:text-slate-400">
        <span className="material-symbols-outlined text-[#003820] dark:text-[#95d4ac] text-[18px]">credit_card</span>
        <span>
          or <strong className="text-slate-900 dark:text-white">৳ {emiPerMonth.toLocaleString("en-US")}/month</strong> for {emiMonths} months 0% EMI with selected bank credit cards.
        </span>
      </div>
    </div>
  );
};

export default ProductPricingCard;
