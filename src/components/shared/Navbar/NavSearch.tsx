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
  const [category, setCategory] = useState("All Categories");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isFetching } = useGetAllProductsQuery(
    { searchTerm: debouncedSearch, category: category !== "All Categories" ? category : undefined },
    { skip: debouncedSearch.length < 2 }
  );

  const products = data?.data?.data || [];

  const handleProductClick = (item: any) => {
    setSearch("");
    router.push(`/products/${item?.slug || item?._id}`);
  };

  const handleSearch = () => {
    if (!search.trim()) return;
    const catQuery = category !== "All Categories" ? `&category=${encodeURIComponent(category)}` : "";
    router.push(`/products?search=${encodeURIComponent(search)}${catQuery}`);
    setSearch("");
  };

  return (
    <div className="relative flex-1 max-w-2xl mx-2">
      <div className="flex items-center rounded-lg bg-[#f2f3ff] dark:bg-[#09090e] p-1 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        {/* Category selector */}
        <div className="relative hidden sm:block">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Category selection"
            className="appearance-none bg-transparent pl-3 pr-7 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="All Categories">All Categories</option>
            <option value="Plastic Household">Plastic Household</option>
            <option value="Kitchenware">Kitchenware</option>
            <option value="Rice Cookers">Rice Cookers</option>
            <option value="Storage & Organization">Storage & Organization</option>
          </select>
          <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-[18px] text-slate-400 pointer-events-none">
            arrow_drop_down
          </span>
        </div>

        <div className="hidden sm:block h-5 w-[1px] bg-slate-300 dark:bg-slate-700 mx-1"></div>

        {/* Search input */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search 10,000+ kitchen appliances, fryers, plasticware..."
          className="w-full bg-transparent px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
        />

        {/* Search button */}
        <button
          type="button"
          onClick={handleSearch}
          aria-label="Search Store"
          className="flex items-center justify-center bg-[#003820] dark:bg-[#0f5132] text-white px-3.5 py-1.5 rounded-md hover:bg-[#0f5132] transition-colors cursor-pointer"
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
              {products.slice(0, 6).map((item: any) => (
                <div
                  key={item._id}
                  onClick={() => handleProductClick(item)}
                  className="p-2 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-[#f2f3ff] dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="relative w-9 h-9 shrink-0 bg-slate-100 dark:bg-slate-900 rounded overflow-hidden">
                    <img
                      src={item.thumbnail || "/placeholder.png"}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-[#003820] dark:text-[#95d4ac] font-medium">
                      {item.category?.name || "Kitchen"}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    ৳ {getDisplayPrice(item, customerType).toLocaleString("en-US")}
                  </span>
                </div>
              ))}
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
