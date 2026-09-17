"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CartOrderSummaryProps {
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  onProceedToCheckout?: () => void;
}

export const CartOrderSummary: React.FC<CartOrderSummaryProps> = ({
  subtotal,
  discount,
  deliveryCharge = 80,
  total,
  onProceedToCheckout,
}) => {
  const router = useRouter();

  const handleCheckout = () => {
    if (onProceedToCheckout) {
      onProceedToCheckout();
    } else {
      router.push("/checkout");
    }
  };

  return (
    <div className="bg-white dark:bg-[#121320] p-5 md:p-6 rounded-xl border border-slate-200/70 dark:border-slate-800 shadow-xs flex flex-col gap-4">
      <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
        Order Summary
      </h3>

      <div className="flex flex-col gap-2.5 text-xs">
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            ৳ {subtotal.toLocaleString("en-US")}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between text-[#003820] dark:text-[#95d4ac] font-semibold">
            <span>Discount</span>
            <span>- ৳ {discount.toLocaleString("en-US")}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
          <span>Delivery Charge</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            ৳ {deliveryCharge.toLocaleString("en-US")}
          </span>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between">
          <span className="font-bold text-sm text-slate-900 dark:text-white">Total</span>
          <span className="font-black text-lg text-[#003820] dark:text-[#95d4ac]">
            ৳ {total.toLocaleString("en-US")}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <button
          type="button"
          onClick={handleCheckout}
          className="w-full bg-[#003820] hover:bg-[#0f5132] text-white py-3 rounded-lg text-xs md:text-sm font-bold shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
        >
          <span>Proceed to Checkout</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>

        <Link
          href="/products"
          className="w-full bg-[#f2f3ff] hover:bg-slate-200 dark:bg-[#09090e] dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 py-2.5 rounded-lg text-xs font-semibold transition-colors text-center border border-slate-200 dark:border-slate-800"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default CartOrderSummary;
