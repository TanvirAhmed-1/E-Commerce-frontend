"use client";

import React, { useState } from "react";
import { Eye, CheckCircle2 } from "lucide-react";
import { renderStars } from "@/utils/renderStars";
import { ProductReview } from "./types";
import ProductReviewForm from "./ProductReviewForm";

interface ProductReviewsTabProps {
  productId?: string;
  reviews?: ProductReview[];
  isLoadingReviews?: boolean;
  token?: string | null;
  onReviewSubmit: (rating: number, message: string, images: File[]) => Promise<void>;
  isSubmittingReview?: boolean;
  onLoginRedirect?: () => void;
}

export const ProductReviewsTab: React.FC<ProductReviewsTabProps> = ({
  reviews = [],
  isLoadingReviews = false,
  token,
  onReviewSubmit,
  isSubmittingReview = false,
  onLoginRedirect,
}) => {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const defaultReviews: ProductReview[] = [
    {
      _id: "rev-1",
      user: { name: "Tanvir Hossain" },
      rating: 5,
      message:
        '"Outstanding quality! Rice cooked within 18 minutes for a family of 6. The 2 pots are extremely useful – one is nonstick which is great for Polao, and the other anodized pot is fantastic for daily rice and khichuri. Delivery in Dhaka took less than 24 hours with Cash on Delivery."',
      isVerified: true,
      createdAt: "Dhanmondi, Dhaka • Purchased 2.8L Metallic Silver",
    },
    {
      _id: "rev-2",
      user: { name: "Nasreen Khan" },
      rating: 5,
      message:
        '"The keep warm mode keeps rice fresh and hot without burning at the bottom. The steamer attachment fits firmly on top and I steamed vegetables while the rice was cooking. 100% authentic product and GhorBazar packaging was very solid."',
      isVerified: true,
      createdAt: "Nasirabad, Chittagong • 5 days ago",
    },
  ];

  const displayReviews = reviews.length > 0 ? reviews : defaultReviews;

  return (
    <div className="max-w-4xl flex flex-col gap-8">
      {/* Rating Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#f2f3ff] dark:bg-[#09090e] p-6 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
          <span className="text-5xl md:text-6xl font-black text-[#003820] dark:text-[#95d4ac] leading-none">
            4.8
          </span>
          <div className="flex text-amber-500 my-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {i === 5 ? "star_half" : "star"}
              </span>
            ))}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Based on 142 Verified Purchases
          </span>
        </div>

        <div className="md:col-span-8 flex flex-col gap-2">
          {[
            { star: "5 Star", pct: 82, width: "82%", barColor: "bg-[#003820] dark:bg-[#95d4ac]" },
            { star: "4 Star", pct: 12, width: "12%", barColor: "bg-[#0f5132] dark:bg-[#2d6a48]" },
            { star: "3 Star", pct: 4, width: "4%", barColor: "bg-[#2d6a48]" },
            { star: "2 Star", pct: 1, width: "1%", barColor: "bg-slate-400" },
            { star: "1 Star", pct: 1, width: "1%", barColor: "bg-red-500" },
          ].map((bar) => (
            <div key={bar.star} className="flex items-center gap-3 text-xs">
              <span className="w-12 text-slate-900 dark:text-white font-semibold">{bar.star}</span>
              <div className="flex-1 h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${bar.barColor} rounded-full`} style={{ width: bar.width }}></div>
              </div>
              <span className="w-10 text-right text-slate-500 dark:text-slate-400 font-medium">
                {bar.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Reviews List & Write a Review Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Reviews List */}
        <div className="lg:col-span-7 flex flex-col gap-4 divide-y divide-slate-100 dark:divide-slate-800">
          <h3 className="font-bold text-base text-slate-900 dark:text-white pb-2">
            Customer Reviews ({displayReviews.length})
          </h3>

          {displayReviews.map((rev) => (
            <div key={rev._id} className="pt-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#b0f1c7] dark:bg-[#0f5132] text-[#003820] dark:text-[#b0f1c7] font-bold flex items-center justify-center text-xs">
                    {rev.user?.name?.slice(0, 2).toUpperCase() || "TH"}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {rev.user?.name || "Customer"}
                      </span>
                      <span className="bg-[#b0f1c7] text-[#002111] text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                        <CheckCircle2 size={11} /> Verified Buyer
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {rev.createdAt}
                    </span>
                  </div>
                </div>
                <div className="flex text-amber-500 text-xs">
                  {renderStars(rev.rating)}
                </div>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {rev.message}
              </p>
              {rev.images && rev.images.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {rev.images.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setZoomedImage(img)}
                      className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 cursor-pointer relative group"
                    >
                      <img src={img} alt="review attachment" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Eye size={12} className="text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="lg:col-span-5">
          <ProductReviewForm
            token={token}
            onReviewSubmit={onReviewSubmit}
            isSubmittingReview={isSubmittingReview}
            onLoginRedirect={onLoginRedirect}
          />
        </div>
      </div>

      {/* Image Modal */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer"
        >
          <img src={zoomedImage} alt="zoomed review" className="max-w-full max-h-[85vh] object-contain rounded-lg" />
        </div>
      )}
    </div>
  );
};

export default ProductReviewsTab;
