"use client";

import React from "react";
import { useProductContext } from "./ProductContext";
import { useGetProductReviewsQuery } from "@/redux/features/review/reviewApi";
import ProductDescriptionTab from "./ProductDescriptionTab";
import ProductSpecsTab from "./ProductSpecsTab";
import ProductReviewsTab from "./ProductReviewsTab";
import ProductWarrantyTab from "./ProductWarrantyTab";

export type TabType = "description" | "specs" | "reviews" | "warranty";

export const ProductTabs: React.FC = () => {
  const { product, activeTab, setActiveTab } = useProductContext();

  const { data: reviewsResponse } = useGetProductReviewsQuery(product?._id, {
    skip: !product?._id,
  });

  const rawReviews = reviewsResponse?.data;
  const reviewsCount = Array.isArray(rawReviews?.data)
    ? rawReviews.data.length
    : Array.isArray(rawReviews)
    ? rawReviews.length
    : 0;

  const tabs: { id: TabType; label: string; badge?: number }[] = [
    { id: "description", label: "Description" },
    { id: "specs", label: "Specifications" },
    { id: "reviews", label: "Reviews", badge: reviewsCount },
    { id: "warranty", label: "Warranty & Support" },
  ];

  return (
    <section id="product-tabs-section" className="max-w-7xl mx-auto px-4 md:px-8 py-6 w-full">
      <div className="bg-white dark:bg-[#121320] rounded-xl shadow-xs border border-slate-100 dark:border-slate-800/80 overflow-hidden">
        {/* Tab Headers */}
        <div className="flex items-center border-b border-slate-100 dark:border-slate-800 overflow-x-auto bg-[#f2f3ff] dark:bg-[#09090e] px-4">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-5 text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 border-b-2 cursor-pointer ${
                  isActive
                    ? "text-[#003820] dark:text-[#95d4ac] border-[#003820] dark:border-[#95d4ac] font-bold bg-white/60 dark:bg-white/5"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border-transparent"
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="bg-[#eaedff] dark:bg-[#1e1e38] text-slate-800 dark:text-slate-200 text-[11px] px-2 py-0.5 rounded-full font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Container */}
        <div className="p-6 md:p-8">
          {activeTab === "description" && <ProductDescriptionTab />}
          {activeTab === "specs" && <ProductSpecsTab />}
          {activeTab === "reviews" && <ProductReviewsTab />}
          {activeTab === "warranty" && <ProductWarrantyTab />}
        </div>
      </div>
    </section>
  );
};

export default ProductTabs;
