"use client";

import React from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface NavMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  token?: string | null;
  name?: string | null;
  onLogout: () => void;
}

export const NavMobileDrawer: React.FC<NavMobileDrawerProps> = ({
  isOpen,
  onClose,
  token,
  name,
  onLogout,
}) => {
  const menuLinks = [
    { label: "Home", href: "/", icon: "home" },
    { label: "Shop", href: "/products", icon: "storefront" },
    { label: "Categories", href: "/products", icon: "category" },
    { label: "My Orders", href: token ? "/dashboard?tab=orders" : "/login", icon: "inventory_2" },
    { label: "Wishlist", href: "/wishlist", icon: "favorite" },
    { label: "Account", href: token ? "/dashboard" : "/login", icon: "person" },
    { label: "Contact Us", href: "/contact", icon: "support_agent" },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[300px] sm:w-[360px] p-0 bg-white dark:bg-[#121320] flex flex-col justify-between">
        <div>
          {/* Header with User Info */}
          <SheetHeader className="p-5 border-b border-slate-100 dark:border-slate-800 bg-[#f2f3ff] dark:bg-[#09090e]">
            <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#003820] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {name ? name.slice(0, 2).toUpperCase() : <span className="material-symbols-outlined text-[22px]">person</span>}
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {name || "Guest User"}
                </span>
                <Link
                  href={token ? "/dashboard" : "/login"}
                  onClick={onClose}
                  className="text-xs text-[#003820] dark:text-[#95d4ac] font-semibold hover:underline"
                >
                  {token ? "View Profile" : "Log In / Register"}
                </Link>
              </div>
            </div>
          </SheetHeader>

          {/* Navigation Links List */}
          <nav className="p-4 flex flex-col gap-1">
            {menuLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-[#f2f3ff] dark:hover:bg-slate-800 hover:text-[#003820] dark:hover:text-[#95d4ac] font-semibold text-xs transition-colors"
              >
                <span className="material-symbols-outlined text-[20px] text-[#003820] dark:text-[#95d4ac]">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Actions */}
        {token && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-bold text-xs transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span>Log Out</span>
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default NavMobileDrawer;
