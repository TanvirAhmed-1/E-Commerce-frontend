"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
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
  ChevronLeft,
  ChevronRight,
  Layers, 
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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const navScrollRef = useRef<HTMLDivElement>(null);

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

  const checkScroll = useCallback(() => {
    const el = navScrollRef.current;
    if (el) {
      const hasOverflow = el.scrollWidth > el.clientWidth + 2;
      setCanScrollLeft(el.scrollLeft > 8);
      setCanScrollRight(hasOverflow && el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    const timer = setTimeout(checkScroll, 100);
    window.addEventListener("resize", checkScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkScroll);
    };
  }, [navCategories, navPages, checkScroll]);

  const handleScroll = (direction: "left" | "right") => {
    const el = navScrollRef.current;
    if (el) {
      const scrollAmount = direction === "left" ? -280 : 280;
      el.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = navScrollRef.current;
    if (el && el.scrollWidth > el.clientWidth) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY;
      }
    }
  };

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
        <div className="flex items-center gap-5 shrink-0">
          {/* Track Order */}
          <Link
            href="/dashboard?tab=orders"
            className="hidden sm:flex flex-col items-center group text-slate-600 dark:text-slate-400 hover:text-[#003820] dark:hover:text-[#95d4ac] transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">local_shipping</span>
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

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex flex-col items-center group text-slate-600 dark:text-slate-400 hover:text-[#003820] dark:hover:text-[#95d4ac] transition-colors"
          >
            <div className="relative">
              <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#fd651e] text-white text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold mt-0.5 hidden sm:inline">Cart</span>
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

      {/* 3. Bottom Category Navigation Row with Horizontal Scroll */}
      <div className="hidden md:block bg-[#f8f9ff] dark:bg-[#09090e] border-t border-slate-200/70 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-11 flex items-center gap-3">
          {/* A. "All Categories" Mega Menu Dropdown (Fixed on Left) */}
          <div className="relative group h-full shrink-0 z-20">
            <Link
              href="/products"
              className="flex items-center gap-2 bg-[#003820] hover:bg-[#004d2c] text-white px-4 h-full text-xs font-bold shrink-0 transition-colors cursor-pointer select-none rounded-t-sm"
            >
              <Layers size={15} />
              <span>All Categories</span>
              <ChevronDown size={14} className="transition-transform duration-300 group-hover:rotate-180" />
            </Link>

            {/* All Categories Mega Dropdown Menu */}
            {navCategories.length > 0 && (
              <div className="absolute left-0 top-full pt-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out z-50 pointer-events-none group-hover:pointer-events-auto">
                <div className="bg-white dark:bg-[#121320] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-5 w-[650px] max-w-[85vw] max-h-[500px] overflow-y-auto custom-scrollbar">
                  {/* Top Bar with All Products Link */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-150 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Categories
                    </span>
                    <Link
                      href="/products"
                      className="text-xs font-bold text-[#003820] dark:text-[#95d4ac] hover:underline flex items-center gap-1.5"
                    >
                      <span>View All Products</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>

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

          {/* B. Dynamic Horizontal Scrollable Category & Page Strip */}
          <div className="relative flex-1 min-w-0 h-full flex items-center overflow-hidden">
            {/* Scroll Left Button */}
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center pr-3 bg-gradient-to-r from-[#f8f9ff] via-[#f8f9ff]/95 to-transparent dark:from-[#09090e] dark:via-[#09090e]/95">
                <button
                  type="button"
                  onClick={() => handleScroll("left")}
                  className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-[#003820] dark:hover:text-white hover:bg-slate-50 transition-all cursor-pointer"
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={14} />
                </button>
              </div>
            )}

            {/* Scrollable Category Nav */}
            <div
              ref={navScrollRef}
              onScroll={checkScroll}
              onWheel={handleWheel}
              className="flex items-center gap-1 h-full w-full overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-1"
            >
              {navCategories.map((cat) => {
                const parentHref = `/products?category=${encodeURIComponent(cat.slug || cat.name)}`;
                return (
                  <Link
                    key={cat._id}
                    href={parentHref}
                    className="h-full flex items-center px-3 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#003820] dark:hover:text-[#95d4ac] hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-xs transition-colors whitespace-nowrap shrink-0"
                  >
                    {cat.name}
                  </Link>
                );
              })}

              {/* Dynamic Pages */}
              {navPages.map((page: any) => (
                <Link
                  key={page._id}
                  href={`/${page.slug}`}
                  className="h-full flex items-center px-3 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-[#003820] dark:hover:text-[#95d4ac] hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-xs transition-colors whitespace-nowrap shrink-0"
                >
                  {page.title}
                </Link>
              ))}
            </div>

            {/* Scroll Right Button */}
            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center pl-3 bg-gradient-to-l from-[#f8f9ff] via-[#f8f9ff]/95 to-transparent dark:from-[#09090e] dark:via-[#09090e]/95">
                <button
                  type="button"
                  onClick={() => handleScroll("right")}
                  className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-[#003820] dark:hover:text-white hover:bg-slate-50 transition-all cursor-pointer"
                  aria-label="Scroll right"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
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
