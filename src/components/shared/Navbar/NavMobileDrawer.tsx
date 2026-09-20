"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useGetMenuCategoryQuery, useGetNavbarPagesQuery } from "@/redux/features/home/homeApi";
import { 
  ChevronDown, 
  Layers, 
  ShoppingBag, 
  Home, 
  Store, 
  Heart, 
  User, 
  PhoneCall, 
  LogOut, 
  Sparkles, 
  Flame,
  ArrowRight
} from "lucide-react";

interface MenuItem {
  _id: string;
  name: string;
  slug: string;
  level?: number;
  image?: string;
  children?: MenuItem[];
}

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
  const { data: menuCategoryRes, isLoading: isCatsLoading } = useGetMenuCategoryQuery(undefined);
  const { data: pagesRes } = useGetNavbarPagesQuery(undefined);

  const categories: MenuItem[] = menuCategoryRes?.data || [];
  const navPages = pagesRes?.data || [];

  // Expanded categories accordion state (can expand multiple or single)
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<"categories" | "menu">("categories");

  const toggleCat = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedCats((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="left"
        className="w-[310px] sm:w-[380px] p-0 bg-white dark:bg-[#0f101a] border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between overflow-hidden shadow-2xl"
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* 1. Header with User Profile */}
          <SheetHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-r from-emerald-950 via-[#003820] to-[#004d2c] text-white shrink-0">
            <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center font-black text-sm shadow-inner backdrop-blur-xs">
                  {name ? name.slice(0, 2).toUpperCase() : <User size={20} />}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-extrabold text-sm text-white tracking-tight leading-tight">
                    {name || "Welcome, Guest"}
                  </span>
                  <Link
                    href={token ? "/dashboard" : "/login"}
                    onClick={onClose}
                    className="text-[11px] text-emerald-300 font-medium hover:underline mt-0.5 flex items-center gap-1"
                  >
                    <span>{token ? "Account Dashboard" : "Log In or Register"}</span>
                    <ArrowRight size={10} />
                  </Link>
                </div>
              </div>
            </div>

            {/* 2. Top Navigation Tabs: Categories vs Main Menu */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/20 rounded-xl mt-3.5 backdrop-blur-xs border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab("categories")}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "categories"
                    ? "bg-white text-[#003820] shadow-sm font-extrabold"
                    : "text-emerald-100/80 hover:text-white hover:bg-white/5"
                }`}
              >
                <Layers size={13} />
                <span>Categories</span>
                {categories.length > 0 && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                      activeTab === "categories"
                        ? "bg-[#003820] text-white"
                        : "bg-white/20 text-white"
                    }`}
                  >
                    {categories.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("menu")}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "menu"
                    ? "bg-white text-[#003820] shadow-sm font-extrabold"
                    : "text-emerald-100/80 hover:text-white hover:bg-white/5"
                }`}
              >
                <Store size={13} />
                <span>Quick Menu</span>
              </button>
            </div>
          </SheetHeader>

          {/* 3. Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
            {activeTab === "categories" ? (
              <div className="space-y-1">
                {/* View All Categories Link */}
                <Link
                  href="/products"
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-100/80 dark:hover:bg-emerald-900/40 transition-colors mb-2"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400" />
                    <span>Explore All Products</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                    Shop
                  </span>
                </Link>

                {/* Loading skeleton */}
                {isCatsLoading && (
                  <div className="space-y-2 py-2">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="h-11 rounded-xl bg-slate-100 dark:bg-slate-850 animate-pulse"
                      />
                    ))}
                  </div>
                )}

                {/* Categories List with Nested Subcategories Accordion */}
                {!isCatsLoading && categories.length > 0 ? (
                  categories.map((cat) => {
                    const hasChildren = Array.isArray(cat.children) && cat.children.length > 0;
                    const isExpanded = !!expandedCats[cat._id];
                    const categoryHref = `/products?category=${encodeURIComponent(cat.slug || cat.name)}`;

                    return (
                      <div
                        key={cat._id}
                        className="rounded-xl border border-slate-100 dark:border-slate-800/80 overflow-hidden bg-slate-50/50 dark:bg-slate-900/30 transition-all duration-200"
                      >
                        {/* Parent Category Row */}
                        <div className="flex items-center justify-between p-2.5 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors">
                          <Link
                            href={categoryHref}
                            onClick={onClose}
                            className="flex items-center gap-2.5 flex-1 min-w-0 font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                          >
                            <span className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0 shadow-2xs">
                              <Layers size={14} />
                            </span>
                            <span className="truncate">{cat.name}</span>
                          </Link>

                          {/* Subcategory toggle button */}
                          {hasChildren && (
                            <button
                              type="button"
                              onClick={(e) => toggleCat(cat._id, e)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-slate-800 transition-all ml-1 cursor-pointer flex items-center gap-1"
                              aria-label={`Toggle subcategories for ${cat.name}`}
                            >
                              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                                {cat.children!.length}
                              </span>
                              <ChevronDown
                                size={16}
                                className={`transition-transform duration-300 ${
                                  isExpanded ? "rotate-180 text-emerald-600 dark:text-emerald-400" : ""
                                }`}
                              />
                            </button>
                          )}
                        </div>

                        {/* Nested Subcategories */}
                        {hasChildren && isExpanded && (
                          <div className="bg-white dark:bg-[#0b0c14] border-t border-slate-100 dark:border-slate-800 px-3 py-2 space-y-1.5 animate-fade-in">
                            {cat.children!.map((subCat) => {
                              const hasSubChildren =
                                Array.isArray(subCat.children) && subCat.children.length > 0;
                              const isSubExpanded = !!expandedCats[subCat._id];
                              const subHref = `/products?category=${encodeURIComponent(subCat.slug || subCat.name)}`;

                              return (
                                <div key={subCat._id} className="space-y-1">
                                  <div className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <Link
                                      href={subHref}
                                      onClick={onClose}
                                      className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-2 flex-1 truncate"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                      <span className="truncate">{subCat.name}</span>
                                    </Link>

                                    {hasSubChildren && (
                                      <button
                                        type="button"
                                        onClick={(e) => toggleCat(subCat._id, e)}
                                        className="p-1 text-slate-400 hover:text-emerald-500 transition-colors"
                                      >
                                        <ChevronDown
                                          size={13}
                                          className={`transition-transform duration-200 ${
                                            isSubExpanded ? "rotate-180" : ""
                                          }`}
                                        />
                                      </button>
                                    )}
                                  </div>

                                  {/* Level 3 items */}
                                  {hasSubChildren && isSubExpanded && (
                                    <div className="pl-6 space-y-1 border-l border-slate-200 dark:border-slate-800 ml-3 py-1">
                                      {subCat.children!.map((level3) => (
                                        <Link
                                          key={level3._id}
                                          href={`/products?category=${encodeURIComponent(level3.slug || level3.name)}`}
                                          onClick={onClose}
                                          className="block py-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 truncate"
                                        >
                                          {level3.name}
                                        </Link>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  !isCatsLoading && (
                    <div className="text-center py-6 text-slate-400 text-xs font-medium">
                      No categories found.
                    </div>
                  )
                )}
              </div>
            ) : (
              /* Quick Menu Tab */
              <div className="space-y-1.5">
                <Link
                  href="/"
                  onClick={onClose}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400 font-bold text-xs transition-colors"
                >
                  <Home size={16} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Home Page</span>
                </Link>

                <Link
                  href="/products"
                  onClick={onClose}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400 font-bold text-xs transition-colors"
                >
                  <Store size={16} className="text-emerald-600 dark:text-emerald-400" />
                  <span>All Products Store</span>
                </Link>

                <Link
                  href="/products?filter=hot-deals"
                  onClick={onClose}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs transition-colors"
                >
                  <Flame size={16} className="text-amber-500" />
                  <span>Daily Hot Deals</span>
                </Link>

                <Link
                  href="/wishlist"
                  onClick={onClose}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400 font-bold text-xs transition-colors"
                >
                  <Heart size={16} className="text-emerald-600 dark:text-emerald-400" />
                  <span>My Wishlist</span>
                </Link>

                <Link
                  href={token ? "/dashboard?tab=orders" : "/login"}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400 font-bold text-xs transition-colors"
                >
                  <ShoppingBag size={16} className="text-emerald-600 dark:text-emerald-400" />
                  <span>Track My Orders</span>
                </Link>

                {/* Custom Dynamic Pages */}
                {navPages.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 block">
                      Information
                    </span>
                    {navPages.map((page: any) => (
                      <Link
                        key={page._id}
                        href={`/${page.slug}`}
                        onClick={onClose}
                        className="block px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                      >
                        {page.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 4. Drawer Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-[#0b0c14] space-y-3 shrink-0">
            {/* Customer Hotline Help */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[#003820] dark:text-emerald-400 flex items-center justify-center shrink-0">
                <PhoneCall size={15} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  24/7 Helpline
                </span>
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 truncate">
                  09612-GHORBZ
                </span>
              </div>
            </div>

            {/* Logout button if authenticated */}
            {token && (
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-bold text-xs transition-colors cursor-pointer border border-red-200/50 dark:border-red-900/50"
              >
                <LogOut size={14} />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NavMobileDrawer;
