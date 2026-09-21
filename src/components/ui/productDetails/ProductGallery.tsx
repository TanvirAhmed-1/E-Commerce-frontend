"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  useGetWishListQuery,
  useToggleWishListMutation,
  useRemoveFromWishListMutation,
} from "@/redux/features/wishList/wishListApi";
import { useProductContext } from "./ProductContext";

export const ProductGallery: React.FC = () => {
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.auth);
  const { product, activeImage, setActiveImage, allImages, discountPercentage } = useProductContext();

  const { data: wishlistResponse, refetch: refetchWishlist } = useGetWishListQuery(undefined, { skip: !token });
  const [toggleWishList, { isLoading: isTogglingWishlist }] = useToggleWishListMutation();
  const [removeFromWishlist] = useRemoveFromWishListMutation();

  const wishlistProducts = wishlistResponse?.data?.products || [];
  const isWishlisted = product ? wishlistProducts.some((p: any) => p._id === product._id) : false;

  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
    transform: "scale(1)",
    transformOrigin: "center center",
  });
  const [isHovered, setIsHovered] = useState(false);

  const displayImages = allImages && allImages.length > 0 ? allImages : [];
  const currentImage = activeImage || displayImages[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(1.5)",
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setZoomStyle({ transformOrigin: "center center", transform: "scale(1)" });
  };

  const handleWishlistToggle = async () => {
    if (!token) {
      toast.error("Please log in to save items to your wishlist.");
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    if (!product) return;

    try {
      if (isWishlisted) {
        await removeFromWishlist(product._id).unwrap();
        toast.success("Removed from wishlist");
      } else {
        await toggleWishList({ productId: product._id }).unwrap();
        toast.success("Saved to wishlist");
      }
      refetchWishlist();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update wishlist.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Showcase Frame */}
      <div className="relative bg-white dark:bg-[#121320] rounded-xl p-2 shadow-sm border border-slate-100 dark:border-slate-800/80 overflow-hidden group">
        {/* Badges overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
          {product?.isBestSeller && (
            <span className="bg-[#003820] dark:bg-[#0f5132] text-white text-[11px] font-bold px-2.5 py-1 rounded flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-[#ffddb8]">star</span>
              <span>{typeof product.isBestSeller === "string" ? product.isBestSeller : "Best Seller"}</span>
            </span>
          )}
          {discountPercentage && (
            <span className="bg-[#fd651e] text-white text-[11px] font-extrabold px-2 py-0.5 rounded shadow-xs">
              -{discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            type="button"
            onClick={handleWishlistToggle}
            disabled={isTogglingWishlist}
            className={`w-10 h-10 rounded-full backdrop-blur-sm shadow flex items-center justify-center transition-all cursor-pointer ${
              isWishlisted
                ? "bg-red-50 text-red-500 border border-red-200 dark:bg-red-950/50 dark:border-red-850"
                : "bg-white/90 dark:bg-slate-800/90 text-slate-500 hover:text-red-500 hover:bg-white border border-slate-150 dark:border-slate-700"
            }`}
            title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
          >
            <span
              className={`material-symbols-outlined text-[20px] transition-transform active:scale-125 ${
                isWishlisted ? "text-red-500 fill-current" : ""
              }`}
              style={{
                fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              favorite
            </span>
          </button>
        </div>

        {/* Main Image Canvas with Zoom */}
        <div
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="w-full aspect-square bg-[#f2f3ff] dark:bg-[#09090e] rounded-lg flex items-center justify-center p-1 relative overflow-hidden cursor-crosshair"
        >
          {currentImage ? (
            <Image
              src={currentImage}
              alt={product?.name || "Product image"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              style={isHovered ? zoomStyle : undefined}
              className="object-contain transition-transform duration-200 select-none pointer-events-none p-1 rounded-lg"
            />
          ) : (
            <div className="text-slate-400 text-xs">No image available</div>
          )}
        </div>
      </div>

      {/* Thumbnails Gallery */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {displayImages.slice(0, 4).map((img, idx) => {
            const isActive = currentImage === img;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImage(img)}
                className={`p-1 rounded-lg transition-all relative aspect-square overflow-hidden bg-white dark:bg-[#121320] border cursor-pointer ${
                  isActive
                    ? "ring-2 ring-[#003820] dark:ring-[#95d4ac] border-[#003820] dark:border-[#95d4ac] bg-[#b0f1c7]/20 shadow-xs"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 shadow-xs"
                }`}
              >
                <Image
                  src={img}
                  alt={`${product?.name || "Product"} thumbnail ${idx + 1}`}
                  fill
                  sizes="100px"
                  className="object-contain rounded p-1"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Trust Seals */}
      <div className="grid grid-cols-3 gap-2 bg-white dark:bg-[#121320] p-3 rounded-xl shadow-xs border border-slate-100 dark:border-slate-800/80 text-center">
        <div className="flex flex-col items-center justify-center p-1 gap-1">
          <div className="w-8 h-8 rounded-full bg-[#b0f1c7] dark:bg-[#0f5132] text-[#003820] dark:text-[#b0f1c7] flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
          </div>
          <span className="text-[11px] font-bold text-slate-900 dark:text-white">100% Genuine</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Official Brand Warranty</span>
        </div>
        <div className="flex flex-col items-center justify-center p-1 gap-1">
          <div className="w-8 h-8 rounded-full bg-[#b0f1c7] dark:bg-[#0f5132] text-[#003820] dark:text-[#b0f1c7] flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">inventory_2</span>
          </div>
          <span className="text-[11px] font-bold text-slate-900 dark:text-white">Safe Transit</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Reinforced Packaging</span>
        </div>
        <div className="flex flex-col items-center justify-center p-1 gap-1">
          <div className="w-8 h-8 rounded-full bg-[#b0f1c7] dark:bg-[#0f5132] text-[#003820] dark:text-[#b0f1c7] flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">published_with_changes</span>
          </div>
          <span className="text-[11px] font-bold text-slate-900 dark:text-white">7 Days Return</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Hassle-free exchange</span>
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;
