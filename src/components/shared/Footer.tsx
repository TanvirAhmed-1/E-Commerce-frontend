"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#003820] text-slate-200 pt-12 pb-8 mt-12 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Main Footer 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Col 1: About & Info */}
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white text-[#003820] flex items-center justify-center font-black">
                <span className="material-symbols-outlined text-[20px]">storefront</span>
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">GhorBazar</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bangladesh&apos;s trusted e-commerce destination for genuine kitchen appliances, culinary utensils, and household daily gear.
            </p>
            <div className="flex flex-col gap-2 text-xs text-slate-300 pt-1">
              <span className="flex items-start gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#95d4ac] shrink-0 mt-0.5">location_on</span>
                Gulshan-1, Dhaka 1212, Bangladesh
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#95d4ac] shrink-0">headset_mic</span>
                Hotline: 09612-GHORBZ (9AM - 10PM)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#95d4ac] shrink-0">verified_user</span>
                Trade License: TRAD/DNCC/049182/2023
              </span>
            </div>
          </div>

          {/* Col 2: Customer Care */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-bold text-white uppercase tracking-wider">Customer Care</span>
            <nav className="flex flex-col gap-2 text-xs text-slate-300">
              <Link href="/dashboard?tab=orders" className="hover:text-white transition-colors">
                Track Your Order
              </Link>
              <Link href="/shipping-policy" className="hover:text-white transition-colors">
                Shipping &amp; Delivery Policy
              </Link>
              <Link href="/returns-refund" className="hover:text-white transition-colors">
                Returns &amp; Refund Guarantee
              </Link>
              <Link href="/warranty-claim" className="hover:text-white transition-colors">
                Warranty Claim Procedure
              </Link>
              <Link href="/customer-faqs" className="hover:text-white transition-colors">
                Frequently Asked Questions
              </Link>
            </nav>
          </div>

          {/* Col 3: Popular Categories */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-bold text-white uppercase tracking-wider">Popular Categories</span>
            <nav className="flex flex-col gap-2 text-xs text-slate-300">
              <Link href="/products?category=Rice+Cookers" className="hover:text-white transition-colors">
                Electric Rice Cookers
              </Link>
              <Link href="/products?category=Air+Fryers" className="hover:text-white transition-colors">
                Air Fryers &amp; Ovens
              </Link>
              <Link href="/products?category=Blenders" className="hover:text-white transition-colors">
                Electric Kettles &amp; Flasks
              </Link>
              <Link href="/products?category=Kitchenware" className="hover:text-white transition-colors">
                Gas &amp; Induction Stoves
              </Link>
              <Link href="/products?category=Cookware" className="hover:text-white transition-colors">
                Non-Stick Pans &amp; Woks
              </Link>
            </nav>
          </div>

          {/* Col 4: Payments & App Download */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-bold text-white uppercase tracking-wider">Accepted Payments</span>
            <p className="text-xs text-slate-300">Secured transactions with local mobile wallets and major cards:</p>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              <span className="bg-white/10 px-2 py-1 rounded text-[11px] font-bold text-white">bKash</span>
              <span className="bg-white/10 px-2 py-1 rounded text-[11px] font-bold text-white">Nagad</span>
              <span className="bg-white/10 px-2 py-1 rounded text-[11px] font-bold text-white">Rocket</span>
              <span className="bg-white/10 px-2 py-1 rounded text-[11px] font-bold text-white">Visa</span>
              <span className="bg-white/10 px-2 py-1 rounded text-[11px] font-bold text-white">Mastercard</span>
              <span className="bg-[#fd651e] text-white px-2 py-1 rounded text-[11px] font-bold">Cash on Delivery</span>
            </div>

            <div className="pt-2">
              <span className="text-xs font-semibold text-white block mb-2">Download GhorBazar App</span>
              <div className="flex items-center gap-2">
                <div className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer transition-colors">
                  <span className="material-symbols-outlined text-[20px] text-[#95d4ac]">shop</span>
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-slate-400 leading-tight">Get it on</span>
                    <span className="text-[11px] font-bold text-white leading-tight">Google Play</span>
                  </div>
                </div>
                <div className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer transition-colors">
                  <span className="material-symbols-outlined text-[20px] text-[#95d4ac]">phone_iphone</span>
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-slate-400 leading-tight">Download on</span>
                    <span className="text-[11px] font-bold text-white leading-tight">App Store</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-300">
          <p>© {currentYear} GhorBazar Bangladesh Ltd. All rights reserved. Secure 256-bit SSL encrypted checkout.</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-[#95d4ac]">lock</span>
              SSLCommerz Verified
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-[#95d4ac]">local_shipping</span>
              All 64 Districts
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
