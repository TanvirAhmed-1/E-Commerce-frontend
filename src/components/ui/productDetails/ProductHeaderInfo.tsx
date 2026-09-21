"use client";

import React from "react";
import { renderStars } from "@/utils/renderStars";
import { useProductContext } from "./ProductContext";
import { useGetProductReviewsQuery } from "@/redux/features/review/reviewApi";

export const ProductHeaderInfo: React.FC<{ onReviewsClick?: () => void }> = ({ onReviewsClick }) => {
  const { product, maxStock, isOutOfStock, setActiveTab } = useProductContext();

  const { data: reviewsResponse } = useGetProductReviewsQuery(product?._id, {
    skip: !product?._id,
  });

  const rawReviews = reviewsResponse?.data;
  const reviewsList = Array.isArray(rawReviews?.data)
    ? rawReviews.data
    : Array.isArray(rawReviews)
    ? rawReviews
    : [];

  const totalRatingsCount = reviewsList.length;
  const averageRating =
    totalRatingsCount > 0
      ? reviewsList.reduce((acc: number, r: any) => acc + (r.rating || 5), 0) / totalRatingsCount
      : product?.averageRating || 5.0;

  const tag = product?.brand?.name || product?.category?.name;

  const handleReviewsScroll = () => {
    if (onReviewsClick) {
      onReviewsClick();
    } else {
      setActiveTab("reviews");
      document.getElementById("product-tabs-section")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Category / Brand Badge & Stock Status */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {tag && (
          <span className="bg-[#eaedff] dark:bg-[#1e1e38] px-2.5 py-0.5 rounded text-[#003820] dark:text-[#95d4ac] font-bold text-[11px] tracking-wider uppercase">
            {tag}
          </span>
        )}
        <div className="flex items-center gap-1.5 text-xs font-bold ml-auto">
          {!isOutOfStock ? (
            <>
              <span className="w-2 h-2 rounded-full bg-[#003820] dark:bg-[#00e5a3] animate-pulse"></span>
              <span className="text-[#003820] dark:text-[#95d4ac]">
                In Stock ({maxStock} available)
              </span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="text-red-500 font-bold">Out of Stock</span>
            </>
          )}
        </div>
      </div>

      {/* Product Title */}
      <h1 className="text-xl md:text-2xl lg:text-[24px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
        {product?.name}
      </h1>

      {/* Ratings & Reviews Counter */}
      <div className="flex flex-wrap items-center gap-3 py-1 text-xs">
        <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200/60 dark:border-amber-900/40">
          <div className="text-amber-500 text-xs">
            {renderStars(averageRating)}
          </div>
          <span className="font-bold text-amber-900 dark:text-amber-400 text-xs">
            {averageRating > 0 ? averageRating.toFixed(1) : "5.0"}
          </span>
        </div>

        <button
          type="button"
          onClick={handleReviewsScroll}
          className="text-[#003820] dark:text-[#95d4ac] hover:underline font-semibold cursor-pointer"
        >
          {totalRatingsCount} {totalRatingsCount === 1 ? "Review" : "Reviews"}
        </button>
      </div>
    </div>
  );
};

export default ProductHeaderInfo;
