"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  activeImage: string;
  onSelectImage: (img: string) => void;
  productName: string;
  discountBadge?: string;
  bestSellerTag?: string;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  isTogglingWishlist?: boolean;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  activeImage,
  onSelectImage,
  productName,
  discountBadge = "-26% OFF",
  bestSellerTag = "Best Seller in Kitchen 2025",
  isWishlisted,
  onToggleWishlist,
  isTogglingWishlist = false,
}) => {
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
    transform: "scale(1)",
    transformOrigin: "center center",
  });
  const [isHovered, setIsHovered] = useState(false);

  // Fallback images if empty
  const defaultImages = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDrgbiwPSzG7gl8rNKJwOdAsP4uatvp6MBW-1jE8Xg8lEi9DD8Pva38UXZV8sAX7PzZn4GQX0McuiukbbS-B9nFZvrNEsPp-vlp8DvzwuGNm6-qQQ1cE_jb0JOJHLFifYqRMZBG5nvV9G9NIEMhxeh-qyV-HkIbIptyodV5RciwaitpvMj3SA9b6s5o7WLoEc80hFPMnF4RwVv9WMe8AcjY-X23WlLTfRy6aa6fAmY90txfhqodfjWd1Q",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDBQPx0ClXeLOyEyW7rduqs2_uozwRdKPhI9QxdGEV15t4KU5ChYGsNHQExxZiuFTPfKD1kR70iBtEvDp_COwkKwevFUyHnRj1BqamdABr-mXLxZVVpNRqCO5jJ8a6vabbJY6b8bBXYDMJFg7-pHppv5hrYxi_A17FH96XW4rcpEgLUMnwzvjYlBivV4TrSHtlcEGmURy5EOaLRLDbByVOCIH4CJRDy00YVVs8_LFY8RU5vkisSTH5qkQ",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCMJFzKFUf-nE5Yign340ZIpZcnhXX35cT0WqmzuJmVsuPm0eDjgK3kOHi0YrJW4jkirnkRlOs-hGHN-GuozjonjNFoED07EFNkPjS6Nx2WK6l2kyj3Ic4bUdj7fhc7cpjCDrnxd6_dTKLMl7Ku3xYzwpo-9ZV9Q_-AK5ve274yYgb0cKQlu6PvpmXWMWPjaftw6Lepn4JuQTa0erPseWLNl66x3FFE9sdOI--PNrKzoB2IXQ1O0jm2wA",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDrgbiwPSzG7gl8rNKJwOdAsP4uatvp6MBW-1jE8Xg8lEi9DD8Pva38UXZV8sAX7PzZn4GQX0McuiukbbS-B9nFZvrNEsPp-vlp8DvzwuGNm6-qQQ1cE_jb0JOJHLFifYqRMZBG5nvV9G9NIEMhxeh-qyV-HkIbIptyodV5RciwaitpvMj3SA9b6s5o7WLoEc80hFPMnF4RwVv9WMe8AcjY-X23WlLTfRy6aa6fAmY90txfhqodfjWd1Q",
  ];

  const displayImages = images && images.length > 0 ? images : defaultImages;
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

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setZoomStyle({
      transformOrigin: "center center",
      transform: "scale(1)",
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Showcase Frame */}
      <div className="relative bg-white dark:bg-[#121320] rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800/80 overflow-hidden group">
        {/* Badges overlay */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
          {bestSellerTag && (
            <span className="bg-[#003820] dark:bg-[#0f5132] text-white text-[11px] font-bold px-2.5 py-1 rounded shadow-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-[#ffddb8]">star</span>
              {bestSellerTag}
            </span>
          )}
          {discountBadge && (
            <span className="bg-[#fd651e] text-white text-[11px] font-extrabold px-2 py-0.5 rounded shadow-xs">
              {discountBadge}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            type="button"
            onClick={onToggleWishlist}
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
          className="w-full aspect-square bg-[#f2f3ff] dark:bg-[#09090e] rounded-lg flex items-center justify-center p-4 relative overflow-hidden cursor-crosshair"
        >
          <img
            src={currentImage}
            alt={productName}
            style={isHovered ? zoomStyle : undefined}
            className="w-full h-full object-contain transition-transform duration-200 select-none pointer-events-none"
          />
          <div className="absolute bottom-2 right-2 bg-slate-900/75 text-white text-[11px] font-semibold px-2.5 py-1 rounded backdrop-blur flex items-center gap-1 pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-[14px]">zoom_in</span>
            Roll over image to zoom
          </div>
        </div>
      </div>

      {/* Thumbnails Gallery */}
      <div className="grid grid-cols-4 gap-2">
        {displayImages.slice(0, 4).map((img, idx) => {
          const isActive = currentImage === img;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectImage(img)}
              className={`p-1 rounded-lg transition-all relative overflow-hidden bg-white dark:bg-[#121320] border cursor-pointer ${
                isActive
                  ? "ring-2 ring-[#003820] dark:ring-[#95d4ac] border-[#003820] dark:border-[#95d4ac] bg-[#b0f1c7]/20 shadow-xs"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 shadow-xs"
              }`}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full aspect-square object-contain rounded"
              />
            </button>
          );
        })}
      </div>

      {/* Trust seals underneath gallery */}
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
