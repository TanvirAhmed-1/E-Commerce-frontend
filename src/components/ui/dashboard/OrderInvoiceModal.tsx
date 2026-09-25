"use client";

import React, { useRef } from "react";
import { X, Printer, Calendar, Clock, Download } from "lucide-react";
import InvoiceItemsTable from "@/components/ui/checkout/InvoiceItemsTable";
import InvoiceCustomerInfo from "@/components/ui/checkout/InvoiceCustomerInfo";
import InvoiceSummary from "@/components/ui/checkout/InvoiceSummary";

interface OrderInvoiceModalProps {
  orderData: any;
  onClose: () => void;
}

export default function OrderInvoiceModal({ orderData, onClose }: OrderInvoiceModalProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const orderNumber =
    orderData?.orderId ||
    orderData?.orderNumber ||
    (orderData?._id ? `GB-${orderData._id.slice(-6).toUpperCase()}` : "GB-10024");

  const orderDate = orderData?.createdAt
    ? new Date(orderData.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : orderData?.date ||
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  const orderTime = orderData?.createdAt
    ? new Date(orderData.createdAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : orderData?.time || "10:30 AM";

  const shippingAddr = orderData?.shippingAddress || orderData?.address || {};
  const customerName =
    shippingAddr.fullName ||
    shippingAddr.name ||
    orderData?.user?.name ||
    orderData?.recipient ||
    "Valued Customer";

  const customerPhone =
    shippingAddr.phone ||
    orderData?.user?.phone ||
    orderData?.phone ||
    "+880 1700-000000";

  const customerEmail =
    shippingAddr.email ||
    orderData?.user?.email ||
    orderData?.email ||
    "";

  const fullAddress = [
    shippingAddr.address || shippingAddr.streetAddress,
    shippingAddr.upazila,
    shippingAddr.district,
    shippingAddr.division,
  ]
    .filter(Boolean)
    .join(", ") || "Standard Home Delivery, Bangladesh";

  const items = orderData?.items || orderData?.itemsList || orderData?.products || [];
  const subtotal = Number(
    orderData?.subtotal ||
    (items.length > 0
      ? items.reduce(
          (acc: number, it: any) =>
            acc + Number(it.price || 0) * Number(it.quantity || it.qty || 1),
          0
        )
      : orderData?.totalAmount || orderData?.total || 0)
  );

  const deliveryCharge = Number(orderData?.deliveryCharge || orderData?.shippingFee || (subtotal > 0 ? 80 : 0));
  const discount = Number(orderData?.discount || 0);
  const vat = Number(orderData?.vat || 0);
  const grandTotal = Number(
    orderData?.totalAmount ||
    orderData?.grandTotal ||
    orderData?.total ||
    subtotal + deliveryCharge - discount + vat
  );

  const paymentMethod =
    orderData?.payment?.method ||
    orderData?.paymentMethod ||
    "cod";

  const paymentStatus =
    orderData?.payment?.status ||
    orderData?.paymentStatus ||
    (paymentMethod === "cod" ? "pending" : "paid");

  const transactionId =
    orderData?.payment?.transactionId ||
    orderData?.transactionId;

  const paymentMethodLabel =
    paymentMethod === "cod"
      ? "Cash on Delivery (ক্যাশ অন ডেলিভারি)"
      : paymentMethod === "bkash"
      ? "bKash Digital Payment"
      : paymentMethod === "nagad"
      ? "Nagad Digital Payment"
      : paymentMethod === "online_payment"
      ? "Online SSLCommerz / Card"
      : String(paymentMethod).toUpperCase();

  const formattedItems = items.map((it: any) => ({
    name: it.product?.name || it.name || it.title || "Household Item",
    quantity: it.quantity || it.qty || 1,
    price: it.price || it.product?.price || 0,
    thumbnail:
      it.product?.thumbnail?.url ||
      it.product?.thumbnail ||
      it.thumbnail ||
      (Array.isArray(it.product?.images) ? it.product.images[0] : "") ||
      it.imageUrl ||
      "",
    variant: it.variant,
    product: it.product,
  }));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* CSS print overrides to isolate the invoice and hide all background UI */}
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

      <div className="bg-white dark:bg-[#121320] rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95">
        {/* Modal Controls Header */}
        <div className="no-print px-6 py-4 bg-gray-50 dark:bg-slate-900/80 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#064E3B] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              GB
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">
                Official Order Invoice
              </h3>
              <p className="text-[10px] text-gray-500 font-mono">Ref: #{orderNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#064E3B] hover:bg-[#043E2F] text-white rounded-full text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Printer size={14} />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Invoice Content */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-[#F8FAFC]/50 dark:bg-transparent">
          <div
            ref={invoiceRef}
            id="official-order-invoice"
            className="bg-white dark:bg-[#121320] border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-9 shadow-md text-slate-800 dark:text-slate-200 flex flex-col gap-7"
          >
            {/* Invoice Header / Branding */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-slate-200/80 dark:border-slate-800 pb-7">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#064E3B] text-white flex items-center justify-center font-black text-xl shadow-md">
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
              orderStatus={orderData?.orderStatus || orderData?.status || "Processing"}
            />

            {/* Order Items Table */}
            <div>
              <h4 className="font-extrabold uppercase text-[10px] tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                Purchased Products Breakdown
              </h4>
              <InvoiceItemsTable items={formattedItems} />
            </div>

            {/* Totals & Notes Summary */}
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
        </div>
      </div>
    </div>
  );
}
