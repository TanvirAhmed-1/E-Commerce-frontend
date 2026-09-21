"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Eye, CheckCircle2, MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { renderStars } from "@/utils/renderStars";
import {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useUploadImagesMutation,
} from "@/redux/features/review/reviewApi";
import { useProductContext } from "./ProductContext";
import ProductReviewForm from "./ProductReviewForm";

export const ProductReviewsTab: React.FC = () => {
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.auth);
  const { product } = useProductContext();

  const { data: reviewsResponse, isLoading: isLoadingReviews, refetch: refetchReviews } = useGetProductReviewsQuery(
    product?._id,
    { skip: !product?._id }
  );

  const [createReview, { isLoading: isSubmittingReview }] = useCreateReviewMutation();
  const [uploadImages] = useUploadImagesMutation();

  const rawReviews = reviewsResponse?.data;
  const reviews: any[] = Array.isArray(rawReviews?.data)
    ? rawReviews.data
    : Array.isArray(rawReviews)
    ? rawReviews
    : [];

  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / totalReviews
      : 5.0;

  // Calculate real star distributions
  const starCounts = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return {
      star: `${star} Star`,
      count,
      pct,
      width: `${pct}%`,
      barColor:
        star === 5
          ? "bg-[#003820] dark:bg-[#95d4ac]"
          : star === 4
          ? "bg-[#0f5132] dark:bg-[#2d6a48]"
          : star === 3
          ? "bg-[#2d6a48]"
          : star === 2
          ? "bg-amber-500"
          : "bg-red-500",
    };
  });

  const handleReviewSubmit = async (rating: number, message: string, images: File[]) => {
    if (!token) {
      toast.error("Please log in to submit a review.");
      return;
    }
    if (!product?._id) return;

    const toastId = toast.loading("Submitting review...");
    try {
      let uploadedUrls: string[] = [];
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((img) => formData.append("images", img));
        const uploadRes = await uploadImages(formData).unwrap();
        if (uploadRes?.success && Array.isArray(uploadRes.data)) {
          uploadedUrls = uploadRes.data.map((item: any) => item.url);
        }
      }

      await createReview({
        product: product._id,
        rating,
        message,
        images: uploadedUrls,
      }).unwrap();

      toast.success("Review submitted successfully!", { id: toastId });
      refetchReviews();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit review.", { id: toastId });
    }
  };

  const handleLoginRedirect = () => {
    router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
  };

  return (
    <div className="max-w-4xl flex flex-col gap-8">
      {/* Rating Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-[#f2f3ff] dark:bg-[#09090e] p-6 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
          <span className="text-5xl md:text-6xl font-black text-[#003820] dark:text-[#95d4ac] leading-none">
            {totalReviews > 0 ? averageRating.toFixed(1) : "5.0"}
          </span>
          <div className="text-amber-500 text-sm my-2">
            {renderStars(averageRating)}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {totalReviews > 0
              ? `Based on ${totalReviews} customer ${totalReviews === 1 ? "review" : "reviews"}`
              : "No customer ratings yet"}
          </span>
        </div>

        <div className="md:col-span-8 flex flex-col gap-2">
          {starCounts.map((bar) => (
            <div key={bar.star} className="flex items-center gap-3 text-xs">
              <span className="w-12 text-slate-900 dark:text-white font-semibold">{bar.star}</span>
              <div className="flex-1 h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${bar.barColor} rounded-full transition-all duration-300`} style={{ width: bar.width }}></div>
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
            Customer Reviews ({totalReviews})
          </h3>

          {isLoadingReviews ? (
            <div className="py-8 text-center text-slate-400 text-xs">Loading reviews...</div>
          ) : totalReviews === 0 ? (
            <div className="py-10 flex flex-col items-center justify-center text-center gap-2 bg-[#f2f3ff] dark:bg-[#09090e] rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-6">
              <MessageSquare size={32} className="text-slate-400" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                No reviews yet
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                Be the first to share your thoughts and review this product!
              </p>
            </div>
          ) : (
            reviews.map((rev: any) => (
              <div key={rev._id} className="pt-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#b0f1c7] dark:bg-[#0f5132] text-[#003820] dark:text-[#b0f1c7] font-bold flex items-center justify-center text-xs">
                      {rev.user?.name?.slice(0, 2).toUpperCase() || "CU"}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {rev.user?.name || "Customer"}
                        </span>
                        {rev.isVerified !== false && (
                          <span className="bg-[#b0f1c7] text-[#002111] text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                            <CheckCircle2 size={11} /> Verified Buyer
                          </span>
                        )}
                      </div>
                      {rev.createdAt && (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {new Date(rev.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-amber-500 text-xs">
                    {renderStars(rev.rating)}
                  </div>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {rev.message}
                </p>
                {rev.images && rev.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {rev.images.map((img: string, i: number) => (
                      <div
                        key={i}
                        onClick={() => setZoomedImage(img)}
                        className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 cursor-pointer relative group"
                      >
                        <Image
                          src={img}
                          alt="review attachment"
                          fill
                          sizes="60px"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Eye size={12} className="text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Write a Review Form */}
        <div className="lg:col-span-5">
          <ProductReviewForm
            token={token}
            onReviewSubmit={handleReviewSubmit}
            isSubmittingReview={isSubmittingReview}
            onLoginRedirect={handleLoginRedirect}
          />
        </div>
      </div>

      {/* Image Modal */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-3xl max-h-[85vh] w-full h-[80vh]">
            <Image
              src={zoomedImage}
              alt="zoomed review"
              fill
              className="object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReviewsTab;
