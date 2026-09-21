"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useGetAllProductsQuery } from "@/redux/features/product/productApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getDisplayPrice } from "@/utils/priceHelper";

export default function NavbarSearch() {
  const { customerType } = useSelector((state: RootState) => state.auth);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isFetching } = useGetAllProductsQuery(
    { searchTerm: debouncedSearch },
    { skip: debouncedSearch.length < 2 }
  );

  const rawData = data?.data;
  const products: any[] = Array.isArray(rawData?.data)
    ? rawData.data
    : Array.isArray(rawData)
    ? rawData
    : [];

  const handleProductClick = (item: any) => {
    setSearch("");
    router.push(`/products/${item?.slug || item?._id}`);
  };

  const handleSearch = () => {
    if (!search.trim()) return;
    router.push(`/products?search=${encodeURIComponent(search.trim())}`);
    setSearch("");
  };

  return (
    <div className="relative flex-1 max-w-2xl mx-2">
      <div className="flex items-center rounded-lg bg-[#f2f3ff] dark:bg-[#09090e] p-1 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        {/* Search input */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search products, appliances, items..."
          className="w-full bg-transparent px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
        />

        {/* Search button */}
        <button
          type="button"
          onClick={handleSearch}
          aria-label="Search Store"
          className="flex items-center justify-center bg-[#003820] dark:bg-[#0f5132] text-white px-3.5 py-1.5 rounded-md hover:bg-[#0f5132] transition-colors cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">search</span>
        </button>
      </div>

      {/* Live search results dropdown */}
      {search.length >= 2 && (
        <div className="absolute top-[115%] left-0 right-0 bg-white dark:bg-[#121320] max-h-80 w-full z-50 shadow-2xl border border-slate-200 dark:border-slate-800 rounded-xl p-2 overflow-y-auto">
          {isFetching && (
            <div className="flex items-center justify-center p-4 text-xs text-slate-500">
              Searching products...
            </div>
          )}

          {!isFetching && products.length > 0 && (
            <div className="flex flex-col gap-1">
              {products.slice(0, 6).map((item: any) => {
                const imgUrl = item.thumbnail || item.images?.[0] || "";
                return (
                  <div
                    key={item._id}
                    onClick={() => handleProductClick(item)}
                    className="p-2 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-[#f2f3ff] dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="relative w-9 h-9 shrink-0 bg-slate-100 dark:bg-slate-900 rounded overflow-hidden">
                      {imgUrl ? (
                        <Image
                          src={imgUrl}
                          alt={item.name || "Product thumbnail"}
                          fill
                          sizes="36px"
                          className="object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-400">
                          N/A
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-[#003820] dark:text-[#95d4ac] font-medium truncate">
                        {item.category?.name || "Product"}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      ৳ {getDisplayPrice(item, customerType).toLocaleString("en-US")}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {!isFetching && products.length === 0 && (
            <div className="p-4 text-center text-xs text-slate-400">
              No products found for &quot;{search}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
