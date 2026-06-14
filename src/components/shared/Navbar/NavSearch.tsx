"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { getImageUrl } from "@/utils/getImageUrl";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";
import { useSearchAllProductsQuery } from "@/redux/features/product/productApi";

const NavbarSearch = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  const { data, isFetching } = useSearchAllProductsQuery(
    { search: debouncedSearch },
    { skip: debouncedSearch.length < 2 } // must be at least 2 characters
  );

  const products = data?.data?.products?.data || [];
  //eslint-disable-next-line
  const handleProductClick = (item: any) => {
    setSearch("");
    router.push(`/books/${item?.slug}`);
  };

  const handleSearch = () => {
    if (!search.trim()) return;
    router.push(`/search?text=${encodeURIComponent(search)}`);
    setSearch("");
  };

  return (
    <div className="relative flex-1 basis-full   sm:basis-auto sm:flex-none md:w-74 lg:w-137.5 border-2 border-gray-300 flex h-10 sm:h-11.25 items-center gap-2 rounded-4xl p-1 bg-white ">
      <input
        type="text"
        placeholder="বই বা লেখক দিয়ে সার্চ করুন..."
        className="flex-1 h-full outline-none ml-4 text-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <button
        onClick={handleSearch}
        className="flex items-center bg-gray-600 rounded-4xl px-4 text-white gap-1 h-full justify-center cursor-pointer hover:bg-gray-700 transition-colors"
      >
        <IoSearchOutline className="text-[15px]" />
        <span className="text-xs font-medium">Search</span>
      </button>

      {/* Search Result Overlay */}
      {search.length >= 2 && (
        <div className="absolute top-[110%] left-0 right-0 bg-white max-h-100 w-full  z-999 shadow-2xl border border-gray-200 rounded-xl p-2 overflow-y-auto custom-scrollbar">
          {isFetching && (
            <div className="flex items-center justify-center p-4 gap-2 text-sm text-gray-500">
              <Spinner /> টাইপ করছেন...
            </div>
          )}

          {!isFetching && products.length > 0 ? (
            <div className="flex base-width!  flex-col gap-1">
              {products.map((item: any) => (
                <div
                  key={item?.id}
                  onClick={() => handleProductClick(item)}
                  className="p-2 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100"
                >
                  <div className="relative w-10 h-10 shrink-0">
                    <Image
                      src={getImageUrl(item?.image || item?.thumbnail_image)}
                      alt={item?.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {item?.name}
                    </p>
                    <p className="text-xs text-blue-600 truncate">
                      {item?.category?.name}
                    </p>
                  </div>

                  <div className="text-sm font-bold text-gray-900">
                    ৳{Number(item?.sale_price).toFixed(0)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !isFetching && (
              <div className="py-6 text-center text-gray-500 flex flex-col items-center gap-2">
                <MdOutlineProductionQuantityLimits
                  size={30}
                  className="text-red-400"
                />
                <p className="text-sm">দুঃখিত, কোনো বই পাওয়া যায়নি!</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default NavbarSearch;
