"use client";

import React from "react";
import Link from "next/link";
import { CreditCard, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderManifestProps {
  totalAmount: number;
  vat: number;
  shipping: number;
  grandTotal: number;
}

export default function OrderManifest({ totalAmount, vat, shipping, grandTotal }: OrderManifestProps) {
  return (
    <div className="bg-[#121320] rounded-3xl border border-slate-800/60 p-6 md:p-8 shadow-xl flex flex-col gap-6">
      <h3 className="font-extrabold text-white text-lg pb-4 border-b border-slate-800/60 tracking-wide">
        Order Manifest
      </h3>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between text-xs text-slate-400 font-medium">
          <span>Subtotal</span>
          <span className="text-slate-200 font-bold">৳{totalAmount}</span>
        </div>
        <div className="flex justify-between text-xs text-slate-400 font-medium">
          <span>Expedited Shipping</span>
          <span className="text-[#00e5a3] font-bold">
            {shipping === 0 ? "FREE" : `৳${shipping}`}
          </span>
        </div>
        <div className="flex justify-between text-xs text-slate-400 font-medium">
          <span>Estimated Tax (5%)</span>
          <span className="text-slate-200 font-bold">৳{vat}</span>
        </div>
      </div>

      {/* PROMO CODE BOX */}
      <div className="flex flex-col gap-2 pt-4 border-t border-slate-800/60">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Access Protocol (Promo)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="APEX-OFFLINE"
            className="flex-1 bg-[#09090e] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#5f5eff]/50 transition-colors uppercase"
          />
          <button className="bg-[#151522] hover:bg-[#1f1f33] text-white font-bold text-xs px-4 rounded-lg border border-slate-800 transition-colors cursor-pointer">
            Apply
          </button>
        </div>
      </div>

      {/* Grand Total */}
      <div className="pt-6 border-t border-slate-800/60 flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total</span>
          <span className="text-[9px] font-bold tracking-wider text-slate-500 mt-1 uppercase">BDT CREDITS</span>
        </div>
        <span className="text-3xl font-black text-white tracking-tight">৳{grandTotal}</span>
      </div>

      <Button
        asChild
        className="w-full bg-[#5f5eff] hover:bg-[#4d4cff] text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#5f5eff]/10 transition-all active:scale-95 cursor-pointer mt-2 text-xs uppercase tracking-wider"
      >
        <Link href="/checkout">
          Proceed to Checkout <Zap size={14} className="fill-white" />
        </Link>
      </Button>

      {/* Payment Methods */}
      <div className="grid grid-cols-4 gap-2.5 pt-2">
        <div className="h-9 bg-[#09090e] border border-slate-800/60 rounded-lg flex items-center justify-center text-slate-500">
          <CreditCard size={16} />
        </div>
        <div className="h-9 bg-[#09090e] border border-slate-800/60 rounded-lg flex items-center justify-center text-slate-500 text-[10px] font-bold">
          BKASH
        </div>
        <div className="h-9 bg-[#09090e] border border-slate-800/60 rounded-lg flex items-center justify-center text-slate-500 text-[10px] font-bold">
          NAGAD
        </div>
        <div className="h-9 bg-[#09090e] border border-slate-800/60 rounded-lg flex items-center justify-center text-slate-500">
          <Shield size={16} />
        </div>
      </div>
    </div>
  );
}
