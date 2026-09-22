"use client";

import React from "react";
import Image from "next/image";
import { useProductContext } from "./ProductContext";

export const ProductVariantSelector: React.FC = () => {
  const { product, uniqueAttributes, selectedOptions, selectOption, setActiveImage } =
    useProductContext();

  const attributeKeys = Object.keys(uniqueAttributes || {});

  // If the product does not have variants or no attributes are found, render nothing
  if (!product?.hasVariants || attributeKeys.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-5">
      {attributeKeys.map((attrName) => {
        const values = uniqueAttributes[attrName];
        if (!values || values.length === 0) return null;

        const isColor =
          attrName.toLowerCase().includes("color") ||
          attrName.toLowerCase().includes("colour") ||
          attrName.toLowerCase().includes("finish");

        return (
          <div key={attrName} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {attrName}:
              </span>
              <span className="text-xs text-[#003820] dark:text-[#95d4ac] font-bold">
                {selectedOptions[attrName] || values[0]}
              </span>
            </div>

            {isColor ? (
              <div className="flex flex-wrap items-center gap-2.5">
                {values.map((val) => {
                  const isSelected = selectedOptions[attrName] === val;

                  // Find corresponding variant for image preview
                  const matchingVariant = product?.productVariants?.find((v: any) =>
                    v.isActive !== false &&
                    v.attributes?.some((a: any) =>
                      (a.attribute?.name || a.name || "").toLowerCase() === attrName.toLowerCase() &&
                      a.value === val
                    )
                  );
                  const colorImageUrl = matchingVariant?.images?.[0];

                  if (colorImageUrl) {
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => {
                          selectOption(attrName, val);
                          setActiveImage(colorImageUrl);
                        }}
                        className={`group relative flex items-center gap-2.5 p-1.5 pr-3.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-white dark:bg-[#121320] border-[#003820] dark:border-[#95d4ac] ring-2 ring-[#003820]/30 dark:ring-[#95d4ac]/30 shadow-md scale-[1.02]"
                            : "bg-[#f2f3ff] dark:bg-[#09090e] border-slate-200/60 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                        }`}
                        title={val}
                      >
                        <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-white shrink-0">
                          <Image
                            src={colorImageUrl}
                            alt={val}
                            fill
                            sizes="44px"
                            className="object-contain p-0.5 transition-transform duration-300 group-hover:scale-110"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-[#003820]/25 flex items-center justify-center">
                              <span className="material-symbols-outlined text-[14px] text-white font-black bg-[#003820] rounded-full p-0.5 shadow-xs">
                                check
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col text-left">
                          <span
                            className={`text-xs capitalize ${
                              isSelected
                                ? "font-bold text-[#003820] dark:text-[#95d4ac]"
                                : "font-semibold text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {val}
                          </span>
                        </div>
                      </button>
                    );
                  }

                  // Fallback for colors without images
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => selectOption(attrName, val)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-white dark:bg-[#121320] border-[#003820] dark:border-[#95d4ac] ring-2 ring-[#003820]/30 dark:ring-[#95d4ac]/30 shadow-xs"
                          : "bg-[#f2f3ff] dark:bg-[#09090e] border-slate-200/60 dark:border-slate-800 hover:border-slate-400"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full shadow-inner border border-black/15"
                        style={{
                          backgroundColor:
                            val.toLowerCase().includes("black") || val.toLowerCase().includes("onyx")
                              ? "#18181b"
                              : val.toLowerCase().includes("silver") ||
                                val.toLowerCase().includes("metal") ||
                                val.toLowerCase().includes("grey") ||
                                val.toLowerCase().includes("gray")
                              ? "#94a3b8"
                              : val.toLowerCase().includes("emerald") || val.toLowerCase().includes("green")
                              ? "#065f46"
                              : val.toLowerCase().includes("blue")
                              ? "#2563eb"
                              : val.toLowerCase().includes("red")
                              ? "#dc2626"
                              : val.toLowerCase().includes("yellow")
                              ? "#eab308"
                              : val.toLowerCase().includes("white")
                              ? "#ffffff"
                              : "#cbd5e1",
                        }}
                      />
                      <span
                        className={`text-xs ${
                          isSelected
                            ? "font-bold text-slate-900 dark:text-white"
                            : "font-semibold text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {val}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2.5">
                {values.map((val) => {
                  const isSelected = selectedOptions[attrName] === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => selectOption(attrName, val)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#003820] text-white shadow-sm ring-2 ring-[#003820]/30 flex items-center gap-1.5 scale-[1.02]"
                          : "bg-[#f2f3ff] dark:bg-[#09090e] text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800"
                      }`}
                    >
                      {isSelected && (
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      )}
                      <span>{val}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProductVariantSelector;
