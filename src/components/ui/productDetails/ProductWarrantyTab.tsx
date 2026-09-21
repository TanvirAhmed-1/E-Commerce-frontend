"use client";

import React from "react";
import { useProductContext } from "./ProductContext";
import { ShieldCheck, RefreshCw, FileCheck, PhoneCall, CheckCircle2 } from "lucide-react";

export const ProductWarrantyTab: React.FC = () => {
  const { product } = useProductContext();

  const warrantyTitle = product?.warranty || "Official Brand Warranty";
  const warrantyPolicy = product?.warrantyPolicy;

  return (
    <div className="max-w-5xl flex flex-col gap-8 animate-fade-in">
      {/* Top Warranty Guarantee Hero */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-primary/10 border border-emerald-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20 shrink-0">
            <ShieldCheck size={26} />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-0.5">
              Certified Guarantee
            </span>
            <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
              {warrantyTitle}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/80 dark:bg-black/30 border border-emerald-500/20 text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
          <span>100% Genuine Authorized Product</span>
        </div>
      </div>

      {/* Custom Policy Statement if provided */}
      {warrantyPolicy && (
        <div className="p-5 rounded-2xl bg-[#f2f3ff] dark:bg-[#09090e] border border-slate-200/80 dark:border-slate-800 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Terms & Claim Instructions
          </h3>
          <div
            className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed prose dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white"
            dangerouslySetInnerHTML={{ __html: warrantyPolicy }}
          />
        </div>
      )}

      {/* Step by step Claim Procedure Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1 */}
        <div className="bg-[#f2f3ff]/60 dark:bg-[#09090e]/60 p-5 rounded-2xl flex flex-col gap-3 border border-slate-200/80 dark:border-slate-800 hover:border-primary/40 transition-all">
          <div className="flex items-center gap-2 text-primary dark:text-[#95d4ac]">
            <FileCheck size={20} />
            <span className="font-extrabold text-sm text-slate-900 dark:text-white">
              1. Keep Order Invoice
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Retain your digital receipt or printed parcel invoice along with original packaging and serial codes.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-[#f2f3ff]/60 dark:bg-[#09090e]/60 p-5 rounded-2xl flex flex-col gap-3 border border-slate-200/80 dark:border-slate-800 hover:border-primary/40 transition-all">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <RefreshCw size={20} />
            <span className="font-extrabold text-sm text-slate-900 dark:text-white">
              2. 7-Day Replacement
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            If your product arrives damaged or functionally defective, request instant replacement within 7 calendar days of receipt.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-[#f2f3ff]/60 dark:bg-[#09090e]/60 p-5 rounded-2xl flex flex-col gap-3 border border-slate-200/80 dark:border-slate-800 hover:border-primary/40 transition-all">
          <div className="flex items-center gap-2 text-primary dark:text-[#95d4ac]">
            <PhoneCall size={20} />
            <span className="font-extrabold text-sm text-slate-900 dark:text-white">
              3. Service & Support
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Reach out through our Customer Support Helpline or Help Center anytime for warranty claims and servicing assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductWarrantyTab;
