"use client";

import React from "react";
import { useProductContext } from "./ProductContext";
import { Sliders, CheckCircle2, ShieldCheck, Tag } from "lucide-react";

export const ProductSpecsTab: React.FC = () => {
  const { product, maxStock } = useProductContext();

  const categoryName = product?.category?.name;
  const subCategoryName = product?.subcategory?.name || product?.subCategory?.name;
  const brandName = product?.brand?.name;
  const sku = product?.sku;
  const materials = product?.materials;
  const unitMeasure = product?.unitMeasure;
  const gender = product?.gender;
  const weight = product?.weight;
  const barcode = product?.barcode;
  const warranty = product?.warranty || "Official Brand Warranty";
  const customSpecs: { key: string; value: string }[] = product?.specifications || [];
  const keyFeatures: string[] = product?.keyFeatures || [];

  const coreSpecs = [
    ...(categoryName ? [{ label: "Category", value: categoryName }] : []),
    ...(subCategoryName ? [{ label: "Sub-Category", value: subCategoryName }] : []),
    ...(brandName ? [{ label: "Brand", value: brandName }] : []),
    ...(sku ? [{ label: "SKU / Model", value: sku }] : []),
    ...(materials ? [{ label: "Material Composition", value: materials }] : []),
    ...(unitMeasure ? [{ label: "Unit of Measurement", value: unitMeasure.toUpperCase() }] : []),
    ...(gender && gender !== "all" ? [{ label: "Target Gender", value: gender.toUpperCase() }] : []),
    ...(weight ? [{ label: "Net Weight", value: `${weight} kg` }] : []),
    ...(barcode ? [{ label: "Barcode / EAN", value: barcode }] : []),
    {
      label: "Availability Status",
      value: maxStock > 0 ? `In Stock (${maxStock} units available)` : "Out of Stock",
    },
    { label: "Product Authenticity", value: "100% Genuine Original Quality" },
    { label: "Warranty Coverage", value: warranty, isPrimary: true },
  ];

  return (
    <div className="max-w-5xl flex flex-col gap-8 animate-fade-in">
      {/* HTML Formatted Specifications (if provided in specification editor) */}
      {product?.shortDescription && /<[a-z][\s\S]*>/i.test(product.shortDescription) && (
        <div className="space-y-3">
          <h2 className="text-base md:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders size={18} className="text-primary" />
            <span>Product Specifications</span>
          </h2>
          <div
            className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed prose dark:prose-invert max-w-none prose-table:border prose-table:border-slate-200 dark:prose-table:border-slate-800 prose-th:bg-slate-100 dark:prose-th:bg-slate-800/80 prose-th:p-2.5 prose-td:p-2.5 prose-td:border prose-td:border-slate-200 dark:prose-td:border-slate-800"
            dangerouslySetInnerHTML={{ __html: product.shortDescription }}
          />
        </div>
      )}

      {/* Custom Specifications Matrix (if present) */}
      {customSpecs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base md:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders size={18} className="text-primary" />
              <span>Technical & Functional Specifications</span>
            </h2>
            <span className="text-xs font-bold text-muted-foreground">
              {customSpecs.length} parameters
            </span>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#121320]">
            <div className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
              {customSpecs.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs md:text-sm gap-1 sm:gap-4 transition-colors ${
                    idx % 2 === 0 ? "bg-[#f2f3ff]/40 dark:bg-[#09090e]/40" : "bg-white dark:bg-[#121320]"
                  }`}
                >
                  <span className="text-slate-500 dark:text-slate-400 font-bold sm:w-1/3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {item.key}
                  </span>
                  <span className="text-slate-900 dark:text-white font-semibold text-left sm:text-right sm:w-2/3">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Feature Bullet Highlights */}
      {keyFeatures.length > 0 && customSpecs.length === 0 && (
        <div className="p-5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>✅ Key Highlights</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {keyFeatures.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-200 bg-white/80 dark:bg-[#121320] p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <span className="text-emerald-600 font-bold select-none text-sm">✅</span>
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Core Attributes Specifications */}
      <div className="space-y-4">
        <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Tag size={18} className="text-primary" />
          <span>Product Classification & Identity</span>
        </h3>

        <div className="rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#121320]">
          <div className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
            {coreSpecs.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 flex justify-between items-center text-xs md:text-sm ${
                  idx % 2 === 0 ? "bg-[#f2f3ff]/40 dark:bg-[#09090e]/40" : "bg-white dark:bg-[#121320]"
                }`}
              >
                <span className="text-slate-500 dark:text-slate-400 font-medium">{item.label}</span>
                <span
                  className={`text-right font-bold ${
                    item.isPrimary
                      ? "text-[#003820] dark:text-[#95d4ac]"
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSpecsTab;
