"use client";

import { useGetMenuCategoryQuery } from "@/redux/features/home/homeApi";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export interface MenuItem {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  mega_menu: "Yes" | "No";
  serial_no: number;
  child_categories_show_on_menu: MenuItem[];
}

function NavLinks({ closeSheet }: { closeSheet?: () => void }) {
  const { data: navLinks } = useGetMenuCategoryQuery(undefined);
  const menus = navLinks?.data?.menus || [];
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="w-full">
      <ul className="flex flex-col md:flex-row md:items-center md:justify-center md:gap-6 py-3">
        {menus.map((menu: MenuItem) => {
          const hasChildren =
            menu.child_categories_show_on_menu &&
            menu.child_categories_show_on_menu.length > 0;
          const isExpanded = expandedId === menu.id;

          return (
            <li key={menu.id} className="relative group flex flex-col md:flex-row md:items-center h-full">
              <div className="flex items-center justify-between md:justify-start gap-1 py-2 md:py-4 md:h-full">
                <Link
                  href={`/books?category=${menu.slug}`}
                  onClick={closeSheet}
                  className="flex-1 md:flex-none md:text-sm uppercase hover:text-[#21b4f8] font-semibold text-gray-800 transition-colors cursor-pointer"
                >
                  {menu.name}
                </Link>
                {hasChildren && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setExpandedId(isExpanded ? null : menu.id);
                    }}
                    className="p-2 md:p-0 text-gray-600 hover:text-purple-700 transition-colors md:hidden"
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
                    className="hidden md:block transition-transform duration-300 group-hover:-rotate-180 text-gray-800"
                  />
                )}
              </div>

              {/* Desktop Subcategory Dropdown (Dekora Style) */}
              {hasChildren && (
                <div className="hidden md:block absolute left-0 top-[80%] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="bg-white rounded-b-xl shadow-lg border-t border-gray-100 p-6 flex flex-wrap gap-x-16 gap-y-8 min-w-[500px] rounded-md">
                    {menu.child_categories_show_on_menu.map(
                      (child: MenuItem) => {
                        const hasSubChildren =
                          child.child_categories_show_on_menu &&
                          child.child_categories_show_on_menu.length > 0;

                        return (
                          <div key={child.id} className="flex flex-col min-w-[140px]">
                            <Link
                              href={`/books?category=${child.slug}`}
                              onClick={closeSheet}
                              className={`mb-4 transition-colors block ${
                                hasSubChildren
                                  ? "text-[#00A6F4] font-semibold uppercase tracking-wide text-base"
                                  : "text-[15px] font-medium text-gray-600 hover:text-purple-700"
                              }`}
                            >
                              {child.name}
                            </Link>

                            {hasSubChildren && (
                              <ul className="flex flex-col space-y-3">
                                {child.child_categories_show_on_menu.map(
                                  (subChild: MenuItem) => (
                                    <li key={subChild.id}>
                                      <Link
                                        href={`/books?category=${subChild.slug}`}
                                        onClick={closeSheet}
                                        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
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
                  <div className="pl-4 pb-2 space-y-5 border-l-2 border-gray-100 mb-2">
                    {menu.child_categories_show_on_menu.map(
                      (child: MenuItem) => {
                        const hasSubChildren =
                          child.child_categories_show_on_menu &&
                          child.child_categories_show_on_menu.length > 0;

                        return (
                          <div key={child.id} className="flex flex-col">
                            <Link
                              href={`/books?category=${child.slug}`}
                              onClick={closeSheet}
                              className={`block transition-colors ${
                                hasSubChildren
                                  ? "text-purple-800 font-bold uppercase tracking-wide text-xs mb-2"
                                  : "text-sm text-gray-600 hover:text-purple-700 font-medium py-1"
                              }`}
                            >
                              {child.name}
                            </Link>

                            {hasSubChildren && (
                              <ul className="pl-3 space-y-3 border-l border-gray-100">
                                {child.child_categories_show_on_menu.map(
                                  (subChild: MenuItem) => (
                                    <li key={subChild.id}>
                                      <Link
                                        href={`/books?category=${subChild.slug}`}
                                        onClick={closeSheet}
                                        className="block text-sm text-gray-500 hover:text-purple-700 font-medium"
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
      </ul>
    </div>
  );
}

export default NavLinks;
