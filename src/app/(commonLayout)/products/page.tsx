"use client";

import React, { Suspense, useState } from "react";
import { useGetAllProductsQuery } from "@/redux/features/product/productApi";
import { useGetMenuCategoryQuery } from "@/redux/features/home/homeApi";
import { useAddToCartMutation } from "@/redux/features/cart/cartApi";
import { useGetWishListQuery, useToggleWishListMutation, useRemoveFromWishListMutation } from "@/redux/features/wishList/wishListApi";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";
import { renderStars } from "@/utils/renderStars";
import { getDisplayPrice, hasDiscount } from "@/utils/priceHelper";
import {
  ShoppingBag,
  SlidersHorizontal,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Search,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token, customerType } = useSelector((state: RootState) => state.auth);
  const [addToCartApi] = useAddToCartMutation();

  const category = searchParams.get("category") || "";
  const nameParam = searchParams.get("name") || "";
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") || "1");

  const [sortBy, setSortBy] = useState<string>("-createdAt");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("5000");

  // Accordion state
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isBrandOpen, setIsBrandOpen] = useState(true);

  // Brand state (just for visual selection like reference)
  const [selectedBrand, setSelectedBrand] = useState<string>("");

  const { data: productsData, isLoading: productsLoading } = useGetAllProductsQuery({
    category,
    searchTerm: search,
    page,
    limit: 12,
    sort: sortBy,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
  });

  const { data: categoriesData } = useGetMenuCategoryQuery(undefined);
  const { data: wishlistResponse, refetch: refetchWishlist } = useGetWishListQuery(undefined, { skip: !token });
  const [toggleWishList, { isLoading: isTogglingWishlist }] = useToggleWishListMutation();
  const [removeFromWishlist, { isLoading: isRemovingWishlist }] = useRemoveFromWishListMutation();

  const products = productsData?.data?.data || [];
  const meta = productsData?.data?.meta || { page: 1, limit: 12, total: 0, totalPage: 1 };
  const categories = categoriesData?.data || [];
  const wishlistProducts = wishlistResponse?.data?.products || [];

  const handleAddToCart = async (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      toast.error("Please log in to add items to your cart.");
      const redirectPath = encodeURIComponent(window.location.pathname + window.location.search);
      router.push(`/login?redirect=${redirectPath}`);
      return;
    }

    const defaultVariant = product.productVariants?.[0];
    if (product.hasVariants && !defaultVariant) {
      toast.error("This product variant is unavailable.");
      return;
    }

    const variantId = defaultVariant?._id || product._id;

    try {
      await addToCartApi({
        product: product._id,
        variant: variantId,
        quantity: 1,
      }).unwrap();
      toast.success(`${product.name} added to cart!`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add to cart.");
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent, productId: string, isWishlisted: boolean) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      toast.error("Please log in to manage your wishlist.");
      const redirectPath = encodeURIComponent(window.location.pathname + window.location.search);
      router.push(`/login?redirect=${redirectPath}`);
      return;
    }

    try {
      if (isWishlisted) {
        await removeFromWishlist(productId).unwrap();
        toast.success("Removed from wishlist.");
      } else {
        await toggleWishList({ productId }).unwrap();
        toast.success("Added to wishlist.");
      }
      refetchWishlist();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update wishlist.");
    }
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/products?${params.toString()}`);
  };

  const handleCategoryChange = (catSlug: string, catName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (catSlug) {
      params.set("category", catSlug);
      params.set("name", catName);
    } else {
      params.delete("category");
      params.delete("name");
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleClearFilters = () => {
    router.push("/products");
    setMinPrice("");
    setMaxPrice("5000");
    setSortBy("-createdAt");
    setSelectedBrand("");
  };

  const handleChatWithUs = (e: React.MouseEvent, productName: string) => {
    e.preventDefault();
    e.stopPropagation();
    const message = encodeURIComponent(`Hi, I am interested in "${productName}". Can I get more details?`);
    window.open(`https://wa.me/8801700000000?text=${message}`, "_blank");
  };

  const displayName = nameParam || (category ? category.replace(/-/g, " ") : "Products List");

  return (
    <div className="bg-slate-50 dark:bg-[#0B0B14] min-h-screen py-10 transition-colors duration-300">
      <div className="container lg:max-w-[1400px] mx-auto px-4">
        {/* Breadcrumb / Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white dark:bg-[#131424] p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-450">
            <Link href="/" className="hover:text-primary dark:hover:text-[#5f5eff] transition-colors font-medium">Home</Link>
            <ChevronRight size={14} />
            <Link href="/products" className="hover:text-primary dark:hover:text-[#5f5eff] transition-colors font-medium">Catalog</Link>
            {category && (
              <>
                <ChevronRight size={14} />
                <span className="text-primary dark:text-[#5f5eff] font-semibold capitalize">
                  {displayName}
                </span>
              </>
            )}
            {search && (
              <>
                <ChevronRight size={14} />
                <span className="text-primary dark:text-[#5f5eff] font-semibold">
                  Search: &quot;{search}&quot;
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 outline-none bg-white dark:bg-[#131424] font-semibold text-slate-700 dark:text-slate-250 cursor-pointer focus:border-primary dark:focus:border-[#5f5eff] transition-all"
            >
              <option value="-createdAt">Newest First</option>
              <option value="salePrice">Price: Low to High</option>
              <option value="-salePrice">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-5">
            <div className="bg-white dark:bg-[#131424] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="font-extrabold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-primary dark:text-[#5f5eff]" /> Filters
                </h2>
                {(category || minPrice || maxPrice !== "5000" || selectedBrand) && (
                  <button
                    onClick={handleClearFilters}
                    className="text-xs font-bold text-primary dark:text-[#5f5eff] hover:underline bg-transparent border-0 cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Category Filter Group */}
              <div className="border-b border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="w-full p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-[#181829] transition-colors text-left bg-transparent border-0 cursor-pointer"
                >
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">Category</span>
                  {isCategoryOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>
                {isCategoryOpen && (
                  <div className="px-5 pb-5 max-h-64 overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-3 cursor-pointer group text-sm font-medium text-slate-650 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                        <input
                          type="checkbox"
                          checked={!category}
                          onChange={() => handleCategoryChange("", "")}
                          className="w-4 h-4 rounded border-slate-350 dark:border-slate-700 text-primary dark:text-[#5f5eff] focus:ring-primary dark:focus:ring-[#5f5eff]/40 cursor-pointer accent-[#5f5eff]"
                        />
                        <span>All Products</span>
                      </label>
                      {categories.map((cat: any) => (
                        <label key={cat._id} className="flex items-center gap-3 cursor-pointer group text-sm font-medium text-slate-650 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                          <input
                            type="checkbox"
                            checked={category === cat.slug}
                            onChange={() => handleCategoryChange(cat.slug, cat.name)}
                            className="w-4 h-4 rounded border-slate-350 dark:border-slate-700 text-primary dark:text-[#5f5eff] focus:ring-primary dark:focus:ring-[#5f5eff]/40 cursor-pointer accent-[#5f5eff]"
                          />
                          <span className={category === cat.slug ? "text-primary dark:text-[#5f5eff] font-bold" : ""}>{cat.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Range Filter Group */}
              <div className="border-b border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setIsPriceOpen(!isPriceOpen)}
                  className="w-full p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-[#181829] transition-colors text-left bg-transparent border-0 cursor-pointer"
                >
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">Price Range</span>
                  {isPriceOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>
                {isPriceOpen && (
                  <div className="px-5 pb-5">
                    <div className="space-y-4">
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        step="50"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary dark:accent-[#5f5eff]"
                      />
                      <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                        <span>৳0</span>
                        <span>৳{maxPrice}</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="w-full text-xs border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 outline-none focus:border-primary dark:focus:border-[#5f5eff] bg-white dark:bg-[#151522] text-slate-800 dark:text-slate-100 transition-all"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="w-full text-xs border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 outline-none focus:border-primary dark:focus:border-[#5f5eff] bg-white dark:bg-[#151522] text-slate-800 dark:text-slate-100 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Brand Filter Group */}
              <div>
                <button
                  onClick={() => setIsBrandOpen(!isBrandOpen)}
                  className="w-full p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-[#181829] transition-colors text-left bg-transparent border-0 cursor-pointer"
                >
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">Brand</span>
                  {isBrandOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </button>
                {isBrandOpen && (
                  <div className="px-5 pb-5">
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-3 cursor-pointer group text-sm font-medium text-slate-650 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                        <input
                          type="checkbox"
                          checked={selectedBrand === "Dekora"}
                          onChange={() => setSelectedBrand(selectedBrand === "Dekora" ? "" : "Dekora")}
                          className="w-4 h-4 rounded border-slate-350 dark:border-slate-700 text-primary dark:text-[#5f5eff] focus:ring-primary dark:focus:ring-[#5f5eff]/40 cursor-pointer accent-[#5f5eff]"
                        />
                        <span>Dekora</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Catalog Grid */}
          <main className="flex-1">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white capitalize tracking-tight">
                  {displayName}
                </h1>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">
                  {meta.total} products
                </p>
              </div>
            </div>

            {productsLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-[#131424] rounded-2xl border border-slate-100 dark:border-slate-800 p-3 space-y-3 animate-pulse">
                    <div className="w-full aspect-square bg-slate-100 dark:bg-slate-800/50 rounded-xl" />
                    <div className="h-3.5 bg-slate-100 dark:bg-slate-800/50 rounded w-3/4" />
                    <div className="h-3.5 bg-slate-100 dark:bg-slate-800/50 rounded w-1/2" />
                    <div className="h-8 bg-slate-100 dark:bg-slate-800/50 rounded-lg mt-3" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white dark:bg-[#131424] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-16 text-center flex flex-col items-center justify-center transition-colors">
                <Search className="text-slate-300 dark:text-slate-700 mb-4" size={48} />
                <p className="text-slate-500 dark:text-slate-400 font-medium">No products found matching your filters.</p>
                <button
                  onClick={handleClearFilters}
                  className="mt-6 px-6 py-2.5 bg-primary dark:bg-[#5f5eff] hover:bg-[#0369a1] dark:hover:bg-[#4d4cff] text-white rounded-2xl font-bold transition-all text-sm cursor-pointer shadow-md"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {products.map((product: any) => {
                    const discountPercent = product.productDiscount
                      ? product.discountType === "percentage"
                        ? `${product.productDiscount}%`
                        : `৳${product.productDiscount}`
                      : null;

                    const isWishlisted = wishlistProducts.some((p: any) => p._id === product._id);

                    return (
                      <div
                        key={product._id}
                        className="group flex flex-col bg-white dark:bg-[#121320] border border-slate-100 dark:border-transparent rounded-2xl overflow-hidden hover:shadow-[0_15px_30px_rgba(95,94,255,0.15)] hover:border-slate-200 dark:hover:border-slate-800/50 transition-all duration-300 relative p-3"
                      >
                        {/* Thumbnail / Image Container */}
                        <div className="w-full aspect-square bg-slate-50 dark:bg-[#09090e] rounded-xl relative overflow-hidden flex items-center justify-center p-2 mb-3">
                          <Link href={`/products/${product.slug}`} className="w-full h-full relative block">
                            <Image
                              src={product.thumbnail || "/placeholder.png"}
                              alt={product.name}
                              fill
                              sizes="(max-width: 768px) 100vw, 25vw"
                              className="object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                            />
                          </Link>

                          {/* Discount Badge */}
                          {discountPercent && (
                            <div className="absolute top-2 left-2 z-10">
                              <span className="bg-red-500 text-white dark:bg-[#00e5a3] dark:text-[#0b0c10] text-[10px] font-bold px-2 py-0.5 rounded shadow-md">
                                {product.discountType === "percentage" ? `-${product.productDiscount}%` : `৳${product.productDiscount}`}
                              </span>
                            </div>
                          )}

                          {/* Wishlist Button */}
                          <button
                            onClick={(e) => handleWishlistToggle(e, product._id, isWishlisted)}
                            disabled={isTogglingWishlist || isRemovingWishlist}
                            className="absolute top-2 right-2 z-10 p-1.5 bg-black/35 hover:bg-black/55 text-white rounded-full shadow-md transition-all active:scale-95 cursor-pointer border border-white/10"
                            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                          >
                            <Heart
                              size={14}
                              className={isWishlisted ? "fill-red-500 text-red-500" : "text-white"}
                            />
                          </button>
                        </div>

                        {/* Info Block */}
                        <div className="flex flex-col flex-1 px-1">
                          {/* Rating stars */}
                          <div className="flex items-center gap-1 text-yellow-450 dark:text-[#00e5a3]">
                            {renderStars(product.averageRating || 5)}
                            <span className="text-slate-400 dark:text-[#8a8b98] font-bold text-[10px] ml-1">
                              ({(product.averageRating || 5).toFixed(1)})
                            </span>
                          </div>

                          {/* Title */}
                          <Link href={`/products/${product.slug}`} className="mt-2 block">
                            <h3 className="font-bold text-slate-800 dark:text-white text-[14px] hover:text-primary dark:hover:text-[#5f5eff] transition-colors line-clamp-1">
                              {product.name}
                            </h3>
                          </Link>

                          {/* Price Display */}
                          <div className="mt-1 flex items-baseline gap-2 mb-3">
                            <span className="text-base font-black text-slate-900 dark:text-white">
                              ৳{getDisplayPrice(product, customerType)}
                            </span>
                            {hasDiscount(product, customerType) && (
                              <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-medium">
                                ৳{product.basePrice}
                              </span>
                            )}
                          </div>

                          {/* Full-width Add to Cart Button */}
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            className="w-full bg-[#5f5eff] hover:bg-[#4d4cff] text-white font-bold h-10 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-md text-xs"
                          >
                            <ShoppingBag size={14} /> Add to Cart
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {meta.totalPage > 1 && (
                  <div className="mt-12 flex justify-center">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-[#0b56d3] disabled:text-gray-300 disabled:hover:text-gray-300 transition-colors cursor-pointer bg-transparent border-0"
                      >
                        Previous
                      </button>
                      <span className="text-xs font-bold text-gray-500 px-2 border-l border-r border-gray-100">
                        Page {page} of {meta.totalPage}
                      </span>
                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === meta.totalPage}
                        className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-[#0b56d3] disabled:text-gray-300 disabled:hover:text-gray-300 transition-colors cursor-pointer bg-transparent border-0"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <span className="text-gray-500 font-medium">Loading catalog...</span>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
