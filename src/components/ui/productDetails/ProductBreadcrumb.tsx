"use client";

import React from "react";
import Link from "next/link";
import { useProductContext } from "./ProductContext";

export const ProductBreadcrumb: React.FC = () => {
  const { product } = useProductContext();

  const categoryName = product?.category?.name;
  const subCategoryName = product?.subCategory?.name;
  const productName = product?.name;
  const sku = product?.sku;

  return (
    <div className="w-full bg-white dark:bg-[#121320] shadow-xs border-b border-slate-100 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 flex-wrap">
          <Link
            href="/"
            className="hover:text-[#003820] dark:hover:text-[#95d4ac] transition-colors flex items-center gap-1 font-medium"
          >
            <span className="material-symbols-outlined text-[16px]">home</span>
            <span>Home</span>
          </Link>
          {categoryName && (
            <>
              <span className="text-slate-300 dark:text-slate-600">/</span>
              <Link
                href={`/products?category=${encodeURIComponent(categoryName)}`}
                className="hover:text-[#003820] dark:hover:text-[#95d4ac] transition-colors font-medium"
              >
                {categoryName}
              </Link>
            </>
          )}
          {subCategoryName && (
            <>
              <span className="text-slate-300 dark:text-slate-600">/</span>
              <Link
                href={`/products?category=${encodeURIComponent(subCategoryName)}`}
                className="hover:text-[#003820] dark:hover:text-[#95d4ac] transition-colors font-medium"
              >
                {subCategoryName}
              </Link>
            </>
          )}
          {productName && (
            <>
              <span className="text-slate-300 dark:text-slate-600">/</span>
              <span className="text-slate-900 dark:text-white font-semibold truncate max-w-xs md:max-w-md">
                {productName}
              </span>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4 text-xs font-semibold text-[#003820] dark:text-[#95d4ac]">
          <span className="flex items-center gap-1 bg-[#b0f1c7] dark:bg-[#0f5132]/60 text-[#002111] dark:text-[#b0f1c7] px-2.5 py-0.5 rounded-full text-[11px] font-bold">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            100% Authentic Guaranteed
          </span>
          {sku && (
            <span className="text-slate-400 dark:text-slate-500 font-mono hidden sm:inline text-[11px]">
              SKU: {sku}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductBreadcrumb;
