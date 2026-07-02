"use client";

import { useGetMenuCategoryQuery, useGetNavbarPagesQuery } from "@/redux/features/home/homeApi";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export interface MenuItem {
  _id: string;
  name: string;
  slug: string;
  level: number;
  parentCategory?: string | null;
  children?: MenuItem[];
  subchildren?: MenuItem[];
}

function NavLinks({ closeSheet }: { closeSheet?: () => void }) {
  const { data: navLinks } = useGetMenuCategoryQuery(undefined);
  const { data: pagesRes } = useGetNavbarPagesQuery(undefined);
  const menus = navLinks?.data || [];
  const navPages = pagesRes?.data || [];
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="w-full">
      <ul className="flex flex-col md:flex-row md:items-center md:justify-center md:gap-6 py-3">
        {menus.map((menu: MenuItem) => {
          const hasChildren =
            menu.children &&
            menu.children.length > 0;
          const isExpanded = expandedId === menu._id;

          return (
            <li key={menu._id} className="relative group flex flex-col md:flex-row md:items-center h-full">
              <div className="flex items-center justify-between md:justify-start gap-1 py-2 md:py-4 md:h-full">
                <Link
                  href={`/products?category=${menu.slug}`}
                  onClick={closeSheet}
                  className="flex-1 md:flex-none md:text-sm uppercase font-semibold text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-[#5f5eff] transition-colors cursor-pointer"
                >
                  {menu.name}
                </Link>
                {hasChildren && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setExpandedId(isExpanded ? null : menu._id);
                    }}
                    className="p-2 md:p-0 text-slate-500 hover:text-primary dark:hover:text-[#5f5eff] transition-colors md:hidden"
                  >
                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>
                )}
                {/* Desktop Chevron */}
                {hasChildren && (
                  <ChevronDown
                    size={16}
                    className="hidden md:block transition-transform duration-300 group-hover:-rotate-180 text-slate-600 dark:text-slate-350"
                  />
                )}
              </div>

              {/* Desktop Subcategory Dropdown (Mega Menu Style) */}
              {hasChildren && (
                <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200 ease-out z-50">
                  <div className="bg-white dark:bg-[#131424] rounded-2xl border border-slate-100 dark:border-slate-800/80 p-8 flex flex-row gap-16 w-max max-w-[90vw] shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                    {menu.children!.map(
                      (child: MenuItem) => {
                        const hasSubChildren =
                          child.children &&
                          child.children.length > 0;

                        return (
                          <div key={child._id} className="flex flex-col min-w-[150px]">
                            <Link
                              href={`/products?category=${child.slug}`}
                              onClick={closeSheet}
                              className={`transition-colors block ${
                                hasSubChildren
                                  ? "mb-4 text-primary dark:text-[#5f5eff] font-bold uppercase tracking-wider text-[13px]"
                                  : "text-[14px] font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-[#5f5eff] py-0.5"
                              }`}
                            >
                              {child.name}
                            </Link>

                            {hasSubChildren && (
                              <ul className="flex flex-col space-y-3">
                                {child.children!.map(
                                  (subChild: MenuItem) => (
                                    <li key={subChild._id}>
                                      <Link
                                        href={`/products?category=${subChild.slug}`}
                                        onClick={closeSheet}
                                        className="text-[14px] font-medium text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-[#5f5eff] transition-colors block py-0.5"
                                      >
                                        {subChild.name}
                                      </Link>
                                    </li>
                                  )
                                )}
                              </ul>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

              {/* Mobile Subcategory Dropdown */}
              {hasChildren && (
                <div className={`md:hidden overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-[2000px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
                  <div className="pl-4 pb-2 space-y-5 border-l-2 border-slate-100 dark:border-slate-800 mb-2">
                    {menu.children!.map(
                      (child: MenuItem) => {
                        const hasSubChildren =
                          child.children &&
                          child.children.length > 0;

                        return (
                          <div key={child._id} className="flex flex-col">
                            <Link
                              href={`/products?category=${child.slug}`}
                              onClick={closeSheet}
                              className={`block transition-colors ${
                                hasSubChildren
                                  ? "text-primary dark:text-[#5f5eff] font-bold uppercase tracking-wide text-xs mb-2"
                                  : "text-sm text-slate-650 dark:text-slate-300 hover:text-primary dark:hover:text-[#5f5eff] font-medium py-1"
                              }`}
                            >
                              {child.name}
                            </Link>

                            {hasSubChildren && (
                              <ul className="pl-3 space-y-3 border-l border-slate-100 dark:border-slate-800">
                                {child.children!.map(
                                  (subChild: MenuItem) => (
                                    <li key={subChild._id}>
                                      <Link
                                        href={`/products?category=${subChild.slug}`}
                                        onClick={closeSheet}
                                        className="block text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-[#5f5eff] font-medium"
                                      >
                                        {subChild.name}
                                      </Link>
                                    </li>
                                  )
                                )}
                              </ul>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
            </li>
          );
        })}
        
        {/* Dynamic Pages */}
        {navPages.map((page: any) => (
          <li key={page._id} className="relative group flex flex-col md:flex-row md:items-center h-full">
            <div className="flex items-center justify-between md:justify-start gap-1 py-2 md:py-4 md:h-full">
              <Link
                href={`/${page.slug}`}
                onClick={closeSheet}
                className="flex-1 md:flex-none md:text-sm uppercase font-semibold text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-[#5f5eff] transition-colors cursor-pointer"
              >
                {page.title}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NavLinks;
