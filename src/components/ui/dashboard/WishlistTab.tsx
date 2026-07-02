"use client";

import React from "react";
import { Heart, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { 
  useGetWishListQuery, 
  useRemoveFromWishListMutation 
} from "@/redux/features/wishList/wishListApi";
import { useAddToCartMutation } from "@/redux/features/cart/cartApi";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

export default function WishlistTab() {
  const { data: wishlistRes, isLoading, refetch } = useGetWishListQuery(undefined);
  const [removeFromWishList, { isLoading: isRemoving }] = useRemoveFromWishListMutation();
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  const items = wishlistRes?.data?.products || [];

  const handleRemove = async (productId: string, productName: string) => {
    try {
      await removeFromWishList(productId).unwrap();
      toast.success(`${productName} removed from wishlist`);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to remove item");
    }
  };

  const handleAddToCart = async (product: any) => {
    const defaultVariant = product.productVariants?.[0];
    const variantId = defaultVariant?._id || product._id;
    try {
      await addToCart({
        product: product._id,
        variant: variantId,
        quantity: 1,
      }).unwrap();
      toast.success(`${product.name} added to cart!`);
      
      // Auto-remove from wishlist once added to cart
      await removeFromWishList(product._id).unwrap();
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add to cart");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-slate-800/80 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 bg-gray-200 dark:bg-slate-800/60 rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          My Wishlist
        </h2>
        <p className="text-gray-500 dark:text-slate-400 text-xs mt-1">
          Review your bookmarks, add items to your cart, or remove things you no longer need.
        </p>
      </div>

      {/* Grid of items */}
      {items.length === 0 ? (
        <div className="bg-white dark:bg-[#121320] border border-gray-200/80 dark:border-slate-800/60 rounded-3xl p-12 text-center flex flex-col items-center">
          <div className="w-14 h-14 bg-gray-100 dark:bg-slate-900 text-gray-400 rounded-full flex items-center justify-center mb-4">
            <Heart size={24} />
          </div>
          <h3 className="font-extrabold text-gray-900 dark:text-white text-base">Your Wishlist is Empty</h3>
          <p className="text-xs text-gray-500 mt-1">Explore our catalogues and bookmark your favorite gears.</p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary-hover px-5 py-2.5 rounded-xl shadow-md transition cursor-pointer"
          >
            Go Shopping <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item: any) => {
            const product = item.product || item;
            if (!product) return null;

            return (
              <div
                key={product._id}
                className="bg-white dark:bg-[#121320] border border-gray-200/80 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition duration-300 flex flex-col justify-between group"
              >
                {/* Product Thumbnail Container */}
                <div className="relative aspect-square bg-gray-50 dark:bg-[#09090e] border-b border-gray-150 dark:border-slate-800/60 flex items-center justify-center p-6">
                  <Image
                    src={product.thumbnail || "/placeholder.png"}
                    alt={product.name || "Product image"}
                    fill
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={() => handleRemove(product._id, product.name)}
                    className="absolute top-4 right-4 p-2 bg-white dark:bg-slate-900/80 hover:bg-red-50 dark:hover:bg-red-950/20 text-gray-400 hover:text-red-500 rounded-xl border border-gray-100 dark:border-slate-800/80 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-xs"
                    title="Remove from Wishlist"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Info and Actions */}
                <div className="p-5 space-y-4">
                  <div>
                    <Link
                      href={`/products/${product.slug}`}
                      className="font-bold text-gray-900 dark:text-white hover:text-primary text-sm leading-snug block line-clamp-1 transition-colors"
                    >
                      {product.name}
                    </Link>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-black text-gray-900 dark:text-white">
                        ৳{product.price}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={isAddingToCart}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary-hover py-2.5 rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer"
                    >
                      <ShoppingCart size={13} /> Buy Now
                    </button>
                    <button
                      onClick={() => handleRemove(product._id, product.name)}
                      className="sm:hidden p-2 text-gray-400 hover:text-red-500 border border-gray-200 dark:border-slate-800 rounded-xl transition cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
