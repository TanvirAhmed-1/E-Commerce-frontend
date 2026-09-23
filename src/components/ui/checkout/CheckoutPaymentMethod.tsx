"use client";

import React from "react";
import Image from "next/image";
import { CreditCard, CheckCircle2, AlertCircle } from "lucide-react";

export type PaymentMethodType = "cod" | "bkash" | "nagad";

interface CheckoutPaymentMethodProps {
  selectedPayment: PaymentMethodType;
  onSelectPayment: (method: PaymentMethodType) => void;
  transactionId?: string;
  onTransactionIdChange?: (val: string) => void;
}

export const CheckoutPaymentMethod: React.FC<CheckoutPaymentMethodProps> = ({
  selectedPayment,
  onSelectPayment,
  transactionId = "",
  onTransactionIdChange,
}) => {
  const options = [
    {
      id: "cod" as const,
      name: "Cash on Delivery",
      bnName: "ক্যাশ অন ডেলিভারি",
      desc: "পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধ করুন",
      badge: "সবচেয়ে জনপ্রিয়",
      logo: "/payments/cod.svg",
      logoWidth: 100,
      logoHeight: 42,
      bgHover: "hover:border-emerald-600/40",
    },
    {
      id: "bkash" as const,
      name: "bKash",
      bnName: "বিকাশ পেমেন্ট",
      desc: "বিকাশ ওয়ালেট থেকে দ্রুত ও নিরাপদে পেমেন্ট করুন",
      badge: "ইনস্ট্যান্ট",
      logo: "/payments/bkash.svg",
      logoWidth: 95,
      logoHeight: 42,
      bgHover: "hover:border-pink-500/40",
    },
    {
      id: "nagad" as const,
      name: "Nagad Mobile Wallet",
      bnName: "নগদ মোবাইল ওয়ালেট",
      desc: "নগদ একাউন্টের মাধ্যমে সহজে পেমেন্ট সম্পন্ন করুন",
      badge: "ক্যাশব্যাক অফার",
      logo: "/payments/nagad.svg",
      logoWidth: 95,
      logoHeight: 42,
      bgHover: "hover:border-orange-500/40",
    },
  ];

  return (
    <div className="bg-white dark:bg-[#121320] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
        <h2 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <CreditCard size={18} className="text-[#003820] dark:text-[#95d4ac]" />
          <span>পেমেন্ট পদ্ধতি (Payment Method)</span>
        </h2>
      </div>

      {/* 3 Payment Options List */}
      <div className="grid grid-cols-1 gap-3">
        {options.map((opt) => {
          const isSelected = selectedPayment === opt.id;

          return (
            <label
              key={opt.id}
              onClick={() => onSelectPayment(opt.id)}
              className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-200 select-none ${
                isSelected
                  ? "bg-[#f2f3ff] dark:bg-[#0a0c16] border-[#003820] dark:border-[#95d4ac] ring-1 ring-[#003820] dark:ring-[#95d4ac] shadow-xs"
                  : `bg-white dark:bg-[#121320] border-slate-200 dark:border-slate-800 ${opt.bgHover}`
              }`}
            >
              {/* Left Side: Radio & Titles */}
              <div className="flex items-center gap-3.5 flex-1 pr-2">
                <input
                  type="radio"
                  name="payment_method"
                  checked={isSelected}
                  onChange={() => onSelectPayment(opt.id)}
                  className="accent-[#003820] dark:accent-[#95d4ac] w-4 h-4 cursor-pointer shrink-0"
                />

                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {opt.name}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      ({opt.bnName})
                    </span>
                    {opt.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs ${
                          opt.id === "bkash"
                            ? "bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300"
                            : opt.id === "nagad"
                            ? "bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300"
                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                        }`}
                      >
                        {opt.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {opt.desc}
                  </span>
                </div>
              </div>

              {/* Right Side: Official Brand Logo */}
              <div className="w-24 sm:w-28 h-12 sm:h-13 px-2.5 py-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center shrink-0 shadow-2xs">
                <Image
                  src={opt.logo}
                  alt={opt.name}
                  width={opt.logoWidth}
                  height={opt.logoHeight}
                  className="object-contain max-h-10 sm:max-h-11 w-auto max-w-full"
                />
              </div>
            </label>
          );
        })}
      </div>

      {/* Dynamic Instruction Panels */}
      {selectedPayment === "cod" && (
        <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl flex items-start gap-3">
          <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 dark:text-slate-300 flex flex-col gap-1">
            <span className="font-bold text-slate-900 dark:text-white">
              ক্যাশ অন ডেলিভারি নিশ্চিতকরণ
            </span>
            <span>
              ডেলিভারি ম্যানের কাছ থেকে প্রোডাক্ট বুঝে পেয়ে মূল্য পরিশোধ করুন। কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই।
            </span>
          </div>
        </div>
      )}

      {(selectedPayment === "bkash" || selectedPayment === "nagad") && (
        <div className="p-4 bg-[#f2f3ff] dark:bg-[#09090e] border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col gap-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle size={17} className="text-[#003820] dark:text-[#95d4ac] shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1 text-xs">
              <span className="font-bold text-slate-900 dark:text-white">
                {selectedPayment === "bkash" ? "bKash (বিকাশ)" : "Nagad (নগদ)"} পেমেন্ট নির্দেশনা:
              </span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                অনুগ্রহ করে আমাদের মার্চেন্ট/পার্সোনাল নম্বরে পেমেন্ট সম্পূর্ণ করে নিচের বক্সে আপনার Transaction ID (TrxID) প্রদান করুন।
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 pt-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Transaction ID (TrxID) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={transactionId}
              onChange={(e) => onTransactionIdChange?.(e.target.value)}
              placeholder={selectedPayment === "bkash" ? "e.g. 9J87K1L2M3" : "e.g. 78N6M5B4V3"}
              className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#121320] text-slate-900 dark:text-white text-xs font-mono uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-[#003820] dark:focus:ring-[#95d4ac]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPaymentMethod;
