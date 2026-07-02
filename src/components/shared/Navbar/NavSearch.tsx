"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";
import { useGetAllProductsQuery } from "@/redux/features/product/productApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getDisplayPrice } from "@/utils/priceHelper";

const NavbarSearch = () => {
  const { customerType } = useSelector((state: RootState) => state.auth);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  const { data, isFetching } = useGetAllProductsQuery(
    { searchTerm: debouncedSearch },
    { skip: debouncedSearch.length < 2 }
  );

  const products = data?.data?.data || [];

  const handleProductClick = (item: any) => {
    setSearch("");
    router.push(`/products/${item?.slug}`);
  };

  const handleSearch = () => {
    if (!search.trim()) return;
    router.push(`/products?search=${encodeURIComponent(search)}`);
    setSearch("");
  };

  return (
    <div className="relative flex-1 basis-full sm:basis-auto sm:flex-none md:w-74 lg:w-110 flex h-10 sm:h-11 items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#151522] px-3.5 transition-all duration-300 focus-within:border-primary/50 dark:focus-within:border-[#5f5eff]/50 focus-within:ring-2 focus-within:ring-primary/10 dark:focus-within:ring-[#5f5eff]/10">
      <IoSearchOutline className="text-slate-400 dark:text-slate-500 text-lg shrink-0" />
      <input
        type="text"
        placeholder="Search specialized gear..."
        className="flex-1 h-full bg-transparent border-none outline-none text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      {search && (
        <button
          onClick={() => setSearch("")}
          className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0 cursor-pointer"
        >
          Clear
        </button>
      )}

      {/* Search Result Overlay */}
      {search.length >= 2 && (
        <div className="absolute top-[110%] left-0 right-0 bg-white dark:bg-[#151522] max-h-100 w-full z-999 shadow-2xl border border-slate-200 dark:border-slate-800 rounded-2xl p-2 overflow-y-auto custom-scrollbar">
          {isFetching && (
            <div className="flex items-center justify-center p-4 gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Spinner /> Searching...
            </div>
          )}

          {!isFetching && products.length > 0 ? (
            <div className="flex flex-col gap-1">
              {products.map((item: any) => (
                <div
                  key={item?._id}
                  onClick={() => handleProductClick(item)}
                  className="p-2 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-[#1e1e32] transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                >
                  <div className="relative w-10 h-10 shrink-0">
                    <Image
                      src={item?.thumbnail || "/placeholder.png"}
                      alt={item?.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-850 dark:text-slate-200 truncate">
                      {item?.name}
                    </p>
                    <p className="text-xs text-primary dark:text-[#5f5eff] truncate font-medium">
                      {item?.category?.name}
                    </p>
                  </div>

                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    ৳{getDisplayPrice(item, customerType).toFixed(0)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !isFetching && (
              <div className="py-6 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center gap-2">
                <MdOutlineProductionQuantityLimits
                  size={30}
                  className="text-red-400 dark:text-red-500/80"
                />
                <p className="text-sm">No products found!</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default NavbarSearch;
