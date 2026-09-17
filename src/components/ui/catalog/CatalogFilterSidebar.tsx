"use client";

import React from "react";
import { Star } from "lucide-react";

interface CatalogFilterSidebarProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedPriceRange: string;
  onSelectPriceRange: (range: string) => void;
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  inStockOnly: boolean;
  onToggleInStock: (val: boolean) => void;
  selectedRating: number;
  onSelectRating: (rating: number) => void;
  onClearFilters: () => void;
}

export const CatalogFilterSidebar: React.FC<CatalogFilterSidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedPriceRange,
  onSelectPriceRange,
  selectedBrand,
  onSelectBrand,
  inStockOnly,
  onToggleInStock,
  selectedRating,
  onSelectRating,
  onClearFilters,
}) => {
  const categories = [
    "Plastic Household",
    "Kitchenware",
    "Rice Cookers",
    "Storage & Organization",
  ];

  const priceRanges = [
    { label: "৳ 0 - ৳ 500", val: "0-500" },
    { label: "৳ 500 - ৳ 1,000", val: "500-1000" },
    { label: "৳ 1,000 - ৳ 2,000", val: "1000-2000" },
    { label: "৳ 2,000+", val: "2000-99999" },
  ];

  const brands = ["RFL Plastics", "Pran Household", "Shine Cookware", "Prestige"];

  return (
    <aside className="w-full bg-white dark:bg-[#121320] rounded-xl p-5 border border-slate-200/70 dark:border-slate-800 shadow-xs flex flex-col gap-5">
      {/* Header & Reset */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
          Filters
        </h3>
        <button
          type="button"
          onClick={onClearFilters}
          className="text-xs text-[#003820] dark:text-[#95d4ac] font-bold hover:underline cursor-pointer"
        >
          Reset All
        </button>
      </div>

      {/* 1. Category */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Category
        </span>
        <div className="flex flex-col gap-1.5 text-xs text-slate-600 dark:text-slate-400">
          {categories.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2 cursor-pointer hover:text-[#003820] dark:hover:text-[#95d4ac] transition-colors"
            >
              <input
                type="radio"
                name="category_filter"
                checked={selectedCategory === cat}
                onChange={() => onSelectCategory(cat)}
                className="accent-[#003820] cursor-pointer"
              />
              <span className={selectedCategory === cat ? "font-bold text-slate-900 dark:text-white" : ""}>
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 2. Price Range */}
      <div className="flex flex-col gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Price Range
        </span>
        <div className="flex flex-col gap-1.5 text-xs text-slate-600 dark:text-slate-400">
          {priceRanges.map((range) => (
            <label
              key={range.val}
              className="flex items-center gap-2 cursor-pointer hover:text-[#003820] dark:hover:text-[#95d4ac] transition-colors"
            >
              <input
                type="radio"
                name="price_filter"
                checked={selectedPriceRange === range.val}
                onChange={() => onSelectPriceRange(range.val)}
                className="accent-[#003820] cursor-pointer"
              />
              <span className={selectedPriceRange === range.val ? "font-bold text-slate-900 dark:text-white" : ""}>
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 3. Brand */}
      <div className="flex flex-col gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Brand
        </span>
        <div className="flex flex-col gap-1.5 text-xs text-slate-600 dark:text-slate-400">
          {brands.map((b) => (
            <label
              key={b}
              className="flex items-center gap-2 cursor-pointer hover:text-[#003820] dark:hover:text-[#95d4ac] transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedBrand === b}
                onChange={() => onSelectBrand(selectedBrand === b ? "" : b)}
                className="accent-[#003820] cursor-pointer rounded"
              />
              <span className={selectedBrand === b ? "font-bold text-slate-900 dark:text-white" : ""}>
                {b}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 4. Availability */}
      <div className="flex flex-col gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Availability
        </span>
        <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onToggleInStock(e.target.checked)}
            className="accent-[#003820] cursor-pointer rounded"
          />
          <span className={inStockOnly ? "font-bold text-slate-900 dark:text-white" : ""}>
            In Stock Only
          </span>
        </label>
      </div>

      {/* 5. Customer Rating */}
      <div className="flex flex-col gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Customer Rating
        </span>
        <div className="flex flex-col gap-2 text-xs">
          {[5, 4, 3].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onSelectRating(selectedRating === star ? 0 : star)}
              className={`flex items-center gap-1.5 p-1 rounded transition-colors cursor-pointer text-left ${
                selectedRating === star
                  ? "bg-[#f2f3ff] dark:bg-slate-800 font-bold"
                  : "hover:bg-slate-50 dark:hover:bg-slate-850"
              }`}
            >
              <div className="flex text-amber-500">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={13}
                    className={i <= star ? "text-amber-500 fill-amber-500" : "text-slate-300 dark:text-slate-700"}
                  />
                ))}
              </div>
              <span className="text-slate-600 dark:text-slate-400 text-[11px]">&amp; Up</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default CatalogFilterSidebar;
