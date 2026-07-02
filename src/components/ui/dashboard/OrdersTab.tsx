"use client";

import React, { useState } from "react";
import { Search, ShoppingBag, Eye, CreditCard } from "lucide-react";
import { useGetMyOrdersQuery } from "@/redux/features/order/orderApi";

interface OrdersTabProps {
  setSelectedOrderId: (id: string) => void;
}

type OrderStatusFilter = "all" | "pending" | "processing" | "shipped" | "delivered";

export default function OrdersTab({ setSelectedOrderId }: OrdersTabProps) {
  const { data: ordersRes, isLoading, refetch } = useGetMyOrdersQuery(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("all");

  const orders = ordersRes?.data || [];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending": return "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400";
      case "processing": return "bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400";
      case "shipped": return "bg-purple-100 text-purple-800 dark:bg-purple-950/30 dark:text-purple-400";
      case "delivered": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400";
      default: return "bg-gray-100 text-gray-850 dark:bg-gray-800 dark:text-slate-400";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400";
      case "unpaid": return "bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-450";
      default: return "bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400";
    }
  };

  // Filters logic
  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch = 
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || (order.orderStatus || order.status)?.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filterTabs: { label: string; value: OrderStatusFilter }[] = [
    { label: "All Orders", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Processing", value: "processing" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-slate-800/80 rounded animate-pulse" />
        <div className="h-12 w-full bg-gray-200 dark:bg-slate-800/60 rounded-2xl animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 w-full bg-gray-200 dark:bg-slate-800/40 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          My Order History
        </h2>
        <p className="text-gray-500 dark:text-slate-400 text-xs mt-1">
          Review, track, and generate invoices for your past and current purchases.
        </p>
      </div>

      {/* Toolbar: Search and Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#121320] border border-gray-200/80 dark:border-slate-800/60 p-4 rounded-3xl shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search by Order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 dark:bg-[#09090e] border border-gray-250 dark:border-slate-800/85 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Status Filters */}
        <div className="flex overflow-x-auto gap-1 pb-1 md:pb-0 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 text-xs font-bold whitespace-nowrap rounded-xl transition cursor-pointer ${
                statusFilter === tab.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-gray-600 dark:text-slate-455 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table/Cards */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white dark:bg-[#121320] border border-gray-200/80 dark:border-slate-800/60 rounded-3xl p-12 text-center flex flex-col items-center">
          <div className="w-14 h-14 bg-gray-100 dark:bg-slate-900 text-gray-400 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag size={24} />
          </div>
          <h3 className="font-extrabold text-gray-900 dark:text-white text-base">No Orders Found</h3>
          <p className="text-xs text-gray-500 mt-1">There are no orders matching your search or filters.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#121320] border border-gray-200/80 dark:border-slate-800/60 rounded-3xl shadow-xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-150 dark:border-slate-800/60 text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50/50 dark:bg-slate-950/20">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Delivery Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60">
                {filteredOrders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-950/10 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white text-sm">
                      #{order.orderId || order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 dark:text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-gray-900 dark:text-white text-sm">
                      ৳{order.totalAmount || order.grandTotal}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${getPaymentStatusColor(order.paymentStatus || order.payment?.status || "unpaid")}`}>
                        {order.paymentStatus || order.payment?.status || "unpaid"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(order.orderStatus || order.status)}`}>
                        {order.orderStatus || order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrderId(order._id)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary-hover px-3.5 py-1.5 rounded-xl shadow-xs transition cursor-pointer"
                      >
                        <Eye size={12} /> Track Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-100 dark:divide-slate-800/60">
            {filteredOrders.map((order: any) => (
              <div key={order._id} className="p-5 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                      #{order.orderId || order._id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-base font-black text-gray-900 dark:text-white">
                    ৳{order.totalAmount || order.grandTotal}
                  </span>
                </div>

                <div className="flex gap-2">
                  <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getPaymentStatusColor(order.paymentStatus || order.payment?.status || "unpaid")}`}>
                    Payment: {order.paymentStatus || order.payment?.status || "unpaid"}
                  </span>
                  <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getStatusColor(order.orderStatus || order.status)}`}>
                    Status: {order.orderStatus || order.status}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedOrderId(order._id)}
                  className="w-full flex items-center justify-center gap-1.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary-hover py-2.5 rounded-xl transition cursor-pointer"
                >
                  <Eye size={14} /> Track & Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
