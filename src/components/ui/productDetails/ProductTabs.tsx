"use client";

import React from "react";

export type TabType = "description" | "specs" | "reviews" | "warranty";

interface ProductTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  reviewsCount?: number;
  children?: React.ReactNode;
}

export const ProductTabs: React.FC<ProductTabsProps> = ({
  activeTab,
  onTabChange,
  reviewsCount = 142,
  children,
}) => {
  const tabs: { id: TabType; label: string; badge?: number }[] = [
    { id: "description", label: "Product Description" },
    { id: "specs", label: "Technical Specifications" },
    { id: "reviews", label: "Customer Reviews", badge: reviewsCount },
    { id: "warranty", label: "Warranty & Service Centers" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-6 w-full">
      <div className="bg-white dark:bg-[#121320] rounded-xl shadow-xs border border-slate-100 dark:border-slate-800/80 overflow-hidden">
        {/* Tab Headers */}
        <div className="flex items-center border-b border-slate-100 dark:border-slate-800 overflow-x-auto bg-[#f2f3ff] dark:bg-[#09090e] px-4">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`py-4 px-5 text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 border-b-2 cursor-pointer ${
                  isActive
                    ? "text-[#003820] dark:text-[#95d4ac] border-[#003820] dark:border-[#95d4ac] font-bold bg-white/60 dark:bg-white/5"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border-transparent"
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="bg-[#eaedff] dark:bg-[#1e1e38] text-slate-800 dark:text-slate-200 text-[11px] px-2 py-0.5 rounded-full font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Container */}
        <div className="p-6 md:p-8">{children}</div>
      </div>
    </section>
  );
};

export default ProductTabs;
