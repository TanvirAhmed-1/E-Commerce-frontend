"use client";

import React from "react";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";

interface CheckoutOrderSummaryProps {
  items: any[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  onPlaceOrder: () => void;
  isPlacingOrder?: boolean;
}

export const CheckoutOrderSummary: React.FC<CheckoutOrderSummaryProps> = ({
  items = [],
  subtotal,
  deliveryCharge,
  discount,
  total,
  onPlaceOrder,
  isPlacingOrder = false,
}) => {
  return (
    <div className="bg-white dark:bg-[#121320] p-5 md:p-6 rounded-xl border border-slate-200/70 dark:border-slate-800 shadow-xs flex flex-col gap-4">
      <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
        Order Summary
      </h3>

      {/* Items list */}
      <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
        {items.map((item) => {
          const prod = item.product || {};
          const variant = item.variant;
          const price = variant?.price || prod.salePrice || prod.basePrice || 0;
          const image = variant?.images?.[0] || prod.thumbnail || "/placeholder.png";

          return (
            <div key={item._id} className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative w-10 h-10 bg-[#f2f3ff] dark:bg-[#09090e] rounded-md overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                  <Image src={image} alt={prod.name || "Item"} fill className="object-contain" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{prod.name}</span>
                  <span className="text-[11px] text-slate-500">Qty: {item.quantity}</span>
                </div>
              </div>

              <span className="font-bold text-slate-900 dark:text-white shrink-0">
                ৳ {(price * item.quantity).toLocaleString("en-US")}
              </span>
            </div>
          );
        })}
      </div>

      {/* Price breakdown */}
      <div className="flex flex-col gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            ৳ {subtotal.toLocaleString("en-US")}
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
          <span>Delivery Charge</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            ৳ {deliveryCharge.toLocaleString("en-US")}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between text-[#003820] dark:text-[#95d4ac] font-semibold">
            <span>Discount</span>
            <span>- ৳ {discount.toLocaleString("en-US")}</span>
          </div>
        )}

        <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between">
          <span className="font-bold text-sm text-slate-900 dark:text-white">Total</span>
          <span className="font-black text-lg text-[#003820] dark:text-[#95d4ac]">
            ৳ {total.toLocaleString("en-US")}
          </span>
        </div>
      </div>

      {/* Place Order CTA */}
      <button
        type="button"
        onClick={onPlaceOrder}
        disabled={isPlacingOrder || items.length === 0}
        className="w-full bg-[#003820] hover:bg-[#0f5132] text-white py-3.5 rounded-lg text-xs md:text-sm font-bold shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isPlacingOrder ? (
          <>
            <Spinner className="size-4 text-white animate-spin" />
            <span>অর্ডার প্রসেস হচ্ছে...</span>
          </>
        ) : (
          <>
            <span>Place Order</span>
            <span className="material-symbols-outlined text-[18px]">lock</span>
          </>
        )}
      </button>
    </div>
  );
};

export default CheckoutOrderSummary;
