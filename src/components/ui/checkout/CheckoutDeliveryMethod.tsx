"use client";

import React from "react";

interface CheckoutDeliveryMethodProps {
  selectedMethod: "standard" | "express";
  onSelectMethod: (method: "standard" | "express") => void;
}

export const CheckoutDeliveryMethod: React.FC<CheckoutDeliveryMethodProps> = ({
  selectedMethod,
  onSelectMethod,
}) => {
  const methods = [
    {
      id: "standard" as const,
      title: "Standard Delivery (2-3 Days)",
      cost: 80,
      description: "Delivered safely by GhorBazar Logistics Hub",
    },
    {
      id: "express" as const,
      title: "Express Delivery (1-2 Days)",
      cost: 130,
      description: "Priority dispatch for urgent household needs",
    },
  ];

  return (
    <div className="bg-white dark:bg-[#121320] p-5 rounded-xl border border-slate-200/70 dark:border-slate-800 shadow-xs flex flex-col gap-4">
      <h3 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">
        Delivery Method
      </h3>

      <div className="flex flex-col gap-2.5">
        {methods.map((m) => {
          const isSelected = selectedMethod === m.id;

          return (
            <label
              key={m.id}
              onClick={() => onSelectMethod(m.id)}
              className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                isSelected
                  ? "bg-[#f2f3ff] dark:bg-[#09090e] border-[#003820] dark:border-[#95d4ac] ring-1 ring-[#003820] dark:ring-[#95d4ac]"
                  : "bg-white dark:bg-[#121320] border-slate-200 dark:border-slate-800 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="delivery_method"
                  checked={isSelected}
                  onChange={() => onSelectMethod(m.id)}
                  className="accent-[#003820] cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{m.title}</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{m.description}</span>
                </div>
              </div>

              <span className="font-bold text-xs text-[#003820] dark:text-[#95d4ac]">
                ৳ {m.cost}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutDeliveryMethod;
