"use client";

import React, { useRef } from "react";
import Link from "next/link";
import {
  Printer,
  ShoppingBag,
  RotateCcw,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import InvoiceItemsTable from "./InvoiceItemsTable";
import InvoiceCustomerInfo from "./InvoiceCustomerInfo";
import InvoiceSummary from "./InvoiceSummary";

interface OrderSuccessViewProps {
  orderData: any;
}

export const OrderSuccessView: React.FC<OrderSuccessViewProps> = ({ orderData }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const orderNumber = orderData?.orderNumber || "ORD-" + Math.floor(100000 + Math.random() * 900000);
  const orderDate = orderData?.createdAt
    ? new Date(orderData.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  const orderTime = orderData?.createdAt
    ? new Date(orderData.createdAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

  const shippingAddr = orderData?.shippingAddress || {};
  const customerName = shippingAddr.fullName || orderData?.user?.name || "Valued Customer";
  const customerPhone = shippingAddr.phone || orderData?.user?.phone || "N/A";
  const customerEmail = shippingAddr.email || orderData?.user?.email || "";
  const fullAddress = [
    shippingAddr.address,
    shippingAddr.upazila,
    shippingAddr.district,
    shippingAddr.division,
  ]
    .filter(Boolean)
    .join(", ");

  const items = orderData?.items || [];
  const subtotal = Number(orderData?.subtotal || orderData?.totalAmount || 0);
  const deliveryCharge = Number(orderData?.deliveryCharge || 0);
  const discount = Number(orderData?.discount || 0);
  const vat = Number(orderData?.vat || 0);
  const grandTotal = Number(orderData?.totalAmount || subtotal + deliveryCharge - discount + vat);

  const paymentMethod = orderData?.payment?.method || orderData?.paymentMethod || "cod";
  const paymentStatus = orderData?.payment?.status || (paymentMethod === "cod" ? "pending" : "paid");
  const transactionId = orderData?.payment?.transactionId || orderData?.transactionId;

  const paymentMethodLabel =
    paymentMethod === "cod"
      ? "Cash on Delivery (ক্যাশ অন ডেলিভারি)"
      : paymentMethod === "bkash"
      ? "bKash Digital Payment"
      : paymentMethod === "nagad"
      ? "Nagad Digital Payment"
      : paymentMethod === "online_payment"
      ? "Online SSLCommerz / Card"
      : paymentMethod.toUpperCase();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-8">
      {/* Print isolation style */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #official-order-invoice,
          #official-order-invoice * {
            visibility: visible !important;
          }
          #official-order-invoice {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 24px !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: #0f172a !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* MAIN COMMERCIAL INVOICE DOCUMENT */}
      <div
        ref={invoiceRef}
        id="official-order-invoice"
        className="bg-white dark:bg-[#121320] border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 md:p-10 shadow-lg text-slate-800 dark:text-slate-200 flex flex-col gap-8 transition-all"
      >
        {/* Invoice Header / Branding */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-slate-200/80 dark:border-slate-800 pb-8">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#003820] text-white flex items-center justify-center font-black text-xl shadow-md">
                GB
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                  GhorBazar
                </h2>
                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                  Household & Kitchen Appliances
                </p>
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
              <p>Plot 44, Sector 11, Uttara, Dhaka-1230, Bangladesh</p>
              <p>Hotline: 09612-GHORBZ (9AM – 10PM) | support@ghorbazar.com</p>
              <p className="text-[11px] font-mono">BIN / Trade License: TRAD-DH-2025-99410</p>
            </div>
          </div>

          <div className="text-left sm:text-right flex flex-col sm:items-end">
            <div className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs uppercase tracking-wider mb-2">
              Tax Invoice / Receipt
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white font-mono">
              #{orderNumber}
            </h3>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
              <p className="flex items-center sm:justify-end gap-1.5">
                <Calendar size={12} className="text-slate-400" />
                <span>Date: {orderDate}</span>
              </p>
              <p className="flex items-center sm:justify-end gap-1.5">
                <Clock size={12} className="text-slate-400" />
                <span>Time: {orderTime}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Customer, Shipping, & Payment Info Grid */}
        <InvoiceCustomerInfo
          customerName={customerName}
          customerPhone={customerPhone}
          customerEmail={customerEmail}
          fullAddress={fullAddress}
          shippingNotes={shippingAddr.notes}
          paymentMethodLabel={paymentMethodLabel}
          paymentStatus={paymentStatus}
          transactionId={transactionId}
          orderStatus={orderData?.orderStatus}
        />

        {/* Ordered Items Table */}
        <InvoiceItemsTable items={items} />

        {/* Financial Summary & Payment Breakdown */}
        <InvoiceSummary
          subtotal={subtotal}
          deliveryCharge={deliveryCharge}
          district={shippingAddr.district}
          discount={discount}
          vat={vat}
          grandTotal={grandTotal}
          orderNumber={orderNumber}
        />

        {/* Invoice Footer / Digital Signature stamp */}
        <div className="border-t border-slate-100 dark:border-slate-800/60 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-400 text-center sm:text-left">
          <div>
            <p className="font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              GhorBazar Automated Dispatch Authority
            </p>
            <p className="text-[10px] mt-0.5">
              This is a computer-generated tax invoice and requires no physical signature.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-slate-600 dark:text-slate-300">
            <span>SECURE VERIFIED ID:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {orderData?._id ? orderData._id.slice(-10).toUpperCase() : orderNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Sticky/Floating Navigation & Action Buttons */}
      <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#121320] border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <RotateCcw size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              Need to modify or track your delivery?
            </p>
            <p className="text-[11px] text-slate-500">
              Check real-time parcel updates in your customer dashboard anytime.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Button
            onClick={handlePrint}
            variant="outline"
            className="h-11 px-5 rounded-xl font-bold text-xs border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Printer size={15} />
            <span>Download Invoice</span>
          </Button>

          <Button
            asChild
            className="h-11 px-6 rounded-xl font-bold text-xs bg-[#003820] hover:bg-[#0c4e2f] text-white shadow-md shadow-[#003820]/20 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Link href="/products">
              <ShoppingBag size={15} />
              <span>Order Again</span>
              <ArrowRight size={14} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessView;
