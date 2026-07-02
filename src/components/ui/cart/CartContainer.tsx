"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Loader2 } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import {
  useGetMyCartQuery,
  useUpdateQuantityMutation,
  useRemoveItemMutation,
  useClearCartMutation,
  useAddToCartMutation,
} from "@/redux/features/cart/cartApi";
import toast from "react-hot-toast";
import CartItemRow from "./CartItemRow";
import OrderManifest from "./OrderManifest";
import UpgradeCard from "./UpgradeCard";

interface CartContainerProps {
  initialCart: any;
  recommended: any[];
  token?: string;
}

export default function CartContainer({ initialCart, recommended, token }: CartContainerProps) {
  const { customerType } = useAppSelector((state) => state.auth);

  // Client-side query that syncs with mutations and cache invalidation
  const { data: cartResponse, refetch } = useGetMyCartQuery(undefined, { skip: !token });
  const [updateQuantityApi] = useUpdateQuantityMutation();
  const [removeItemApi] = useRemoveItemMutation();
  const [clearCartApi] = useClearCartMutation();
  const [addToCartApi] = useAddToCartMutation();

  const cart = cartResponse?.data || initialCart;
  const items = cart?.items || [];
  const totalAmount = cart?.totalAmount || 0;

  const handleQtyChange = async (item: any, change: number) => {
    const action = change > 0 ? "increment" : "decrement";
    try {
      await updateQuantityApi({ variantId: item.variant?._id, action }).unwrap();
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update quantity.");
    }
  };

  const handleRemoveItem = async (variantId: string, name: string) => {
    try {
      await removeItemApi(variantId).unwrap();
      refetch();
      toast.success(`${name} removed from cart.`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to remove item.");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCartApi(undefined).unwrap();
      refetch();
      toast.success("Cart cleared.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to clear cart.");
    }
  };

  const handleAddToCartDirect = async (product: any) => {
    const defaultVariant = product.productVariants?.[0];
    const variantId = defaultVariant?._id || product._id;
    try {
      await addToCartApi({
        product: product._id,
        variant: variantId,
        quantity: 1,
      }).unwrap();
      refetch();
      toast.success(`${product.name} added to cart!`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add to cart.");
    }
  };

  // VAT and shipping calculation
  const vat = Math.round(totalAmount * 0.05); // 5% VAT
  const shipping = totalAmount > 1000 || totalAmount === 0 ? 0 : 60; // Free shipping over 1000
  const grandTotal = totalAmount + vat + shipping;

  if (items.length === 0) {
    return (
      <div className="bg-[#0B0B14] min-h-screen py-16 flex flex-col items-center justify-center px-4">
        <div className="bg-[#121320] p-12 rounded-3xl border border-slate-800 shadow-xl text-center flex flex-col items-center max-w-md w-full">
          <div className="w-20 h-20 bg-[#09090e] text-slate-500 rounded-full flex items-center justify-center mb-6 border border-slate-800">
            <ShoppingCart size={40} />
          </div>
          <h2 className="text-xl font-bold text-white">Your Cart is Empty</h2>
          <p className="text-slate-400 mt-2 text-sm">Looks like you haven&apos;t added anything to your cart yet.</p>
          <Link
            href="/products"
            className="mt-8 w-full bg-[#5f5eff] hover:bg-[#4d4cff] text-white h-12 rounded-2xl flex items-center justify-center font-bold transition-all text-sm cursor-pointer"
          >
            Shop Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0B14] text-white min-h-screen py-12 transition-colors duration-300">
      <div className="container lg:max-w-[1400px] mx-auto px-4">
        {/* Title Block */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Your Command Center
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Review your high-performance gear before deployment.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="flex-1">
            <div className="bg-[#121320] rounded-3xl border border-slate-800/60 p-6 md:p-8 shadow-xl">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-slate-800/80 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                <div className="col-span-6">Product Information</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>

              {/* Items List */}
              <div className="flex flex-col">
                {items.map((item: any) => (
                  <CartItemRow
                    key={item._id}
                    item={item}
                    onQtyChange={handleQtyChange}
                    onRemoveItem={handleRemoveItem}
                  />
                ))}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-between mt-6 px-1">
              <Link
                href="/products"
                className="text-xs font-bold text-slate-400 hover:text-[#5f5eff] transition-colors flex items-center gap-2 group"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Continue Exploring
              </Link>
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500 font-medium">{items.length} Items in Cart</span>
                <button
                  onClick={handleClearCart}
                  className="text-xs font-bold text-red-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  Clear Command
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - Order Manifest */}
          <aside className="w-full lg:w-96 shrink-0">
            <OrderManifest
              totalAmount={totalAmount}
              vat={vat}
              shipping={shipping}
              grandTotal={grandTotal}
            />
          </aside>
        </div>

        {/* Recommended Upgrades */}
        {recommended.length > 0 && (
          <div className="mt-20">
            <h2 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">
              Recommended Upgrades
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommended.map((prod: any) => (
                <UpgradeCard
                  key={prod._id}
                  product={prod}
                  customerType={customerType}
                  onAddToCartDirect={handleAddToCartDirect}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
