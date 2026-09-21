"use client";

import React from "react";
import toast from "react-hot-toast";
import { useProductContext } from "./ProductContext";

export const ProductQuantityAndActions: React.FC = () => {
  const {
    quantity,
    handleQuantityChange,
    maxStock,
    currentPrice,
    isOutOfStock,
    isAddingToCart,
    handleAddToCart,
    handleInstantBuy,
  } = useProductContext();

  const totalPrice = currentPrice * quantity;

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard!");
    }
  };

  const handleShareWhatsApp = () => {
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent("Check out this product!");
      window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, "_blank");
    }
  };

  return (
    <div className="flex flex-col gap-3 pt-2">
      {/* Quantity Stepper & CTA Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* Stepper */}
        <div className="flex items-center justify-between bg-[#f2f3ff] dark:bg-[#09090e] rounded-lg p-1 w-full sm:w-36 shrink-0 shadow-inner border border-slate-200/60 dark:border-slate-800">
          <button
            type="button"
            onClick={() => handleQuantityChange("minus")}
            disabled={quantity <= 1 || isOutOfStock}
            className="w-10 h-10 rounded-md bg-white dark:bg-[#121320] text-slate-800 dark:text-white flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-bold shadow-xs disabled:opacity-40 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">remove</span>
          </button>
          <span className="text-base font-bold text-slate-900 dark:text-white px-3 select-none">
            {isOutOfStock ? 0 : quantity}
          </span>
          <button
            type="button"
            onClick={() => handleQuantityChange("plus")}
            disabled={quantity >= maxStock || isOutOfStock}
            className="w-10 h-10 rounded-md bg-white dark:bg-[#121320] text-slate-800 dark:text-white flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-bold shadow-xs disabled:opacity-40 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
        </div>

        {/* Add to Cart CTA */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAddingToCart || isOutOfStock}
          className="flex-1 bg-[#0f5132] hover:bg-[#003820] text-white transition-all duration-200 py-3.5 px-6 rounded-lg text-xs md:text-sm font-bold shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
        >
          <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
          <span>
            {isOutOfStock
              ? "Out of Stock"
              : isAddingToCart
              ? "Adding..."
              : `Add to Cart • ৳ ${totalPrice.toLocaleString("en-US")}`}
          </span>
        </button>

        {/* Instant Buy CTA */}
        <button
          type="button"
          onClick={handleInstantBuy}
          disabled={isOutOfStock}
          className="bg-[#fd651e] hover:bg-[#a73a00] text-white transition-all duration-200 py-3.5 px-6 rounded-lg text-xs md:text-sm font-bold shadow flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer disabled:opacity-50 active:scale-[0.99]"
        >
          <span className="material-symbols-outlined text-[20px]">flash_on</span>
          <span>Buy Now</span>
        </button>
      </div>

      {/* Share Section */}
      <div className="flex items-center justify-end gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">Share Product:</span>
        <button
          type="button"
          onClick={handleCopyLink}
          className="p-1.5 rounded hover:bg-[#eaedff] dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-[#003820] dark:hover:text-[#95d4ac] transition-colors cursor-pointer"
          title="Copy Product Link"
        >
          <span className="material-symbols-outlined text-[18px]">share</span>
        </button>
        <button
          type="button"
          onClick={handleShareWhatsApp}
          className="p-1.5 rounded hover:bg-[#eaedff] dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-[#003820] dark:hover:text-[#95d4ac] transition-colors cursor-pointer"
          title="Share on WhatsApp"
        >
          <span className="material-symbols-outlined text-[18px]">chat</span>
        </button>
      </div>
    </div>
  );
};

export default ProductQuantityAndActions;
