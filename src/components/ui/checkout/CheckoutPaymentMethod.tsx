"use client";

import React from "react";

interface CheckoutPaymentMethodProps {
  selectedPayment: "cod" | "bkash" | "nagad" | "card";
  onSelectPayment: (method: "cod" | "bkash" | "nagad" | "card") => void;
  transactionId?: string;
  onTransactionIdChange?: (val: string) => void;
}

export const CheckoutPaymentMethod: React.FC<CheckoutPaymentMethodProps> = ({
  selectedPayment,
  onSelectPayment,
  transactionId,
  onTransactionIdChange,
}) => {
  const options = [
    {
      id: "cod" as const,
      name: "Cash on Delivery",
      desc: "Pay when your package arrives and you inspect it",
      badge: "Most Popular",
    },
    {
      id: "bkash" as const,
      name: "bKash Online Payment",
      desc: "Instant automated settlement via bKash merchant gateway",
    },
    {
      id: "nagad" as const,
      name: "Nagad Mobile Wallet",
      desc: "Fast and secure checkout with Nagad wallet",
    },
    {
      id: "card" as const,
      name: "Credit / Debit Card",
      desc: "Visa, Mastercard, AMEX with 256-Bit SSL protection",
    },
  ];

  return (
    <div className="bg-white dark:bg-[#121320] p-5 rounded-xl border border-slate-200/70 dark:border-slate-800 shadow-xs flex flex-col gap-4">
      <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
        Payment Method
      </h3>

      <div className="flex flex-col gap-2.5">
        {options.map((opt) => {
          const isSelected = selectedPayment === opt.id;

          return (
            <label
              key={opt.id}
              onClick={() => onSelectPayment(opt.id)}
              className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                isSelected
                  ? "bg-[#f2f3ff] dark:bg-[#09090e] border-[#003820] dark:border-[#95d4ac] ring-1 ring-[#003820] dark:ring-[#95d4ac]"
                  : "bg-white dark:bg-[#121320] border-slate-200 dark:border-slate-800 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment_method"
                  checked={isSelected}
                  onChange={() => onSelectPayment(opt.id)}
                  className="accent-[#003820] cursor-pointer"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{opt.name}</span>
                    {opt.badge && (
                      <span className="bg-[#b0f1c7] text-[#002111] text-[10px] font-bold px-1.5 py-0.2 rounded">
                        {opt.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{opt.desc}</span>
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {(selectedPayment === "bkash" || selectedPayment === "nagad") && (
        <div className="p-3.5 bg-[#f2f3ff] dark:bg-[#09090e] rounded-xl flex flex-col gap-2 text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            Please enter your {selectedPayment.toUpperCase()} Transaction ID:
          </span>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => onTransactionIdChange?.(e.target.value)}
            placeholder="e.g. TR9X87KLM"
            className="p-2 rounded-lg border bg-white dark:bg-[#121320] text-slate-900 dark:text-white text-xs"
          />
        </div>
      )}
    </div>
  );
};

export default CheckoutPaymentMethod;
