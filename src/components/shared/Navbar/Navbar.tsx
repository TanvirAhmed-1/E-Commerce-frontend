"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import { useGetWishListQuery } from "@/redux/features/wishList/wishListApi";
import { useGetMyCartQuery } from "@/redux/features/cart/cartApi";
import { useGetMenuCategoryQuery, useGetNavbarPagesQuery } from "@/redux/features/home/homeApi";
import NavbarSearch from "./NavSearch";
import NavMobileDrawer from "./NavMobileDrawer";
import { 
  ChevronDown, 
  Layers, 
  Flame, 
  ArrowRight,
  Menu
} from "lucide-react";

interface MenuItem {
  _id: string;
  name: string;
  slug: string;
  level?: number;
  image?: string;
  children?: MenuItem[];
}

export default function Navbar() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { token, name } = useAppSelector((state) => state.auth);

  // Cart & Wishlist
  const { data: dbCartResponse } = useGetMyCartQuery(undefined, { skip: !token });
  const cartItems = dbCartResponse?.data?.items || [];
  const cartCount = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const cartTotal = dbCartResponse?.data?.totalAmount || 0;

  const { data: wishlistResponse } = useGetWishListQuery(undefined, { skip: !token });
  const wishlistCount = wishlistResponse?.data?.products?.length || 0;

  // Dynamic Categories & Dynamic Pages from backend
  const { data: menuCategoryRes } = useGetMenuCategoryQuery(undefined);
  const { data: pagesRes } = useGetNavbarPagesQuery(undefined);

  const navCategories: MenuItem[] = useMemo(() => {
    if (Array.isArray(menuCategoryRes?.data)) {
      return menuCategoryRes.data;
    }
    return [];
  }, [menuCategoryRes]);

  const navPages = useMemo(() => {
    if (Array.isArray(pagesRes?.data)) {
      return pagesRes.data;
    }
    return [];
  }, [pagesRes]);

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

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#0B0B14]/95 shadow-[0_2px_12px_rgba(0,56,32,0.06)] backdrop-blur-xl border-b border-slate-150 dark:border-slate-850">
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
            className="md:hidden p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Open mobile menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* 3. Bottom Category Navigation Row with Multi-Level Dropdowns */}
      <div className="hidden md:block bg-[#f8f9ff] dark:bg-[#09090e] border-t border-slate-200/70 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-11 flex items-center justify-between">
          <div className="flex items-center gap-1.5 h-full">
            {/* A. "All Categories" Mega Menu Dropdown */}
            <div className="relative group h-full">
              <button
                type="button"
                className="flex items-center gap-2 bg-[#003820] hover:bg-[#004d2c] text-white px-4 h-full text-xs font-bold shrink-0 transition-colors cursor-pointer select-none rounded-t-sm"
              >
                <Layers size={15} />
                <span>All Categories</span>
                <ChevronDown size={14} className="transition-transform duration-300 group-hover:rotate-180" />
              </button>

              {/* All Categories Mega Dropdown Menu */}
              {navCategories.length > 0 && (
                <div className="absolute left-0 top-full pt-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out z-50 pointer-events-none group-hover:pointer-events-auto">
                  <div className="bg-white dark:bg-[#121320] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-5 w-[650px] max-w-[85vw] max-h-[500px] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                      {navCategories.map((cat) => {
                        const hasChildren = Array.isArray(cat.children) && cat.children.length > 0;
                        const parentHref = `/products?category=${encodeURIComponent(cat.slug || cat.name)}`;

                        return (
                          <div key={cat._id} className="space-y-2">
                            <Link
                              href={parentHref}
                              className="font-extrabold text-xs uppercase tracking-wider text-[#003820] dark:text-[#95d4ac] hover:underline flex items-center gap-1.5"
                            >
                              <span>{cat.name}</span>
                              <ArrowRight size={11} className="opacity-60" />
                            </Link>

                            {hasChildren && (
                              <ul className="space-y-1 pl-1">
                                {cat.children!.slice(0, 6).map((subCat) => (
                                  <li key={subCat._id}>
                                    <Link
                                      href={`/products?category=${encodeURIComponent(subCat.slug || subCat.name)}`}
                                      className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-[#003820] dark:hover:text-white transition-colors block py-0.5 hover:translate-x-1 duration-150"
                                    >
                                      {subCat.name}
                                    </Link>
                                  </li>
                                ))}
                                {cat.children!.length > 6 && (
                                  <li>
                                    <Link
                                      href={parentHref}
                                      className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline block pt-1"
                                    >
                                      +{cat.children!.length - 6} more...
                                    </Link>
                                  </li>
                                )}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* B. Dynamic Horizontal Parent Category Links with Subcategory Hover Dropdowns */}
            <nav className="flex items-center gap-1 h-full pl-2">
              {navCategories.slice(0, 7).map((cat) => {
                const hasChildren = Array.isArray(cat.children) && cat.children.length > 0;
                const parentHref = `/products?category=${encodeURIComponent(cat.slug || cat.name)}`;

                return (
                  <div key={cat._id} className="relative group h-full flex items-center">
                    <Link
                      href={parentHref}
                      className="h-full flex items-center gap-1 px-3 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#003820] dark:hover:text-[#95d4ac] transition-colors whitespace-nowrap"
                    >
                      <span>{cat.name}</span>
                      {hasChildren && (
                        <ChevronDown
                          size={13}
                          className="transition-transform duration-200 group-hover:rotate-180 text-slate-400 group-hover:text-[#003820] dark:group-hover:text-[#95d4ac]"
                        />
                      )}
                    </Link>

                    {/* Subcategory Dropdown Panel */}
                    {hasChildren && (
                      <div className="absolute left-0 top-full pt-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out z-50 pointer-events-none group-hover:pointer-events-auto">
                        <div className="bg-white dark:bg-[#121320] rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-[0_15px_35px_rgba(0,0,0,0.12)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.5)] p-2 min-w-[200px]">
                          <div className="space-y-0.5">
                            {cat.children!.map((subCat) => (
                              <Link
                                key={subCat._id}
                                href={`/products?category=${encodeURIComponent(subCat.slug || subCat.name)}`}
                                className="block px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-[#f2f3ff] dark:hover:bg-slate-800/80 hover:text-[#003820] dark:hover:text-[#95d4ac] rounded-lg transition-colors"
                              >
                                {subCat.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Dynamic Pages */}
              {navPages.map((page: any) => (
                <Link
                  key={page._id}
                  href={`/${page.slug}`}
                  className="h-full flex items-center px-3 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-[#003820] dark:hover:text-[#95d4ac] transition-colors whitespace-nowrap"
                >
                  {page.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* C. Right Promotional Hot Deals Link */}
          <Link
            href="/products?filter=hot-deals"
            className="flex items-center gap-1.5 text-xs font-extrabold text-[#fd651e] hover:text-[#a73a00] shrink-0 bg-[#fd651e]/10 dark:bg-[#fd651e]/15 px-3 py-1 rounded-full border border-[#fd651e]/20 transition-all hover:scale-105"
          >
            <Flame size={14} className="text-[#fd651e]" />
            <span>Daily Hot Deals</span>
          </Link>
        </div>
      </div>

      {/* 4. Responsive Mobile Drawer */}
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
