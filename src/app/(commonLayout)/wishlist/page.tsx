"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useGetWishListQuery, useRemoveFromWishListMutation } from "@/redux/features/wishList/wishListApi";
import { useAddToCartMutation } from "@/redux/features/cart/cartApi";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Trash2, Heart, Loader, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { renderStars } from "@/utils/renderStars";
import { getDisplayPrice, hasDiscount } from "@/utils/priceHelper";

function WishlistContent() {
  const { token, customerType } = useSelector((state: RootState) => state.auth);

  const { data: wishlistResponse, isLoading, refetch } = useGetWishListQuery(undefined, { skip: !token });
  const [removeFromWishlist, { isLoading: isRemoving }] = useRemoveFromWishListMutation();
  const [addToCartApi] = useAddToCartMutation();

  const wishlistDoc = wishlistResponse?.data;
  const products = wishlistDoc?.products || [];

  const handleRemove = async (productId: string, name: string) => {
    try {
      await removeFromWishlist(productId).unwrap();
      toast.success(`${name} removed from wishlist.`);
      refetch();
    } catch (err: any) {
      toast.error("Failed to remove item.");
    }
  };

  const handleAddToCart = async (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();

    const defaultVariant = product.productVariants?.[0];
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

  if (!token) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 flex flex-col items-center justify-center px-4">
        <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center flex flex-col items-center max-w-md w-full">
          <div className="w-20 h-20 bg-slate-50 text-gray-400 rounded-full flex items-center justify-center mb-6">
            <Heart size={40} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Your Wishlist</h2>
          <p className="text-gray-500 mt-2 text-sm">Please log in to view and manage your wishlist.</p>
          <Button asChild className="mt-8 w-full bg-slate-900 hover:bg-primary text-white h-12 rounded-2xl cursor-pointer">
            <Link href="/login?redirect=/wishlist">Log In / Sign Up</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-primary" size={36} />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 flex flex-col items-center justify-center px-4">
        <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm text-center flex flex-col items-center max-w-md w-full">
          <div className="w-20 h-20 bg-slate-50 text-gray-400 rounded-full flex items-center justify-center mb-6">
            <Heart size={40} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Your Wishlist is Empty</h2>
          <p className="text-gray-500 mt-2 text-sm">Browse products and tap the heart icon to save items here.</p>
          <Button asChild className="mt-8 w-full bg-slate-900 hover:bg-primary text-white h-12 rounded-2xl cursor-pointer">
            <Link href="/products">Browse Catalog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container lg:max-w-[1400px] mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
          My Wishlist
        </h1>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {products.map((product: any) => (
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
                      className="object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </Link>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(product._id, product.name)}
                    className="absolute top-2 right-2 z-10 p-1.5 bg-black/35 hover:bg-black/55 text-white rounded-full shadow-md transition-all cursor-pointer border border-white/10"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={14} />
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  return (
    <React.Suspense fallback={
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-primary" size={36} />
      </div>
    }>
      <WishlistContent />
    </React.Suspense>
  );
}
