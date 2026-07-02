"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaMinus, FaPlus } from "react-icons/fa";
import { Trash2 } from "lucide-react";

interface CartItemRowProps {
  item: any;
  onQtyChange: (item: any, change: number) => void;
  onRemoveItem: (variantId: string, name: string) => void;
}

export default function CartItemRow({ item, onQtyChange, onRemoveItem }: CartItemRowProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-6 border-b border-slate-800/60 last:border-0">
      {/* Product Information */}
      <div className="col-span-1 md:col-span-6 flex items-center gap-4">
        {/* Image container */}
        <div className="relative w-20 h-20 bg-[#09090e] rounded-xl overflow-hidden border border-slate-800/85 shrink-0 flex items-center justify-center p-1">
          <Image
            src={item.product?.thumbnail || "/placeholder.png"}
            alt={item.product?.name || "Product Image"}
            fill
            className="object-contain"
          />
        </div>
        {/* Details */}
        <div className="min-w-0">
          <Link
            href={`/products/${item.product?.slug}`}
            className="font-bold text-white text-[15px] hover:text-[#5f5eff] transition-colors block truncate"
          >
            {item.product?.name}
          </Link>
          {/* Variant Badges */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="bg-[#09090e] border border-emerald-500/20 text-[#00e5a3] text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded">
              {item.variant?.name || "Standard Edition"}
            </span>
            <span className="bg-[#09090e] border border-slate-800 text-slate-400 text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded">
              Verified Gear
            </span>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="col-span-1 md:col-span-2 text-center md:text-center flex md:block justify-between items-center mt-2 md:mt-0">
        <span className="md:hidden text-xs text-slate-400 font-bold uppercase">Price</span>
        <span className="text-sm font-semibold text-slate-300">৳{item.price}</span>
      </div>

      {/* Quantity Selector */}
      <div className="col-span-1 md:col-span-2 flex md:justify-center justify-between items-center mt-2 md:mt-0">
        <span className="md:hidden text-xs text-slate-400 font-bold uppercase">Quantity</span>
        <div className="flex items-center bg-[#09090e] border border-slate-800 rounded-lg overflow-hidden shrink-0">
          <button
            onClick={() => onQtyChange(item, -1)}
            className="p-2 hover:bg-[#151522] text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <FaMinus size={8} />
          </button>
          <span className="px-3 text-xs font-bold text-white">{item.quantity}</span>
          <button
            onClick={() => onQtyChange(item, 1)}
            className="p-2 hover:bg-[#151522] text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <FaPlus size={8} />
          </button>
        </div>
      </div>

      {/* Subtotal */}
      <div className="col-span-1 md:col-span-2 text-right flex md:block justify-between items-center mt-2 md:mt-0">
        <span className="md:hidden text-xs text-slate-400 font-bold uppercase">Subtotal</span>
        <div className="flex items-center justify-end gap-3">
          <span className="text-sm font-bold text-white">৳{item.totalPrice}</span>
          <button
            onClick={() => onRemoveItem(item.variant?._id, item.product?.name)}
            className="p-1.5 text-slate-500 hover:text-red-450 hover:bg-red-950/20 rounded-lg transition-all cursor-pointer"
            title="Remove item"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
