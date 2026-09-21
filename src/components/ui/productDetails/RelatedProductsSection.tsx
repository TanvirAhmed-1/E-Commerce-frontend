"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useGetAllProductsQuery } from "@/redux/features/product/productApi";
import { renderStars } from "@/utils/renderStars";
import { useProductContext } from "./ProductContext";

export const RelatedProductsSection: React.FC = () => {
  const { product } = useProductContext();

  const currentProductId = product?._id;
  const categoryId = product?.category?._id;

  const { data: responseData, isLoading } = useGetAllProductsQuery(
    categoryId ? { category: categoryId, limit: 5 } : { limit: 5 },
    { skip: !currentProductId }
  );

  const rawData = responseData?.data;
  const allFetched: any[] = Array.isArray(rawData?.data)
    ? rawData.data
    : Array.isArray(rawData)
    ? rawData
    : Array.isArray(responseData)
    ? responseData
    : [];

  const relatedProducts = allFetched
    .filter((p: any) => p && p._id && p._id !== currentProductId)
    .slice(0, 4);

  if (isLoading || relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <span className="text-[11px] text-[#003820] dark:text-[#95d4ac] font-bold tracking-wider uppercase">
              Similar Products
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
              You May Also Like
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-[#003820] dark:text-[#95d4ac] hover:underline flex items-center gap-1"
          >
            <span>View All Products</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedProducts.map((prod: any) => {
            const displayPrice = prod.salePrice || prod.basePrice || 0;
            const originalPrice =
              prod.basePrice && prod.salePrice && prod.basePrice > prod.salePrice
                ? prod.basePrice
                : undefined;
            const discountBadge =
              prod.productDiscount && prod.productDiscount > 0
                ? `-${prod.productDiscount}%`
                : undefined;
            const imgUrl = prod.thumbnail || prod.images?.[0] || "";

            return (
              <div
                key={prod._id}
                className="bg-white dark:bg-[#121320] rounded-xl p-4 shadow-xs border border-slate-100 dark:border-slate-800/80 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="flex flex-col gap-2">
                  <Link
                    href={`/products/${prod.slug || prod._id}`}
                    className="relative w-full aspect-square bg-[#f2f3ff] dark:bg-[#09090e] rounded-lg p-2 flex items-center justify-center overflow-hidden block"
                  >
                    {discountBadge && (
                      <span className="absolute top-2 left-2 bg-[#fd651e] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs z-10">
                        {discountBadge}
                      </span>
                    )}
                    {imgUrl ? (
                      <Image
                        src={imgUrl}
                        alt={prod.name || "Related product"}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-slate-400 text-xs">No image</div>
                    )}
                  </Link>

                  <div className="flex items-center gap-1 text-amber-500 text-xs">
                    <div className="text-xs">
                      {renderStars(prod.averageRating || 5)}
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white text-xs">
                      {(prod.averageRating || 5).toFixed(1)}
                    </span>
                  </div>

                  <Link href={`/products/${prod.slug || prod._id}`}>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-[#003820] dark:hover:text-[#95d4ac] transition-colors">
                      {prod.name}
                    </h3>
                  </Link>
                </div>

                <div className="flex flex-col gap-2 pt-3 mt-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold text-[#003820] dark:text-[#95d4ac]">
                      ৳ {displayPrice.toLocaleString("en-US")}
                    </span>
                    {originalPrice && (
                      <span className="text-xs text-slate-400 line-through opacity-75">
                        ৳ {originalPrice.toLocaleString("en-US")}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/products/${prod.slug || prod._id}`}
                    className="w-full bg-[#0f5132] hover:bg-[#003820] text-white py-2 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 text-center"
                  >
                    <span>View Product</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RelatedProductsSection;
