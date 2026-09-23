"use client";

import React from "react";
import { Truck, MapPin, Phone, Mail, ShieldCheck, CreditCard } from "lucide-react";

interface InvoiceCustomerInfoProps {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  fullAddress: string;
  shippingNotes?: string;
  paymentMethodLabel: string;
  paymentStatus: string;
  transactionId?: string;
  orderStatus?: string;
}

export const InvoiceCustomerInfo: React.FC<InvoiceCustomerInfoProps> = ({
  customerName,
  customerPhone,
  customerEmail,
  fullAddress,
  shippingNotes,
  paymentMethodLabel,
  paymentStatus,
  transactionId,
  orderStatus = "Processing",
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
      {/* Customer & Delivery Details */}
      <div className="bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 flex flex-col gap-2">
        <h4 className="font-extrabold uppercase text-[10px] tracking-wider text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1.5">
          <MapPin size={12} />
          <span>Invoiced To (Recipient)</span>
        </h4>
        <p className="text-sm font-bold text-slate-900 dark:text-white">{customerName}</p>
        <div className="space-y-1 text-slate-600 dark:text-slate-300">
          <p className="flex items-center gap-2">
            <Phone size={13} className="text-slate-400" />
            <span className="font-semibold">{customerPhone}</span>
          </p>
          {customerEmail && (
            <p className="flex items-center gap-2">
              <Mail size={13} className="text-slate-400" />
              <span>{customerEmail}</span>
            </p>
          )}
          <p className="flex items-start gap-2 pt-1">
            <Truck size={13} className="text-slate-400 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">
              {fullAddress || "Standard Home Delivery Address"}
            </span>
          </p>
          {shippingNotes && (
            <p className="pt-2 text-[11px] text-amber-700 dark:text-amber-400 font-medium italic">
              Note: &ldquo;{shippingNotes}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* Payment & Fulfillment Summary */}
      <div className="bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between gap-4">
        <div>
          <h4 className="font-extrabold uppercase text-[10px] tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
            <CreditCard size={12} />
            <span>Payment & Shipping Method</span>
          </h4>
          <div className="space-y-2 text-slate-700 dark:text-slate-300">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Method:</span>
              <span className="font-bold text-slate-900 dark:text-white">{paymentMethodLabel}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Payment Status:</span>
              <span
                className={`font-extrabold px-2 py-0.5 rounded-md text-[10px] uppercase ${
                  paymentStatus === "paid"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                }`}
              >
                {paymentStatus === "paid" ? "Paid" : "Cash on Delivery"}
              </span>
            </div>
            {transactionId && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500">TrxID:</span>
                <span className="font-mono text-slate-900 dark:text-white font-bold">{transactionId}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Fulfillment Status:</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400 capitalize">
                {orderStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck size={14} className="text-emerald-600 flex-shrink-0" />
          <span>Genuine Product Warranty & 7 Days Replacement Guarantee</span>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCustomerInfo;
