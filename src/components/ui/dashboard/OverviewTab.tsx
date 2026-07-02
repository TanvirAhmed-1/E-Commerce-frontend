"use client";

import React from "react";
import { ShoppingBag, Heart, ShoppingCart, MapPin, ArrowRight } from "lucide-react";
import { useGetMyOrdersQuery } from "@/redux/features/order/orderApi";
import { useGetWishListQuery } from "@/redux/features/wishList/wishListApi";
import { useGetMyAddressesQuery } from "@/redux/features/address/addressApi";
import { useGetMyCartQuery } from "@/redux/features/cart/cartApi";

interface OverviewTabProps {
  user: { name: string | null; email: string | null };
  setActiveTab: (tab: string) => void;
  setSelectedOrderId: (id: string) => void;
}

export default function OverviewTab({ user, setActiveTab, setSelectedOrderId }: OverviewTabProps) {
  const { data: ordersRes, isLoading: ordersLoading } = useGetMyOrdersQuery(undefined);
  const { data: wishlistRes, isLoading: wishlistLoading } = useGetWishListQuery(undefined);
  const { data: addressesRes, isLoading: addressLoading } = useGetMyAddressesQuery(undefined);
  const { data: cartRes, isLoading: cartLoading } = useGetMyCartQuery(undefined);

  const orders = ordersRes?.data || [];
  const wishlist = wishlistRes?.data?.products || [];
  const addresses = addressesRes?.data || [];
  const cart = cartRes?.data || { items: [] };

  const recentOrders = [...orders].slice(0, 3);
  const defaultAddress = addresses.find((addr: any) => addr.isDefault) || addresses[0];

  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 dark:bg-blue-500/20",
      tab: "orders",
    },
    {
      label: "Wishlist Items",
      value: wishlist.length,
      icon: Heart,
      color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 dark:bg-rose-500/20",
      tab: "wishlist",
    },
    {
      label: "Items in Cart",
      value: cart.items?.length || 0,
      icon: ShoppingCart,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 dark:bg-amber-500/20",
      href: "/cart",
    },
    {
      label: "Addresses Saved",
      value: addresses.length,
      icon: MapPin,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/20",
      tab: "addresses",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400";
      case "processing": return "bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400";
      case "shipped": return "bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-400";
      case "delivered": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400";
      default: return "bg-gray-100 text-gray-850 dark:bg-gray-800 dark:text-slate-400";
    }
  };

  const handleTrackOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setActiveTab("orders");
  };

  const isLoading = ordersLoading || wishlistLoading || addressLoading || cartLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-slate-800/80 rounded animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-gray-200 dark:bg-slate-800/60 rounded-3xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-gray-200 dark:bg-slate-800/60 rounded-3xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          Welcome back, {user.name?.split(" ")[0] || "User"}!
        </h2>
        <p className="text-gray-500 dark:text-slate-400 text-xs mt-1">
          Here is a quick summary of your account activity, tracking updates, and preferences.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              onClick={() => stat.tab ? setActiveTab(stat.tab) : null}
              className={`bg-white dark:bg-[#121320] border border-gray-200/80 dark:border-slate-800/60 p-5 rounded-3xl shadow-xs flex flex-col justify-between transition-all duration-300 hover:shadow-md cursor-pointer group`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-gray-500 dark:text-slate-400 leading-none">
                  {stat.label}
                </span>
                <div className={`p-2.5 rounded-2xl ${stat.color} transition-transform group-hover:scale-110`}>
                  <Icon size={16} />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                  {stat.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Recent Orders & Saved Address Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Panel */}
        <div className="lg:col-span-2 bg-white dark:bg-[#121320] border border-gray-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-gray-900 dark:text-white text-base">
                Recent Orders
              </h3>
              {orders.length > 0 && (
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  View All <ArrowRight size={12} />
                </button>
              )}
            </div>

            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-12 h-12 bg-gray-100 dark:bg-slate-900 text-gray-400 rounded-full flex items-center justify-center mb-3">
                  <ShoppingBag size={20} />
                </div>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">No Orders Placed Yet</p>
                <p className="text-xs text-gray-500 mt-1">Products you purchase will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-slate-800/60">
                {recentOrders.map((order: any) => (
                  <div key={order._id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        ID: #{order.orderId || order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Ordered on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-black text-gray-900 dark:text-white">
                          ৳{order.totalAmount || order.grandTotal}
                        </p>
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${getStatusColor(order.orderStatus || order.status)}`}>
                          {order.orderStatus || order.status}
                        </span>
                      </div>
                      <button
                        onClick={() => handleTrackOrder(order._id)}
                        className="text-xs font-extrabold text-primary hover:bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl transition cursor-pointer"
                      >
                        Track
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Default Shipping Address Panel */}
        <div className="bg-white dark:bg-[#121320] border border-gray-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-gray-900 dark:text-white text-base">
                Primary Address
              </h3>
              <button
                onClick={() => setActiveTab("addresses")}
                className="text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                Manage
              </button>
            </div>

            {defaultAddress ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 px-2.5 py-1 rounded-full w-fit">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                  Default Address
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                    {defaultAddress.fullName}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">{defaultAddress.phone}</p>
                </div>
                <div className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed border-t border-gray-100 dark:border-slate-800/60 pt-4">
                  <p>{defaultAddress.address}</p>
                  <p className="mt-1">
                    {defaultAddress.upazila}, {defaultAddress.district}
                  </p>
                  <p className="mt-1">{defaultAddress.division}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-12 h-12 bg-gray-100 dark:bg-slate-900 text-gray-400 rounded-full flex items-center justify-center mb-3">
                  <MapPin size={20} />
                </div>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">No Address Saved</p>
                <p className="text-xs text-gray-500 mt-1">Please add a shipping address to checkout quickly.</p>
                <button
                  onClick={() => setActiveTab("addresses")}
                  className="mt-4 text-xs font-extrabold bg-primary text-white px-4 py-2 rounded-xl transition shadow-xs hover:bg-primary-hover cursor-pointer"
                >
                  Add Address
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
