"use client";

import React, { useMemo } from "react";
import {
  FileText,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Headphones,
} from "lucide-react";
import Container from "@/components/shared/Container";

interface CategorySeoFooterProps {
  categoryTitle?: string;
  categoryName?: string;
  description?: string;
}

export const CategorySeoFooter: React.FC<CategorySeoFooterProps> = ({
  categoryTitle,
  categoryName = "Products",
  description,
}) => {
  const displayTitle = categoryTitle || categoryName;

  // Clean duplicate repeated sentences/paragraphs often found in seed or dirty database records
  const formattedParagraphs = useMemo(() => {
    if (!description || description.trim().length === 0) {
      return [
        `Discover our curated selection of high-performance ${displayTitle} designed for durability, modern convenience, and supreme reliability. Every model undergoes strict quality checks to ensure energy efficiency, premium build standards, and long-lasting utility.`,
        `Whether you are upgrading your everyday essentials or shopping for your family, enjoy authentic brand warranty, competitive prices, and fast doorstep delivery across Bangladesh.`,
      ];
    }

    // Split by newlines or full-stops to extract unique non-empty sentences/paragraphs
    const rawBlocks = description
      .split(/\n+/)
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    const uniqueBlocks: string[] = [];
    for (const block of rawBlocks) {
      // If block contains repeated sentences, deduplicate sentences
      const sentences = block
        .split(/(?<=[.?!])\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const uniqueSentences: string[] = [];
      for (const sentence of sentences) {
        if (!uniqueSentences.includes(sentence)) {
          uniqueSentences.push(sentence);
        }
      }

      const cleanedBlock = uniqueSentences.join(" ");
      if (cleanedBlock && !uniqueBlocks.includes(cleanedBlock)) {
        uniqueBlocks.push(cleanedBlock);
      }
    }

    return uniqueBlocks.length > 0
      ? uniqueBlocks
      : [
          `Discover our premium range of ${displayTitle}, meticulously crafted to meet modern household and kitchen needs.`,
        ];
  }, [description, displayTitle]);

  return (
    <section className="w-full pt-6 pb-14">
      <Container>
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-[#0d101e]/80 backdrop-blur-md shadow-sm p-6 sm:p-8 md:p-10 space-y-6">
        {/* Top Accent Gradient Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500" />

        {/* Header with Icon */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 shadow-xs">
            <FileText size={18} />
          </div>
          <div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              About {displayTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Product guide, key highlights &amp; official specifications
            </p>
          </div>
        </div>

        {/* Editorial Body Content */}
        <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {formattedParagraphs.map((para, index) => (
            <p key={index} className="leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        {/* Trust Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/80 dark:bg-white/5 border border-slate-100 dark:border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 size={15} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                100% Genuine Quality
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Direct from verified manufacturers
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/80 dark:bg-white/5 border border-slate-100 dark:border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
              <Truck size={15} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Nationwide Delivery
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Fast doorstep shipping anywhere
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/80 dark:bg-white/5 border border-slate-100 dark:border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck size={15} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Official Warranty
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Guaranteed brand after-sales support
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/80 dark:bg-white/5 border border-slate-100 dark:border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <Headphones size={15} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Expert Support
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                7 days a week customer assistance
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </section>
);
};

export default CategorySeoFooter;
