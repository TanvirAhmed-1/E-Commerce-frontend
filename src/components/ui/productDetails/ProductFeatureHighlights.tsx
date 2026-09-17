"use client";

import React from "react";

interface ProductFeatureHighlightsProps {
  features?: {
    icon: string;
    text: string;
  }[];
}

export const ProductFeatureHighlights: React.FC<ProductFeatureHighlightsProps> = ({
  features = [
    {
      icon: "bolt",
      text: "Heavy-duty 1000W heating plate for rapid & uniform cooking",
    },
    {
      icon: "layers",
      text: "Includes 2 Pots: 1 Teflon Non-stick & 1 Anodized Heavy Pot",
    },
    {
      icon: "soup_kitchen",
      text: "Auto Keep-Warm feature preserves aroma & heat up to 6 hours",
    },
    {
      icon: "shield",
      text: "Stainless steel body with cool-touch heat-resistant side handles",
    },
  ],
}) => {
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
