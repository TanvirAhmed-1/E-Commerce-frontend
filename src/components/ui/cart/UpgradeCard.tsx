"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { getDisplayPrice } from "@/utils/priceHelper";

interface UpgradeCardProps {
  product: any;
  customerType?: string | null;
  onAddToCartDirect: (product: any) => void;
}

export default function UpgradeCard({ product, customerType, onAddToCartDirect }: UpgradeCardProps) {
  return (
    <div className="bg-[#121320] border border-slate-800/60 rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-slate-800 transition-colors shadow-md">
      <div className="flex items-center gap-4">
        <div className="relative w-14 h-14 bg-[#09090e] rounded-xl overflow-hidden border border-slate-800 shrink-0 flex items-center justify-center p-1">
          <Image
            src={product.thumbnail || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-contain"
          />
        </div>
        <div className="min-w-0">
          <Link
            href={`/products/${product.slug}`}
            className="font-bold text-white text-sm hover:text-[#5f5eff] transition-colors block truncate max-w-[160px]"
          >
            {product.name}
          </Link>
          <span className="text-xs text-[#00e5a3] font-black mt-1 block">
            +৳{getDisplayPrice(product, customerType)}
          </span>
        </div>
      </div>
      <button
        onClick={() => onAddToCartDirect(product)}
        className="w-8 h-8 rounded-full bg-slate-800 hover:bg-[#5f5eff] text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-700/80 active:scale-95"
        title="Add Upgrade"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
