"use client";

import React from "react";

interface ProductFeatureHighlightsProps {
  features?: {
    icon: string;
    text: string;
  }[];
}

export const ProductFeatureHighlights: React.FC<ProductFeatureHighlightsProps> = ({
  features,
}) => {
  if (!features || features.length === 0) return null;
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 py-1 text-xs text-slate-700 dark:text-slate-300">
      {features.map((item, idx) => (
        <li key={idx} className="flex items-start gap-2">
          <span className="material-symbols-outlined text-[#003820] dark:text-[#95d4ac] text-[18px] shrink-0 mt-0.5">
            {item.icon}
          </span>
          <span className="leading-snug">{item.text}</span>
        </li>
      ))}
    </ul>
  );
};

export default ProductFeatureHighlights;
