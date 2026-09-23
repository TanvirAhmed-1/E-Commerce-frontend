"use client";

import React from "react";

interface InvoiceSummaryProps {
  subtotal: number;
  deliveryCharge: number;
  district?: string;
  discount?: number;
  vat?: number;
  grandTotal: number;
  orderNumber: string;
}

export const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({
  subtotal,
  deliveryCharge,
  district,
  discount = 0,
  vat = 0,
  grandTotal,
  orderNumber,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-slate-200 dark:border-slate-800 pt-6">
      <div className="max-w-xs text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
        <h5 className="font-bold text-slate-900 dark:text-white uppercase text-[10px] tracking-wider">
          Terms & Support Note
        </h5>
        <p className="leading-relaxed">
          Please preserve this invoice receipt for official warranty verification. In case of any dispatch query or parcel exchange, contact our 24/7 support line quoting Invoice Ref: <strong className="text-slate-900 dark:text-white font-mono">#{orderNumber}</strong>.
        </p>
      </div>

      <div className="w-full sm:w-80 bg-slate-50/90 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
        <div className="flex justify-between items-center">
          <span className="text-slate-500">Subtotal (সাবটোটাল)</span>
          <span className="font-bold text-slate-900 dark:text-white font-mono">
            ৳{subtotal.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-500">Delivery Charge ({district || "Standard"})</span>
          <span className="font-bold text-slate-900 dark:text-white font-mono">
            ৳{deliveryCharge.toLocaleString()}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-medium">
            <span>Discount / Promo (ডিসকাউন্ট)</span>
            <span className="font-bold font-mono">-৳{discount.toLocaleString()}</span>
          </div>
        )}

        {vat > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Tax / VAT</span>
            <span className="font-bold font-mono">৳{vat.toLocaleString()}</span>
          </div>
        )}

        <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-700/80 text-sm font-black text-slate-900 dark:text-white">
          <span className="text-base">Grand Total (সর্বমোট)</span>
          <span className="text-lg text-emerald-700 dark:text-emerald-400 font-mono">
            ৳{grandTotal.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSummary;
