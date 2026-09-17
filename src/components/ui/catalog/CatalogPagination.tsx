"use client";

import React from "react";

interface CatalogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const CatalogPagination: React.FC<CatalogPaginationProps> = ({
  currentPage = 1,
  totalPages = 4,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1.5 py-6">
      {pages.map((p) => {
        const isActive = p === currentPage;
        return (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isActive
                ? "bg-[#003820] text-white shadow-xs"
                : "bg-white dark:bg-[#121320] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {p}
          </button>
        );
      })}

      {currentPage < totalPages && (
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          className="w-9 h-9 rounded-lg text-xs font-bold bg-white dark:bg-[#121320] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </button>
      )}
    </div>
  );
};

export default CatalogPagination;
