"use client";

import React from "react";
import Link from "next/link";
import { getDisplayPrice } from "@/utils/priceHelper";
import { renderStars } from "@/utils/renderStars";

interface CatalogProductGridProps {
  products: any[];
  isLoading?: boolean;
  onAddToCart: (e: React.MouseEvent, product: any) => void;
  customerType?: string | null;
  viewMode?: "grid" | "list";
}

export const CatalogProductGrid: React.FC<CatalogProductGridProps> = ({
  products = [],
  isLoading = false,
  onAddToCart,
  customerType,
  viewMode = "grid",
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white dark:bg-[#121320] rounded-xl p-4 animate-pulse h-72 border border-slate-150 dark:border-slate-800" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white dark:bg-[#121320] rounded-xl p-12 text-center border border-slate-200/70 dark:border-slate-800 flex flex-col items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">inventory_2</span>
        <h4 className="font-bold text-sm text-slate-800 dark:text-white">No products found</h4>
        <p className="text-xs text-slate-500 mt-1">Try adjusting your category or filter selections.</p>
      </div>
    );
  }

  return (
    <div className={viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-3"}>
      {products.map((prod) => {
        const price = getDisplayPrice(prod, customerType) || prod.salePrice || prod.basePrice;
        const original = prod.basePrice || price;
        const discount = prod.productDiscount || (original > price ? Math.round(((original - price) / original) * 100) : 0);

        return (
          <div
            key={prod._id}
            className={`bg-white dark:bg-[#121320] rounded-xl p-4 border border-slate-200/70 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex justify-between group ${
              viewMode === "list" ? "flex-row items-center gap-4" : "flex-col"
            }`}
          >
            <Link
              href={`/products/${prod.slug || prod._id}`}
              className={`flex ${viewMode === "list" ? "flex-row items-center gap-4 flex-1" : "flex-col gap-2"}`}
            >
              <div
                className={`relative bg-[#f2f3ff] dark:bg-[#09090e] rounded-lg p-3 flex items-center justify-center overflow-hidden shrink-0 ${
                  viewMode === "list" ? "w-28 h-28" : "w-full aspect-square"
                }`}
              >
                {discount > 0 && (
                  <span className="absolute top-2 left-2 bg-[#fd651e] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs z-10">
                    -{discount}%
                  </span>
                )}
                <img
                  src={prod.thumbnail || "/placeholder.png"}
                  alt={prod.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex flex-col gap-1 flex-1">
                <div className="flex items-center gap-1 text-amber-500 text-xs">
                  {renderStars(prod.averageRating || 4.8)}
                  <span className="font-bold text-slate-800 dark:text-white text-xs ml-1">
                    {(prod.averageRating || 4.8).toFixed(1)}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-[#003820] dark:hover:text-[#95d4ac] transition-colors">
                  {prod.name}
                </h3>
              </div>
            </Link>

            <div
              className={`flex flex-col gap-2 pt-2 border-slate-100 dark:border-slate-800 ${
                viewMode === "list" ? "shrink-0 w-36" : "border-t mt-2"
              }`}
            >
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-[#003820] dark:text-[#95d4ac]">
                  ৳ {price.toLocaleString("en-US")}
                </span>
                {original > price && (
                  <span className="text-xs text-slate-400 line-through">
                    ৳ {original.toLocaleString("en-US")}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={(e) => onAddToCart(e, prod)}
                className="w-full bg-[#003820] hover:bg-[#0f5132] text-white py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CatalogProductGrid;
