"use client";

import HomeCarousel from "@/components/ui/home/Carousel";
import { useGetAllProductsQuery } from "@/redux/features/product/productApi";
import { useGetMenuCategoryQuery } from "@/redux/features/home/homeApi";
import { useGetWishListQuery, useToggleWishListMutation, useRemoveFromWishListMutation } from "@/redux/features/wishList/wishListApi";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAddToCartMutation } from "@/redux/features/cart/cartApi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { renderStars } from "@/utils/renderStars";
import { getDisplayPrice, hasDiscount } from "@/utils/priceHelper";
import { ShoppingBag, ArrowRight, ShieldCheck, Truck, RefreshCw, Flame, Heart, MessageSquare } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const { token, customerType } = useSelector((state: RootState) => state.auth);
  const [addToCartApi] = useAddToCartMutation();

  const { data: productsData, isLoading: productsLoading } = useGetAllProductsQuery(undefined);
  const { data: categoriesData, isLoading: categoriesLoading } = useGetMenuCategoryQuery(undefined);
  const { data: wishlistResponse, refetch: refetchWishlist } = useGetWishListQuery(undefined, { skip: !token });
  const [toggleWishList, { isLoading: isTogglingWishlist }] = useToggleWishListMutation();
  const [removeFromWishlist, { isLoading: isRemovingWishlist }] = useRemoveFromWishListMutation();

  const [activeTab, setActiveTab] = useState<"recommended" | "category" | "topselling">("recommended");

  const products = productsData?.data?.data || [];
  const categories = categoriesData?.data || [];
  const wishlistProducts = wishlistResponse?.data?.products || [];

  // Filter products by badges
  const recommendedProducts = products.filter((p: any) => p.isRecommended).slice(0, 8);
  const categoryProducts = products.filter((p: any) => p.isCategoryProduct).slice(0, 8);
  const topSellingProducts = products.filter((p: any) => p.isTopSelling).slice(0, 20);

  const displayProducts = (() => {
    if (activeTab === "category") return categoryProducts.length > 0 ? categoryProducts : products.slice(0, 8);
    if (activeTab === "topselling") return topSellingProducts.length > 0 ? topSellingProducts : products.slice(0, 20);
    return recommendedProducts.length > 0 ? recommendedProducts : products.slice(0, 8);
  })();

  const handleAddToCart = async (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      toast.error("Please log in to add items to your cart.");
      router.push("/login");
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
      router.push("/login");
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

  const handleChatWithUs = (e: React.MouseEvent, productName: string) => {
    e.preventDefault();
    e.stopPropagation();
    const message = encodeURIComponent(`Hi, I am interested in "${productName}". Can I get more details?`);
    window.open(`https://wa.me/8801700000000?text=${message}`, "_blank");
  };

  return (
    <div className="w-full pb-16 bg-slate-50 dark:bg-[#0B0B14] transition-colors duration-300">
      {/* Hero Carousel */}
      <div className="px-4 container lg:max-w-[1400px] mx-auto pt-4">
        <HomeCarousel />
      </div>

      {/* Feature Badges */}
      <div className="container lg:max-w-[1400px] mx-auto px-4 mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex items-center gap-4 p-6 bg-white dark:bg-[#131424] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="p-3 bg-purple-100 dark:bg-purple-950/40 text-purple-650 dark:text-purple-400 rounded-xl">
            <Truck size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Free Delivery</h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">On orders above ৳1000</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-6 bg-white dark:bg-[#131424] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="p-3 bg-blue-100 dark:bg-blue-950/40 text-blue-655 dark:text-blue-400 rounded-xl">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Secure Payment</h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">100% protected checkout</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-6 bg-white dark:bg-[#131424] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="p-3 bg-red-100 dark:bg-red-950/40 text-red-650 dark:text-red-400 rounded-xl">
            <Flame size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Hot Deals</h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Top-tier product discounts</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-6 bg-white dark:bg-[#131424] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="p-3 bg-green-100 dark:bg-green-950/40 text-green-650 dark:text-green-400 rounded-xl">
            <RefreshCw size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Easy Returns</h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">7 days return window</p>
          </div>
        </div>
      </div>

      {/* Category List */}
      <div className="container lg:max-w-[1400px] mx-auto px-4 mt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Shop by Category</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Explore our range of premium products</p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-primary dark:text-[#5f5eff] hover:underline flex items-center gap-1">
            See All <ArrowRight size={16} />
          </Link>
        </div>

        {categoriesLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-100 dark:bg-[#131424] animate-pulse rounded-2xl border border-slate-100 dark:border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.slice(0, 6).map((cat: any) => (
              <Link
                key={cat._id}
                href={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center p-6 bg-white dark:bg-[#131424] border border-slate-100 dark:border-slate-800 rounded-2xl hover:shadow-[0_12px_30px_rgba(95,94,255,0.08)] hover:border-slate-200 dark:hover:border-[#5f5eff]/30 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-[#0B0B14] flex items-center justify-center text-lg font-bold text-slate-700 dark:text-slate-300 uppercase group-hover:bg-primary/10 dark:group-hover:bg-[#5f5eff]/10 group-hover:text-primary dark:group-hover:text-[#5f5eff] transition-all duration-300">
                  {cat.name.slice(0, 2)}
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-4 group-hover:text-primary dark:group-hover:text-[#5f5eff] transition-colors text-center truncate w-full">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Products Tab Grid */}
      <div className="container lg:max-w-[1400px] mx-auto px-4 mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Discover Products</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Handpicked curated collections for your needs</p>
          </div>
          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
            <button
              onClick={() => setActiveTab("recommended")}
              className={`pb-3 text-sm font-bold transition-all relative ${
                activeTab === "recommended" ? "text-primary dark:text-[#5f5eff] border-b-2 border-primary dark:border-[#5f5eff]" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              Recommended
            </button>
            <button
              onClick={() => setActiveTab("category")}
              className={`pb-3 text-sm font-bold transition-all relative ${
                activeTab === "category" ? "text-primary dark:text-[#5f5eff] border-b-2 border-primary dark:border-[#5f5eff]" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              Category Products
            </button>
            <button
              onClick={() => setActiveTab("topselling")}
              className={`pb-3 text-sm font-bold transition-all relative ${
                activeTab === "topselling" ? "text-primary dark:text-[#5f5eff] border-b-2 border-primary dark:border-[#5f5eff]" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              Top Selling
            </button>
          </div>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-[#131424] rounded-2xl border border-slate-100 dark:border-slate-800 p-3 space-y-3 animate-pulse">
                <div className="w-full aspect-square bg-slate-100 dark:bg-slate-800/50 rounded-xl" />
                <div className="h-3.5 bg-slate-100 dark:bg-slate-800/50 rounded w-3/4" />
                <div className="h-3.5 bg-slate-100 dark:bg-slate-800/50 rounded w-1/2" />
                <div className="h-8 bg-slate-100 dark:bg-slate-800/50 rounded-lg mt-3" />
              </div>
            ))}
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
            <p className="text-slate-500 dark:text-slate-400">No products found in this section.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {displayProducts.map((product: any) => {
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
        )}
      </div>
    </div>
  );
}
