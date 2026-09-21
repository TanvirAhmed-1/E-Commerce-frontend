"use client";

import React from "react";
import { useProductContext } from "./ProductContext";

export const ProductVariantSelector: React.FC = () => {
  const { product, uniqueAttributes, selectedOptions, selectOption } = useProductContext();

  const attributeKeys = Object.keys(uniqueAttributes || {});

  // If the product does not have variants or no attributes are found, render nothing
  if (!product?.hasVariants || attributeKeys.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {attributeKeys.map((attrName) => {
        const values = uniqueAttributes[attrName];
        if (!values || values.length === 0) return null;

        const isColor =
          attrName.toLowerCase().includes("color") ||
          attrName.toLowerCase().includes("colour") ||
          attrName.toLowerCase().includes("finish");

        return (
          <div key={attrName} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {attrName}:
              </span>
              <span className="text-xs text-[#003820] dark:text-[#95d4ac] font-medium">
                Selected: {selectedOptions[attrName] || values[0]}
              </span>
            </div>

            {isColor ? (
              <div className="flex flex-wrap items-center gap-2">
                {values.map((val) => {
                  const isSelected = selectedOptions[attrName] === val;
                  return (
                    <label
                      key={val}
                      onClick={() => selectOption(attrName, val)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-white dark:bg-[#121320] border-[#003820] dark:border-[#95d4ac] ring-1 ring-[#003820] dark:ring-[#95d4ac] shadow-xs"
                          : "bg-[#f2f3ff] dark:bg-[#09090e] border-transparent hover:bg-slate-200 dark:hover:bg-slate-800"
                      }`}
                    >
                      <input
                        type="radio"
                        name={attrName}
                        checked={isSelected}
                        onChange={() => selectOption(attrName, val)}
                        className="accent-[#003820] w-3.5 h-3.5 cursor-pointer"
                      />
                      <span
                        className="w-4 h-4 rounded-full shadow-inner border border-black/10"
                        style={{
                          backgroundColor:
                            val.toLowerCase().includes("black") || val.toLowerCase().includes("onyx")
                              ? "#18181b"
                              : val.toLowerCase().includes("silver") || val.toLowerCase().includes("metal") || val.toLowerCase().includes("grey") || val.toLowerCase().includes("gray")
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
                            : "text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {val}
                      </span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {values.map((val) => {
                  const isSelected = selectedOptions[attrName] === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => selectOption(attrName, val)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#003820] text-white shadow-xs font-bold flex items-center gap-1.5"
                          : "bg-[#f2f3ff] dark:bg-[#09090e] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-transparent"
                      }`}
                    >
                      {isSelected && (
                        <span className="material-symbols-outlined text-[15px]">check</span>
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
