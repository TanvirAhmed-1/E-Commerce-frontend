"use client";

import React from "react";
import Link from "next/link";
import { getDisplayPrice } from "@/utils/priceHelper";

interface HomeFeaturedProductsProps {
  products?: any[];
  onAddToCart: (e: React.MouseEvent, product: any) => void;
  customerType?: string | null;
}

export const HomeFeaturedProducts: React.FC<HomeFeaturedProductsProps> = ({
  products = [],
  onAddToCart,
  customerType,
}) => {
  const defaultFeatured = [
    {
      _id: "feat-1",
      name: "Plastic Storage Box (Heavy Duty)",
      slug: "plastic-storage-box",
      basePrice: 400,
      salePrice: 320,
      productDiscount: 20,
      thumbnail:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDBQPx0ClXeLOyEyW7rduqs2_uozwRdKPhI9QxdGEV15t4KU5ChYGsNHQExxZiuFTPfKD1kR70iBtEvDp_COwkKwevFUyHnRj1BqamdABr-mXLxZVVpNRqCO5jJ8a6vabbJY6b8bBXYDMJFg7-pHppv5hrYxi_A17FH96XW4rcpEgLUMnwzvjYlBivV4TrSHtlcEGmURy5EOaLRLDbByVOCIH4CJRDy00YVVs8_LFY8RU5vkisSTH5qkQ",
    },
    {
      _id: "feat-2",
      name: "Plastic Bucket 20L (Reinforced Handle)",
      slug: "plastic-bucket-20l",
      basePrice: 400,
      salePrice: 320,
      productDiscount: 20,
      thumbnail:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCMJFzKFUf-nE5Yign340ZIpZcnhXX35cT0WqmzuJmVsuPm0eDjgK3kOHi0YrJW4jkirnkRlOs-hGHN-GuozjonjNFoED07EFNkPjS6Nx2WK6l2kyj3Ic4bUdj7fhc7cpjCDrnxd6_dTKLMl7Ku3xYzwpo-9ZV9Q_-AK5ve274yYgb0cKQlu6PvpmXWMWPjaftw6Lepn4JuQTa0erPseWLNl66x3FFE9sdOI--PNrKzoB2IXQ1O0jm2wA",
    },
    {
      _id: "feat-3",
      name: "Prestige Deluxe Duo-Pot Electric Rice Cooker 1.8L",
      slug: "prestige-rice-cooker-1-8l",
      basePrice: 5600,
      salePrice: 4990,
      productDiscount: 11,
      thumbnail:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDrgbiwPSzG7gl8rNKJwOdAsP4uatvp6MBW-1jE8Xg8lEi9DD8Pva38UXZV8sAX7PzZn4GQX0McuiukbbS-B9nFZvrNEsPp-vlp8DvzwuGNm6-qQQ1cE_jb0JOJHLFifYqRMZBG5nvV9G9NIEMhxeh-qyV-HkIbIptyodV5RciwaitpvMj3SA9b6s5o7WLoEc80hFPMnF4RwVv9WMe8AcjY-X23WlLTfRy6aa6fAmY90txfhqodfjWd1Q",
    },
    {
      _id: "feat-4",
      name: "Container Set (3 Pcs Airtight Food Jars)",
      slug: "container-set-3pcs",
      basePrice: 1600,
      salePrice: 1250,
      productDiscount: 22,
      thumbnail:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDBQPx0ClXeLOyEyW7rduqs2_uozwRdKPhI9QxdGEV15t4KU5ChYGsNHQExxZiuFTPfKD1kR70iBtEvDp_COwkKwevFUyHnRj1BqamdABr-mXLxZVVpNRqCO5jJ8a6vabbJY6b8bBXYDMJFg7-pHppv5hrYxi_A17FH96XW4rcpEgLUMnwzvjYlBivV4TrSHtlcEGmURy5EOaLRLDbByVOCIH4CJRDy00YVVs8_LFY8RU5vkisSTH5qkQ",
    },
  ];

  const items = products && products.length > 0 ? products.slice(0, 4) : defaultFeatured;

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-6 w-full">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
            Featured Products
          </h2>
          <Link
            href="/products"
            className="text-xs font-bold text-[#003820] dark:text-[#95d4ac] hover:underline flex items-center gap-1"
          >
            <span>See More</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((prod) => {
            const price = getDisplayPrice(prod, customerType) || prod.salePrice || prod.basePrice;
            const original = prod.basePrice || price;
            const discount = prod.productDiscount || (original > price ? Math.round(((original - price) / original) * 100) : 0);

            return (
              <div
                key={prod._id}
                className="bg-white dark:bg-[#121320] rounded-xl p-3.5 border border-slate-200/70 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <Link href={`/products/${prod.slug || prod._id}`} className="flex flex-col gap-2">
                  <div className="relative w-full aspect-square bg-[#f2f3ff] dark:bg-[#09090e] rounded-lg p-2 flex items-center justify-center overflow-hidden">
                    {discount > 0 && (
                      <span className="absolute top-2 left-2 bg-[#fd651e] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs z-10">
                        -{discount}%
                      </span>
                    )}
                    <img
                      src={prod.thumbnail || "/placeholder.png"}
                      alt={prod.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-[#003820] dark:hover:text-[#95d4ac] transition-colors min-h-[32px]">
                    {prod.name}
                  </h3>
                </Link>

                <div className="flex flex-col gap-2 pt-2 mt-1 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold text-[#003820] dark:text-[#95d4ac]">
                      ৳ {price.toLocaleString("en-US")}
                    </span>
                    {original > price && (
                      <span className="text-xs text-slate-400 line-through">
                        ৳ {original.toLocaleString("en-US")}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => onAddToCart(e, prod)}
                    className="w-full bg-[#003820] hover:bg-[#0f5132] text-white py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeFeaturedProducts;
