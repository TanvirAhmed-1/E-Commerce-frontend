"use client";

import React from "react";
import Link from "next/link";

export const CategoryIconsRow: React.FC = () => {
  const categories = [
    {
      title: "Plastic Household",
      subtitle: "Durable & Useful",
      icon: "recycling",
      href: "/products?category=Plastic+Household",
    },
    {
      title: "Kitchenware",
      subtitle: "For a Modern Kitchen",
      icon: "soup_kitchen",
      href: "/products?category=Kitchenware",
    },
    {
      title: "Rice Cookers",
      subtitle: "Cook with Confidence",
      icon: "cooking",
      href: "/products?category=Rice+Cookers",
    },
    {
      title: "Storage & Organization",
      subtitle: "Keep Everything Tidy",
      icon: "inventory_2",
      href: "/products?category=Storage+%26+Organization",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.title}
            href={cat.href}
            className="bg-white dark:bg-[#121320] p-4 md:p-5 rounded-xl border border-slate-200/70 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-[#003820] dark:hover:border-[#95d4ac] transition-all flex flex-col items-center text-center gap-2 group"
          >
            <div className="w-12 h-12 rounded-full bg-[#f2f3ff] dark:bg-[#09090e] group-hover:bg-[#003820] text-[#003820] group-hover:text-white dark:text-[#95d4ac] flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-[24px]">{cat.icon}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs md:text-sm text-slate-900 dark:text-white group-hover:text-[#003820] dark:group-hover:text-[#95d4ac] transition-colors">
                {cat.title}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {cat.subtitle}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryIconsRow;
