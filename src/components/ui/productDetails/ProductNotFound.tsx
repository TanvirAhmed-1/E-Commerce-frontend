"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ProductNotFound: React.FC = () => {
  return (
    <div className="bg-[#faf8ff] dark:bg-[#0B0B14] min-h-[60vh] py-16 flex flex-col items-center justify-center px-4 text-center">
      <AlertCircle size={48} className="text-red-500 mb-4" />
      <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
        Product Not Found
      </h2>
      <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-md">
        The product you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link href="/products" className="mt-6">
        <Button className="bg-[#003820] hover:bg-[#0f5132] text-white flex items-center gap-2">
          <ArrowLeft size={16} />
          <span>Back to Catalog</span>
        </Button>
      </Link>
    </div>
  );
};

export default ProductNotFound;
