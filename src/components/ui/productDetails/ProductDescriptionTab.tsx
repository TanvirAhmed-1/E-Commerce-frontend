"use client";

import React from "react";
import { useProductContext } from "./ProductContext";
import { Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";

export const ProductDescriptionTab: React.FC = () => {
  const { product } = useProductContext();

  const customDescriptionHtml = product?.description;
  const shortDescription = product?.shortDescription;
  const keyFeatures: string[] = product?.keyFeatures || [];

  if (!customDescriptionHtml && !shortDescription && keyFeatures.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
        No detailed description available for this product.
      </div>
    );
  }

  return (
    <div className="max-w-5xl flex flex-col gap-8 animate-fade-in">
      {/* Short Summary Banner */}
      {shortDescription && (
        <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-[#f2f3ff] to-emerald-50/40 dark:from-[#09090e] dark:to-emerald-950/20 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3.5 shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles size={16} />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Product Overview & Specifications
            </h4>
            {/<[a-z][\s\S]*>/i.test(shortDescription) ? (
              <div
                className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed prose dark:prose-invert max-w-none prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: shortDescription }}
              />
            ) : (
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                {shortDescription}
              </p>
            )}
          </div>
        </div>
      )}

      {/* KEY FEATURES & BULLET HIGHLIGHTS (MATCHING IMAGE 3) */}
      {keyFeatures.length > 0 && (
        <div className="p-5 md:p-6 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-black shadow-xs">
              ✓
            </span>
            <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              Key Features & Specifications
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {keyFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-white/90 dark:bg-[#121320] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-emerald-500/40 transition-all group"
              >
                <span className="text-emerald-600 dark:text-emerald-400 font-bold select-none text-base leading-none shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                  ✅
                </span>
                <span className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                  {feat}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RICH HTML DESCRIPTION */}
      {customDescriptionHtml && (
        <div className="space-y-3">
          <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Detailed Information</span>
          </h3>

          <div
            className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed prose dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:leading-relaxed prose-table:border prose-table:border-slate-200 dark:prose-table:border-slate-800 prose-th:bg-slate-100 dark:prose-th:bg-slate-800/80 prose-th:p-2.5 prose-td:p-2.5 prose-td:border prose-td:border-slate-200 dark:prose-td:border-slate-800 prose-img:rounded-2xl prose-img:shadow-sm"
            dangerouslySetInnerHTML={{ __html: customDescriptionHtml }}
          />
        </div>
      )}
    </div>
  );
};

export default ProductDescriptionTab;
