"use client";

import React from "react";
import Link from "next/link";

export const HomePromoBanner: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-6 w-full">
      <div className="bg-[#003820] rounded-2xl p-6 md:p-10 text-white relative overflow-hidden shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 flex flex-col gap-3 z-10">
            <span className="text-xs font-bold text-[#b0f1c7] uppercase tracking-wider">
              Limited Edition Kitchen Gear
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
              Upgrade Your Everyday Kitchen
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 max-w-md leading-relaxed">
              Experience the joy of effortless culinary mastery with authentic heavy-gauge cookers, steamers, and food processors.
            </p>
            <div className="pt-2">
              <Link
                href="/products?category=Kitchenware"
                className="inline-flex items-center gap-2 bg-[#fd651e] hover:bg-[#a73a00] text-white font-bold px-6 py-3 rounded-lg text-xs md:text-sm shadow-md transition-all active:scale-95"
              >
                <span>Explore Appliances</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          <div className="md:col-span-5 flex items-center justify-center">
            <div className="relative w-full aspect-[4/3] max-w-sm rounded-xl overflow-hidden flex items-center justify-center p-2">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMJFzKFUf-nE5Yign340ZIpZcnhXX35cT0WqmzuJmVsuPm0eDjgK3kOHi0YrJW4jkirnkRlOs-hGHN-GuozjonjNFoED07EFNkPjS6Nx2WK6l2kyj3Ic4bUdj7fhc7cpjCDrnxd6_dTKLMl7Ku3xYzwpo-9ZV9Q_-AK5ve274yYgb0cKQlu6PvpmXWMWPjaftw6Lepn4JuQTa0erPseWLNl66x3FFE9sdOI--PNrKzoB2IXQ1O0jm2wA"
                alt="Upgrade Your Everyday Kitchen"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePromoBanner;
