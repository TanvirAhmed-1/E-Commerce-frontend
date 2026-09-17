"use client";

import React from "react";

interface ProductSpecsTabProps {
  categoryName?: string;
  sku?: string;
  stock?: number;
}

export const ProductSpecsTab: React.FC<ProductSpecsTabProps> = ({
  categoryName = "Kitchen Appliances",
  sku = "PR-DX280-DUO",
  stock,
}) => {
  const column1 = [
    { label: "Brand", value: "Prestige Appliances" },
    { label: "Model Number", value: sku || "PR-DX280-DUO" },
    { label: "Capacity", value: "2.8 Liters (approx. 1.5kg raw rice)" },
    { label: "Rated Power", value: "1000 Watts Turbo Heating" },
    { label: "Operating Voltage", value: "220V - 240V / 50Hz (BD Standard)" },
    { label: "Body Material", value: "Brushed 304 Stainless Steel" },
  ];

  const column2 = [
    { label: "Inner Pots Included", value: "2 Pots (Non-stick + Hard Anodized)" },
    { label: "Keep-Warm Retention", value: "Up to 6 Hours Automated" },
    { label: "Accessories in Box", value: "Measuring Cup, Spatula, Steamer Tray" },
    { label: "Cord Type", value: "Heavy Detachable 1.2m Cable" },
    { label: "Country of Origin", value: "India / Assembled for BD" },
    { label: "Warranty", value: "1 Year Full + 2 Year Service", isPrimary: true },
  ];

  return (
    <div className="max-w-4xl flex flex-col gap-4">
      <h2 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white">
        Technical Specifications
      </h2>

      <div className="rounded-xl overflow-hidden shadow-xs border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#121320]">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200/80 dark:divide-slate-800 bg-[#f2f3ff] dark:bg-[#09090e]">
          {/* Column 1 */}
          <div className="flex flex-col divide-y divide-slate-200/60 dark:divide-slate-800/60">
            {column1.map((item, idx) => (
              <div key={idx} className="p-3.5 flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">{item.label}</span>
                <span className="text-slate-900 dark:text-white font-bold text-right">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Column 2 */}
          <div className="flex flex-col divide-y divide-slate-200/60 dark:divide-slate-800/60">
            {column2.map((item, idx) => (
              <div key={idx} className="p-3.5 flex justify-between items-center text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">{item.label}</span>
                <span
                  className={`text-right ${
                    item.isPrimary
                      ? "text-[#003820] dark:text-[#95d4ac] font-bold"
                      : "text-slate-900 dark:text-white font-bold"
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
