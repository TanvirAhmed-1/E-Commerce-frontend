"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { useGetMyCartQuery } from "@/redux/features/cart/cartApi";

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const token = useAppSelector((state) => state.auth.token);
  const { data: dbCartResponse } = useGetMyCartQuery(undefined, { skip: !token });
  const cartCount = dbCartResponse?.data?.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;

  const navItems = [
    { label: "Home", href: "/", icon: "home" },
    { label: "Categories", href: "/products", icon: "category" },
    { label: "Cart", href: "/cart", icon: "shopping_cart", badge: cartCount },
    { label: "Account", href: token ? "/dashboard" : "/login", icon: "person" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#121320] border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] px-4 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 relative py-1 px-3 transition-colors ${
                isActive
                  ? "text-[#003820] dark:text-[#95d4ac] font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <div className="relative">
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#fd651e] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
