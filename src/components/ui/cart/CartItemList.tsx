"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";

interface CartItemListProps {
  items: any[];
  onQuantityChange: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export const CartItemList: React.FC<CartItemListProps> = ({
  items = [],
  onQuantityChange,
  onRemoveItem,
}) => {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const product = item.product || {};
        const variant = item.variant;
        const price = variant?.price || product.salePrice || product.basePrice || 0;
        const originalPrice = product.basePrice || price;
        const image = variant?.images?.[0] || product.thumbnail || "/placeholder.png";

        return (
          <div
            key={item._id}
            className="bg-white dark:bg-[#121320] p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            {/* Product Info & Thumbnail */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-[#f2f3ff] dark:bg-[#09090e] rounded-lg p-1 shrink-0 overflow-hidden flex items-center justify-center">
                <Image
                  src={image}
                  alt={product.name || "Product"}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex flex-col min-w-0">
                <Link
                  href={`/products/${product.slug || product._id}`}
                  className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1 hover:text-[#003820] dark:hover:text-[#95d4ac] transition-colors"
                >
                  {product.name}
                </Link>

                {variant && (
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Variant: {variant.name || "Selected Variant"}
                  </span>
                )}

                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xs sm:text-sm font-bold text-[#003820] dark:text-[#95d4ac]">
                    ৳ {price.toLocaleString("en-US")}
                  </span>
                  {originalPrice > price && (
                    <span className="text-[11px] text-slate-400 line-through">
                      ৳ {originalPrice.toLocaleString("en-US")}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Stepper, Total, and Remove */}
            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
              {/* Stepper */}
              <div className="flex items-center bg-[#f2f3ff] dark:bg-[#09090e] rounded-lg p-0.5 border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => onQuantityChange(item._id, Math.max(1, item.quantity - 1))}
                  className="w-7 h-7 bg-white dark:bg-[#121320] rounded text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs shadow-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-slate-900 dark:text-white">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onQuantityChange(item._id, item.quantity + 1)}
                  className="w-7 h-7 bg-white dark:bg-[#121320] rounded text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs shadow-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Subtotal */}
              <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white min-w-[70px] text-right">
                ৳ {(price * item.quantity).toLocaleString("en-US")}
              </span>

              {/* Remove */}
              <button
                type="button"
                onClick={() => onRemoveItem(item._id)}
                className="p-1.5 text-slate-400 hover:text-red-500 rounded transition-colors cursor-pointer"
                title="Remove item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartItemList;
