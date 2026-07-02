"use client";

import React, { useRef } from "react";
import { X, Printer, Download } from "lucide-react";

interface InvoiceModalProps {
  order: any;
  vat: number;
  shipping: number;
  grandTotal: number;
  onClose: () => void;
}

export default function InvoiceModal({ order, vat, shipping, grandTotal, onClose }: InvoiceModalProps) {
  const printAreaRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const orderId = order?.orderId || order?._id?.slice(-8).toUpperCase();
  const orderDate = new Date(order?.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* CSS print overrides to isolate the invoice and hide all background UI */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-invoice-content,
          #printable-invoice-content * {
            visibility: visible !important;
          }
          #printable-invoice-content {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-white dark:bg-[#121320] rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col my-8">
        {/* Modal Controls */}
        <div className="no-print px-6 py-4 bg-gray-50 dark:bg-slate-900/60 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Commercial Invoice</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 hover:bg-gray-200 dark:hover:bg-slate-850 rounded-xl text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
              title="Print Invoice"
            >
              <Printer size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 dark:hover:bg-slate-850 rounded-xl text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document */}
        <div 
          ref={printAreaRef}
          id="printable-invoice-content"
          className="p-6 md:p-10 bg-white text-slate-800 overflow-y-auto space-y-8 text-left"
        >
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-100 pb-6">
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                APEX E-COMMERCE
              </h1>
              <p className="text-[10px] text-slate-550 mt-1 uppercase font-bold tracking-wider">
                Retail Access Protocol
              </p>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-xs">
                Plot-44, Sector-11, Uttara, Dhaka, Bangladesh<br />
                support@apex-retail.io | +880 1700-000000
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-black text-slate-900 uppercase">Invoice</h2>
              <p className="text-xs font-bold text-slate-500 mt-1">Invoice No: #{orderId}</p>
              <p className="text-xs text-slate-400 mt-1">Date: {orderDate}</p>
            </div>
          </div>

          {/* Customer & Payment Meta info */}
          <div className="grid grid-cols-2 gap-8 text-xs">
            <div>
              <h3 className="font-extrabold text-slate-900 uppercase text-[10px] tracking-wider mb-2 text-slate-400">
                Invoiced To (Buyer)
              </h3>
              <p className="font-bold text-slate-900">{order?.shippingAddress?.fullName}</p>
              <p className="text-slate-500 mt-1">{order?.shippingAddress?.phone}</p>
              <p className="text-slate-500 mt-1 leading-relaxed">
                {order?.shippingAddress?.address}, {order?.shippingAddress?.city}
              </p>
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 uppercase text-[10px] tracking-wider mb-2 text-slate-400">
                Payment Details
              </h3>
              <p className="text-slate-650">Method: <strong className="text-slate-900 capitalize">{order?.paymentMethod}</strong></p>
              <p className="text-slate-650 mt-1">Status: <strong className="text-slate-900 capitalize">{order?.paymentStatus || "unpaid"}</strong></p>
              {order?.transactionId && (
                <p className="text-slate-650 mt-1">TXID: <strong className="text-slate-900 font-mono text-[10px]">{order?.transactionId}</strong></p>
              )}
            </div>
          </div>

          {/* Table Items */}
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-405 font-bold uppercase text-[9px] tracking-wider">
                <th className="py-2.5">Item Details</th>
                <th className="py-2.5 text-center">Qty</th>
                <th className="py-2.5 text-right">Price</th>
                <th className="py-2.5 text-right">Total Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order?.items?.map((item: any, idx: number) => (
                <tr key={idx} className="text-slate-700">
                  <td className="py-3">
                    <p className="font-bold text-slate-900">{item.product?.name || "Premium Item"}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.variant?.name || "Default Edition"}</p>
                  </td>
                  <td className="py-3 text-center font-semibold">{item.quantity}</td>
                  <td className="py-3 text-right">৳{item.price}</td>
                  <td className="py-3 text-right font-bold text-slate-900">৳{item.totalPrice || (item.quantity * item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Summary */}
          <div className="flex justify-end border-t border-slate-200 pt-6">
            <div className="w-64 space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">৳{order?.totalAmount || order?.grandTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (5%)</span>
                <span className="font-semibold text-slate-900">৳{vat}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping & Handling</span>
                <span className="font-semibold text-slate-900">৳{shipping}</span>
              </div>
              <div className="flex justify-between pt-2.5 border-t border-slate-250 font-bold text-slate-900 text-sm">
                <span>Grand Total</span>
                <span className="text-base font-black">৳{grandTotal}</span>
              </div>
            </div>
          </div>

          {/* Invoice Note footer */}
          <div className="border-t border-slate-100 pt-6 text-[10px] text-slate-400 text-center">
            <p className="font-bold uppercase tracking-wider text-slate-900">Thank you for your business!</p>
            <p className="mt-1">All orders are subject to our terms of purchase. Verify item packaging before seal removal.</p>
          </div>
        </div>

        {/* Action Controls for Screen View */}
        <div className="no-print px-6 py-4 bg-gray-50 dark:bg-slate-900/60 border-t border-gray-200 dark:border-slate-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="text-xs font-bold text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white px-4 py-2 cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary-hover px-4 py-2 rounded-xl shadow-sm cursor-pointer"
          >
            <Printer size={14} /> Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
}
