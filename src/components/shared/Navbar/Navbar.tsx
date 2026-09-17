"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import { useGetWishListQuery } from "@/redux/features/wishList/wishListApi";
import { useGetMyCartQuery } from "@/redux/features/cart/cartApi";
import NavbarSearch from "./NavSearch";
import NavMobileDrawer from "./NavMobileDrawer";

export default function Navbar() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { token, name } = useAppSelector((state) => state.auth);

  const { data: dbCartResponse } = useGetMyCartQuery(undefined, { skip: !token });
  const cartItems = dbCartResponse?.data?.items || [];
  const cartCount = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const cartTotal = dbCartResponse?.data?.totalAmount || 0;

  const { data: wishlistResponse } = useGetWishListQuery(undefined, { skip: !token });
  const wishlistCount = wishlistResponse?.data?.products?.length || 0;

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (e) {}
    dispatch(logout());
    router.push("/login");
  };

  const categories = [
    { label: "Rice Cookers & Steamers", href: "/products?category=Rice+Cookers" },
    { label: "Pressure Cookers", href: "/products?category=Pressure+Cookers" },
    { label: "Blenders & Grinders", href: "/products?category=Blenders" },
    { label: "Induction & Gas Stoves", href: "/products?category=Kitchenware" },
    { label: "Non-Stick Cookware", href: "/products?category=Cookware" },
    { label: "Dinnerware", href: "/products?category=Plastic+Household" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#0B0B14]/95 shadow-[0_2px_12px_rgba(0,56,32,0.06)] backdrop-blur-xl border-b border-slate-100 dark:border-slate-850">
      {/* 1. Top Announcement Bar */}
      <div className="bg-[#003820] text-white text-[11px] font-medium">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[14px]">call</span>
              Hotline: 09612-GHORBZ (9AM - 10PM)
            </span>
            <span className="opacity-40">|</span>
            <span className="hidden md:inline">Free Delivery across Bangladesh on orders over ৳3,000</span>
            <span className="hidden lg:inline opacity-40">|</span>
            <span className="hidden lg:inline">100% Authentic Appliances</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1">
              <span className="inline-block w-4 h-3 bg-[#0f5132] rounded-xs border border-white/30 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fd651e]"></span>
              </span>
              <span className="font-bold">BD</span>
            </div>
            <span className="opacity-40">|</span>
            <button
              onClick={toggleTheme}
              className="p-1 text-slate-200 hover:text-white transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              <span className="material-symbols-outlined text-[14px]">
                {theme === "dark" ? "light_mode" : "dark_mode"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Center Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-18 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-[#003820] text-white flex items-center justify-center font-black shadow-xs">
            <span className="material-symbols-outlined text-[22px]">storefront</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold text-[#003820] dark:text-[#95d4ac] tracking-tight leading-tight">
              GhorBazar
            </span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider leading-none">
              Household & Kitchen
            </span>
          </div>
        </Link>

        {/* Search Bar */}
        <NavbarSearch />

        {/* Right Actions */}
        <div className="flex items-center gap-4 shrink-0">
          <Link
            href="/dashboard?tab=orders"
            className="hidden xl:flex flex-col items-center group text-slate-600 dark:text-slate-400 hover:text-[#003820] dark:hover:text-[#95d4ac] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">local_shipping</span>
            <span className="text-[10px] font-semibold mt-0.5">Track Order</span>
          </Link>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="relative flex flex-col items-center group text-slate-600 dark:text-slate-400 hover:text-[#003820] dark:hover:text-[#95d4ac] transition-colors"
          >
            <div className="relative">
              <span className="material-symbols-outlined text-[22px]">favorite</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#fd651e] text-white text-[9px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold mt-0.5 hidden sm:inline">Wishlist</span>
          </Link>

          {/* Cart preview */}
          <Link
            href="/cart"
            className="flex items-center gap-2 bg-[#f2f3ff] dark:bg-[#121320] px-3 py-1.5 rounded-lg hover:bg-[#eaedff] dark:hover:bg-slate-800 transition-colors border border-slate-200/60 dark:border-slate-800"
          >
            <div className="relative flex items-center">
              <span className="material-symbols-outlined text-[22px] text-[#003820] dark:text-[#95d4ac]">
                shopping_bag
              </span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#a73a00] text-white text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 leading-tight">
                Cart Total
              </span>
              <span className="text-xs font-bold text-[#003820] dark:text-[#95d4ac] leading-none">
                ৳{cartTotal.toLocaleString("en-US")}
              </span>
            </div>
          </Link>

          {/* User Account / Avatar */}
          <Link
            href={token ? "/dashboard" : "/login"}
            className="w-8 h-8 rounded-full bg-[#003820] dark:bg-[#0f5132] text-white flex items-center justify-center shadow-xs hover:opacity-90"
            title={name || "My Account"}
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setIsSheetOpen(true)}
            className="md:hidden p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open mobile menu"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
        </div>
      </div>

      {/* 3. Bottom Category Navigation Row */}
      <div className="hidden md:block bg-[#f2f3ff] dark:bg-[#09090e] border-t border-slate-150 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-10 flex items-center justify-between">
          <div className="flex items-center gap-4 h-full overflow-x-auto scrollbar-hide">
            <Link
              href="/products"
              className="flex items-center gap-1.5 bg-[#003820] text-white px-3.5 h-full text-xs font-bold shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">menu</span>
              All Categories
            </Link>

            <nav className="flex items-center gap-4 h-full text-xs">
              {categories.map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.href}
                  className="h-full flex items-center text-slate-600 dark:text-slate-400 hover:text-[#003820] dark:hover:text-white font-semibold transition-colors whitespace-nowrap"
                >
                  {cat.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link
            href="/products?filter=hot-deals"
            className="flex items-center gap-1 text-xs font-bold text-[#fd651e] hover:text-[#a73a00] shrink-0"
          >
            <span>Daily Hot Deals</span>
            <span className="material-symbols-outlined text-[18px] text-[#fd651e]">
              local_fire_department
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile Drawer */}
      <NavMobileDrawer
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        token={token}
        name={name}
        onLogout={handleLogout}
      />
    </header>
  );
}
