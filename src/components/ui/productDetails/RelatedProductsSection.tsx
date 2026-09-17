"use client";

import React from "react";
import Link from "next/link";
import { RelatedProduct } from "./types";

interface RelatedProductsSectionProps {
  products?: RelatedProduct[];
  onAddToCartItem?: (product: any) => void;
}

export const RelatedProductsSection: React.FC<RelatedProductsSectionProps> = ({
  products,
  onAddToCartItem,
}) => {
  const defaultRelated: RelatedProduct[] = [
    {
      _id: "rel-1",
      name: "Prestige Digital Multi-Function Pressure Cooker 6L (1100W)",
      price: 5450,
      originalPrice: 6900,
      discountBadge: "-21% OFF",
      rating: 4.9,
      reviewsCount: 98,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDBQPx0ClXeLOyEyW7rduqs2_uozwRdKPhI9QxdGEV15t4KU5ChYGsNHQExxZiuFTPfKD1kR70iBtEvDp_COwkKwevFUyHnRj1BqamdABr-mXLxZVVpNRqCO5jJ8a6vabbJY6b8bBXYDMJFg7-pHppv5hrYxi_A17FH96XW4rcpEgLUMnwzvjYlBivV4TrSHtlcEGmURy5EOaLRLDbByVOCIH4CJRDy00YVVs8_LFY8RU5vkisSTH5qkQ",
    },
    {
      _id: "rel-2",
      name: "GhorBazar Smart Touch Emerald Air Fryer 4.5L (Rapid Crisp)",
      price: 6200,
      originalPrice: 7800,
      discountBadge: "-20% OFF",
      rating: 4.8,
      reviewsCount: 112,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCMJFzKFUf-nE5Yign340ZIpZcnhXX35cT0WqmzuJmVsuPm0eDjgK3kOHi0YrJW4jkirnkRlOs-hGHN-GuozjonjNFoED07EFNkPjS6Nx2WK6l2kyj3Ic4bUdj7fhc7cpjCDrnxd6_dTKLMl7Ku3xYzwpo-9ZV9Q_-AK5ve274yYgb0cKQlu6PvpmXWMWPjaftw6Lepn4JuQTa0erPseWLNl66x3FFE9sdOI--PNrKzoB2IXQ1O0jm2wA",
    },
    {
      _id: "rel-3",
      name: "Prestige Compact Double Pot Rice Cooker 1.8L (700W)",
      price: 2950,
      originalPrice: 3600,
      discountBadge: "-18% OFF",
      rating: 4.7,
      reviewsCount: 64,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDrgbiwPSzG7gl8rNKJwOdAsP4uatvp6MBW-1jE8Xg8lEi9DD8Pva38UXZV8sAX7PzZn4GQX0McuiukbbS-B9nFZvrNEsPp-vlp8DvzwuGNm6-qQQ1cE_jb0JOJHLFifYqRMZBG5nvV9G9NIEMhxeh-qyV-HkIbIptyodV5RciwaitpvMj3SA9b6s5o7WLoEc80hFPMnF4RwVv9WMe8AcjY-X23WlLTfRy6aa6fAmY90txfhqodfjWd1Q",
    },
    {
      _id: "rel-4",
      name: "Prestige Multi-Cooker Electric Hot Pot & Steamer 3L",
      price: 3100,
      originalPrice: 3900,
      discountBadge: "-20% OFF",
      rating: 4.6,
      reviewsCount: 42,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDBQPx0ClXeLOyEyW7rduqs2_uozwRdKPhI9QxdGEV15t4KU5ChYGsNHQExxZiuFTPfKD1kR70iBtEvDp_COwkKwevFUyHnRj1BqamdABr-mXLxZVVpNRqCO5jJ8a6vabbJY6b8bBXYDMJFg7-pHppv5hrYxi_A17FH96XW4rcpEgLUMnwzvjYlBivV4TrSHtlcEGmURy5EOaLRLDbByVOCIH4CJRDy00YVVs8_LFY8RU5vkisSTH5qkQ",
    },
  ];

  const items = products && products.length > 0 ? products : defaultRelated;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <span className="text-[11px] text-[#003820] dark:text-[#95d4ac] font-bold tracking-wider uppercase">
              Pair Your Kitchen
            </span>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
              Frequently Bought Together & Similar Appliances
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-[#003820] dark:text-[#95d4ac] hover:underline flex items-center gap-1"
          >
            <span>Explore All Rice Cookers & Multi-cookers</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((prod) => (
            <div
              key={prod._id}
              className="bg-white dark:bg-[#121320] rounded-xl p-4 shadow-xs border border-slate-100 dark:border-slate-800/80 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="flex flex-col gap-2">
                <div className="relative w-full aspect-square bg-[#f2f3ff] dark:bg-[#09090e] rounded-lg p-3 flex items-center justify-center overflow-hidden">
                  {prod.discountBadge && (
                    <span className="absolute top-2 left-2 bg-[#fd651e] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs z-10">
                      {prod.discountBadge}
                    </span>
                  )}
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="flex items-center gap-1 text-amber-500 text-xs">
                  <span
                    className="material-symbols-outlined text-[14px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-xs">
                    {prod.rating.toFixed(1)}
                  </span>
                  <span className="text-slate-400 text-[11px]">({prod.reviewsCount})</span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-[#003820] dark:hover:text-[#95d4ac] transition-colors">
                  {prod.name}
                </h3>
              </div>

              <div className="flex flex-col gap-2 pt-3 mt-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-[#003820] dark:text-[#95d4ac]">
                    ৳ {prod.price.toLocaleString("en-US")}
                  </span>
                  {prod.originalPrice && (
                    <span className="text-xs text-slate-400 line-through opacity-75">
                      ৳ {prod.originalPrice.toLocaleString("en-US")}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onAddToCartItem?.(prod)}
                  className="w-full bg-[#0f5132] hover:bg-[#003820] text-white py-2 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProductsSection;
