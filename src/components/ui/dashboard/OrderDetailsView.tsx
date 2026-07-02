"use client";

import React, { useState } from "react";
import { ArrowLeft, MapPin, CreditCard, Calendar, Truck, FileText, CheckCircle } from "lucide-react";
import { useGetOrderByIdQuery } from "@/redux/features/order/orderApi";
import InvoiceModal from "./InvoiceModal";
import Image from "next/image";

interface OrderDetailsViewProps {
  orderId: string;
  onBack: () => void;
}

export default function OrderDetailsView({ orderId, onBack }: OrderDetailsViewProps) {
  const { data: orderRes, isLoading } = useGetOrderByIdQuery(orderId);
  const [showInvoice, setShowInvoice] = useState(false);

  const order = orderRes?.data;

  // Tracker steps
  const steps = ["pending", "processing", "shipped", "delivered"];
  const currentStatus = (order?.orderStatus || order?.status)?.toLowerCase() || "pending";
  const activeIndex = steps.indexOf(currentStatus);

  const getStepIcon = (index: number) => {
    switch (index) {
      case 0: return Calendar;
      case 1: return CheckCircle;
      case 2: return Truck;
      case 3: return CheckCircle;
      default: return CheckCircle;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-gray-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-6 w-32 bg-gray-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>
        <div className="h-32 w-full bg-gray-200 dark:bg-slate-800/60 rounded-3xl animate-pulse" />
        <div className="h-64 w-full bg-gray-200 dark:bg-slate-800/60 rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-slate-455 font-bold">Failed to load order details.</p>
        <button onClick={onBack} className="mt-4 text-xs font-bold text-primary hover:underline flex items-center gap-1 mx-auto cursor-pointer">
          <ArrowLeft size={14} /> Back to Orders
        </button>
      </div>
    );
  }

  // Calculate totals
  const totalAmount = order.totalAmount || order.grandTotal || 0;
  const vat = Math.round(totalAmount * 0.05); // 5% VAT
  const shipping = totalAmount > 1000 ? 0 : 60;
  const grandTotal = totalAmount + vat + shipping;

  return (
    <div className="space-y-6 relative">
      {/* Header with Back button & Invoice print trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Orders
        </button>
        <button
          onClick={() => setShowInvoice(true)}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-[#151522] text-white hover:bg-[#1f1f33] border border-slate-800 px-4 py-2 rounded-xl transition cursor-pointer"
        >
          <FileText size={14} /> Print Invoice
        </button>
      </div>

      {/* Overview Ribbon */}
      <div className="bg-white dark:bg-[#121320] border border-gray-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <span className="text-[10px] font-black tracking-wider text-primary uppercase bg-primary/10 px-2 py-0.5 rounded">
            Order Verification
          </span>
          <h3 className="text-lg font-black text-gray-900 dark:text-white mt-1.5">
            ID: #{order.orderId || order._id.slice(-8).toUpperCase()}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-700 dark:text-slate-300">
          <div className="bg-gray-50 dark:bg-[#09090e] border border-gray-150 dark:border-slate-800/85 p-3 rounded-2xl">
            <span className="text-[9px] text-gray-455 uppercase block">Payment Status</span>
            <span className="text-sm font-extrabold capitalize text-emerald-600 dark:text-[#00e5a3] mt-0.5 block">
              {order.paymentStatus || order.payment?.status || "unpaid"}
            </span>
          </div>
          <div className="bg-gray-50 dark:bg-[#09090e] border border-gray-150 dark:border-slate-800/85 p-3 rounded-2xl">
            <span className="text-[9px] text-gray-455 uppercase block">Payment Method</span>
            <span className="text-sm font-extrabold capitalize mt-0.5 block">
              {order.paymentMethod || order.payment?.method || "COD"}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Tracking Stepper */}
      <div className="bg-white dark:bg-[#121320] border border-gray-200/80 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-xs">
        <h4 className="font-extrabold text-gray-900 dark:text-white text-sm mb-8">
          Shipping Protocol Tracker
        </h4>
        <div className="relative flex flex-col md:flex-row justify-between gap-6 md:items-center">
          {/* Connecting line */}
          <div className="absolute top-[18px] left-[18px] bottom-6 md:bottom-auto md:left-6 md:right-6 md:h-1 bg-gray-200 dark:bg-slate-800 -z-10 flex md:block flex-col justify-between" style={{ zIndex: 1 }}>
            <div 
              className="bg-primary h-full md:h-full md:w-full transition-all duration-500" 
              style={{
                width: typeof window !== "undefined" && window.innerWidth >= 768 ? `${(activeIndex / (steps.length - 1)) * 100}%` : "4px",
                height: typeof window !== "undefined" && window.innerWidth < 768 ? `${(activeIndex / (steps.length - 1)) * 100}%` : "auto"
              }}
            />
          </div>

          {steps.map((step, idx) => {
            const Icon = getStepIcon(idx);
            const isCompleted = idx <= activeIndex;
            const isActive = idx === activeIndex;

            return (
              <div key={step} className="flex md:flex-col items-center gap-4 md:text-center relative" style={{ zIndex: 2 }}>
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 ${
                    isActive 
                      ? "bg-primary border-primary text-primary-foreground scale-110 shadow-lg shadow-primary/20"
                      : isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-white dark:bg-[#09090e] border-gray-200 dark:border-slate-800 text-gray-400 dark:text-slate-600"
                  }`}
                >
                  <Icon size={14} />
                </div>
                <div className="md:mt-2.5">
                  <h5 className={`text-xs font-bold capitalize ${isActive ? "text-primary font-black" : isCompleted ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-slate-600"}`}>
                    {step}
                  </h5>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5 hidden md:block">
                    {isActive ? "Current Stage" : isCompleted ? "Completed" : "Scheduled"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Items Breakdown & Shipping details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Purchased Items List */}
        <div className="lg:col-span-2 bg-white dark:bg-[#121320] border border-gray-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-xs">
          <h4 className="font-extrabold text-gray-900 dark:text-white text-sm mb-4 border-b border-gray-100 dark:border-slate-800/60 pb-3">
            Item Manifest
          </h4>
          <div className="divide-y divide-gray-100 dark:divide-slate-800/60">
            {order.items?.map((item: any, idx: number) => (
              <div key={idx} className="py-4 flex gap-4 items-center justify-between first:pt-0 last:pb-0">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative w-12 h-12 bg-gray-50 dark:bg-[#09090e] rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800 shrink-0 flex items-center justify-center p-1">
                    <Image
                      src={item.product?.thumbnail || "/placeholder.png"}
                      alt={item.product?.name || "Product"}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-bold text-gray-900 dark:text-white text-xs truncate">
                      {item.product?.name || "Premium Gear"}
                    </h5>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      QTY: {item.quantity} × ৳{item.price}
                    </p>
                  </div>
                </div>
                <span className="font-extrabold text-gray-900 dark:text-white text-xs">
                  ৳{item.totalPrice || (item.quantity * item.price)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping details & Totals */}
        <div className="flex flex-col gap-6">
          {/* Shipping details */}
          <div className="bg-white dark:bg-[#121320] border border-gray-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-xs">
            <h4 className="font-extrabold text-gray-900 dark:text-white text-sm mb-4 border-b border-gray-100 dark:border-slate-800/60 pb-3">
              Delivery Protocol Address
            </h4>
            <div className="text-xs text-gray-700 dark:text-slate-350 space-y-2">
              <p className="font-bold text-gray-900 dark:text-white">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.phone}</p>
              <p className="pt-2 border-t border-gray-100 dark:border-slate-800/60 mt-2 leading-relaxed">
                {order.shippingAddress?.address}, {order.shippingAddress?.city}
              </p>
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="bg-white dark:bg-[#121320] border border-gray-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-xs space-y-3">
            <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400 font-medium">
              <span>Subtotal</span>
              <span className="text-gray-900 dark:text-white font-bold">৳{totalAmount}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400 font-medium">
              <span>Shipping Fee</span>
              <span className="text-emerald-600 dark:text-[#00e5a3] font-bold">
                {shipping === 0 ? "FREE" : `৳${shipping}`}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400 font-medium">
              <span>Estimated Tax (5%)</span>
              <span className="text-gray-900 dark:text-white font-bold">৳{vat}</span>
            </div>
            <div className="pt-3 border-t border-gray-150 dark:border-slate-800/60 flex justify-between items-end">
              <span className="text-xs font-bold uppercase text-gray-405 dark:text-slate-500">Grand Total</span>
              <span className="text-xl font-black text-gray-900 dark:text-white">৳{grandTotal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice modal renderer */}
      {showInvoice && (
        <InvoiceModal
          order={order}
          vat={vat}
          shipping={shipping}
          grandTotal={grandTotal}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </div>
  );
}
