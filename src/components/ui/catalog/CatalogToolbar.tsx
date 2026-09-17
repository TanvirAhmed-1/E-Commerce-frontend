"use client";

import React from "react";

interface CatalogToolbarProps {
  totalCount: number;
  currentCount: number;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

export const CatalogToolbar: React.FC<CatalogToolbarProps> = ({
  totalCount,
  currentCount,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="w-full bg-white dark:bg-[#121320] p-3 md:p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
      {/* Results Count */}
      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
        Showing <strong className="text-slate-900 dark:text-white">1-{currentCount}</strong> of{" "}
        <strong className="text-slate-900 dark:text-white">{totalCount}</strong> products
      </span>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-[#f2f3ff] dark:bg-[#09090e] border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="-createdAt">Popularity</option>
            <option value="salePrice">Price: Low to High</option>
            <option value="-salePrice">Price: High to Low</option>
            <option value="-averageRating">Average Rating</option>
          </select>
        </div>

        {/* Grid/List View Toggle */}
        <div className="flex items-center bg-[#f2f3ff] dark:bg-[#09090e] rounded-lg p-0.5 border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            className={`p-1 rounded cursor-pointer ${
              viewMode === "grid"
                ? "bg-white dark:bg-[#121320] text-[#003820] dark:text-[#95d4ac] shadow-xs"
                : "text-slate-400 hover:text-slate-700"
            }`}
            title="Grid View"
          >
            <span className="material-symbols-outlined text-[18px]">grid_view</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            className={`p-1 rounded cursor-pointer ${
              viewMode === "list"
                ? "bg-white dark:bg-[#121320] text-[#003820] dark:text-[#95d4ac] shadow-xs"
                : "text-slate-400 hover:text-slate-700"
            }`}
            title="List View"
          >
            <span className="material-symbols-outlined text-[18px]">view_list</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CatalogToolbar;
