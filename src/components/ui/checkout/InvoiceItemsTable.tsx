"use client";

import React from "react";
import Image from "next/image";

interface InvoiceItemsTableProps {
  items: any[];
}

export const InvoiceItemsTable: React.FC<InvoiceItemsTableProps> = ({ items = [] }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-slate-100/80 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
            <th className="py-3.5 px-4">#</th>
            <th className="py-3.5 px-4">Item & Description</th>
            <th className="py-3.5 px-4 text-center">Unit Price</th>
            <th className="py-3.5 px-4 text-center">Qty</th>
            <th className="py-3.5 px-4 text-right">Total Price</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {items.length > 0 ? (
            items.map((item: any, idx: number) => {
              const productName = item.product?.name || item.name || `Order Item ${idx + 1}`;
              const variantText =
                item.variant?.name ||
                (item.variant?.attributes &&
                  item.variant.attributes.map((a: any) => `${a.value || a}`).join(", ")) ||
                "";
              const itemThumbnail = item.product?.thumbnail || item.thumbnail || "";
              const unitPrice = Number(item.price || 0);
              const qty = Number(item.quantity || 1);
              const itemTotal = unitPrice * qty;

              return (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                  <td className="py-4 px-4 font-mono text-slate-400 font-bold">{idx + 1}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {itemThumbnail && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-slate-200/60 dark:border-slate-700 relative">
                          <Image
                            src={itemThumbnail}
                            alt={productName}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white leading-tight">{productName}</p>
                        {variantText && (
                          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5 font-medium">
                            Option: {variantText}
                          </p>
                        )}
                        {item.product?.sku && (
                          <p className="text-[10px] text-slate-400 font-mono">SKU: {item.product.sku}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center font-medium text-slate-700 dark:text-slate-300">
                    ৳{unitPrice.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-slate-900 dark:text-white">{qty}</td>
                  <td className="py-4 px-4 text-right font-extrabold text-slate-900 dark:text-white font-mono">
                    ৳{itemTotal.toLocaleString()}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="py-8 text-center text-slate-500">
                Standard order package registered.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceItemsTable;
