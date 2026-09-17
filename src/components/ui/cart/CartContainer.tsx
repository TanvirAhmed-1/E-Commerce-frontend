"use client";

import React from "react";
import Link from "next/link";
import {
  useGetMyCartQuery,
  useUpdateQuantityMutation,
  useRemoveItemMutation,
} from "@/redux/features/cart/cartApi";
import CartItemList from "./CartItemList";
import CartOrderSummary from "./CartOrderSummary";
import toast from "react-hot-toast";

interface CartContainerProps {
  initialCart?: any;
  recommended?: any[];
  token?: string;
}

export const CartContainer: React.FC<CartContainerProps> = ({ token }) => {
  const { data: dbCartResponse, refetch: refetchCart } = useGetMyCartQuery(undefined, { skip: !token });
  const [updateQuantityApi] = useUpdateQuantityMutation();
  const [removeItemApi] = useRemoveItemMutation();

  const cart = dbCartResponse?.data;
  const items = cart?.items || [];
  const totalAmount = cart?.totalAmount || 0;
  const deliveryCharge = 80;
  const discount = Math.round(totalAmount * 0.1); // estimated savings
  const grandTotal = Math.max(0, totalAmount - discount + deliveryCharge);

  const handleQuantityChange = async (itemId: string, newQty: number) => {
    const item = items.find((i: any) => i._id === itemId);
    if (!item) return;

    try {
      await updateQuantityApi({
        product: item.product?._id || item.product,
        variant: item.variant?._id || item.variant,
        quantity: newQty,
      }).unwrap();
      refetchCart();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update quantity.");
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    const item = items.find((i: any) => i._id === itemId);
    if (!item) return;

    try {
      const variantId = item.variant?._id || item.variant || item.product?._id || item.product;
      await removeItemApi(variantId).unwrap();
      toast.success("Item removed from cart");
      refetchCart();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to remove item.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 text-center">
        <div className="bg-white dark:bg-[#121320] max-w-md mx-auto p-8 rounded-2xl border border-slate-200/70 dark:border-slate-800 shadow-xs flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#f2f3ff] dark:bg-[#09090e] text-[#003820] dark:text-[#95d4ac] flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">shopping_cart</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500">Explore authentic kitchenware and home essentials today.</p>
          <Link
            href="/products"
            className="bg-[#003820] hover:bg-[#0f5132] text-white px-6 py-2.5 rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Cart Page ({items.length} {items.length === 1 ? "item" : "items"})
          </h1>
          <Link href="/products" className="text-xs font-bold text-[#003820] dark:text-[#95d4ac] hover:underline">
            + Add More Items
          </Link>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8">
            <CartItemList
              items={items}
              onQuantityChange={handleQuantityChange}
              onRemoveItem={handleRemoveItem}
            />
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 sticky top-24">
            <CartOrderSummary
              subtotal={totalAmount}
              discount={discount}
              deliveryCharge={deliveryCharge}
              total={grandTotal}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartContainer;
