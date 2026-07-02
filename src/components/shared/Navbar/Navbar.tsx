"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  User,
  Menu,
  Heart,
  ChevronDown,
  ShoppingBag,
  Settings,
  Sun,
  Moon,
} from "lucide-react";
import { GoPencil } from "react-icons/go";
import { TbLockPassword } from "react-icons/tb";
import { LuLogOut } from "react-icons/lu";
import NavbarSearch from "./NavSearch";
import NavLinks from "./NavLinks";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Container from "../Container";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import { useGetWishListQuery } from "@/redux/features/wishList/wishListApi";
import { useGetMyCartQuery } from "@/redux/features/cart/cartApi";

export default function Navbar() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { token, name, customerType } = useAppSelector((state) => state.auth);

  const { data: dbCartResponse } = useGetMyCartQuery(undefined, { skip: !token });
  const cartCount = dbCartResponse?.data?.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;

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
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (newTheme === "dark") {
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
    } catch (err) {
      console.error("Failed to clear cookie:", err);
    }
    dispatch(logout());
    router.push("/login");
  };

  const closeSheet = () => setIsSheetOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#0B0B14]/95 border-b border-slate-100 dark:border-slate-900 backdrop-blur-md transition-colors duration-300 shadow-sm dark:shadow-none">
      <div className="py-1"></div>

      {/* Main Header */}
      <div className="py-2.5">
        <Container>
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="shrink-0 block">
              <div className="relative w-44 h-11 md:w-48 md:h-12">
                <Image
                  src="/Dekora.png"
                  alt="Company Logo"
                  fill
                  priority
                  quality={100}
                  sizes="(max-width: 768px) 160px, 200px"
                  className="object-contain object-left dark:invert dark:brightness-200 transition-all duration-300"
                />
              </div>
            </Link>

            {/* Search Bar — Desktop */}
            <div className="hidden md:block">
              <NavbarSearch />
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-2 text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-[#5f5eff] transition rounded-full hover:bg-slate-50 dark:hover:bg-[#151522] cursor-pointer"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* User Dropdown — Desktop Only */}
              <div className="relative group hidden md:flex items-center">
                {token ? (
                  <button className="flex items-center gap-2 hover:text-primary dark:hover:text-[#5f5eff] text-slate-700 dark:text-slate-200 transition py-1 cursor-pointer">
                    <span className="text-sm font-semibold max-w-[100px] truncate">{name}</span>
                    <div className="relative w-8 h-8 rounded-full border-2 border-[#ffb800] p-[1px] flex items-center justify-center overflow-hidden bg-slate-100 dark:bg-[#151522]">
                      <User size={16} className="text-slate-500 dark:text-slate-400" />
                    </div>
                    <ChevronDown
                      size={14}
                      className="transition-transform duration-200 group-hover:rotate-180"
                    />
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-2 hover:text-primary dark:hover:text-[#5f5eff] text-slate-700 dark:text-slate-200 transition py-1 cursor-pointer"
                  >
                    <span className="text-sm font-semibold">Login</span>
                    <div className="relative w-8 h-8 rounded-full border-2 border-[#ffb800] p-[1px] flex items-center justify-center bg-slate-100 dark:bg-[#151522] transition-colors group-hover:border-primary dark:group-hover:border-[#5f5eff]">
                      <User size={16} className="text-slate-500 dark:text-slate-400" />
                    </div>
                  </Link>
                )}
                {token && (
                  <div className="absolute top-full right-0 mt-2 w-52 bg-white dark:bg-[#111222] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-50">
                    <div className="absolute -top-2 right-3 w-4 h-4 bg-white dark:bg-[#111222] border-l border-t border-slate-200 dark:border-slate-800 rotate-45" />
                    <div className="py-2 relative">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-750 dark:text-slate-305 hover:bg-slate-50 dark:hover:bg-[#181829] hover:text-black dark:hover:text-white transition-colors duration-150"
                      >
                        <User size={15} /> My Account
                      </Link>
                      <Link
                        href="/dashboard/my-orders"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-755 dark:text-slate-310 hover:bg-slate-50 dark:hover:bg-[#181829] hover:text-black dark:hover:text-white transition-colors duration-150"
                      >
                        <ShoppingBag size={15} /> My Orders
                      </Link>
                      <Link
                        href="/dashboard/wish-list"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-760 dark:text-slate-315 hover:bg-slate-50 dark:hover:bg-[#181829] hover:text-black dark:hover:text-white transition-colors duration-150"
                      >
                        <Heart size={15} /> Wishlist
                      </Link>
                      <Link
                        href="/dashboard/following-authors"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-765 dark:text-slate-320 hover:bg-slate-50 dark:hover:bg-[#181829] hover:text-black dark:hover:text-white transition-colors duration-150"
                      >
                        <GoPencil /> Author
                      </Link>
                      {(customerType === "admin" || customerType === "superadmin" || customerType === "supperadmin") && (
                        <Link
                          href="/dashboard/theme-settings"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-770 dark:text-slate-325 hover:bg-slate-50 dark:hover:bg-[#181829] hover:text-black dark:hover:text-white transition-colors duration-150"
                        >
                          <Settings size={15} /> Theme Settings
                        </Link>
                      )}
                      <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                      <Link
                        href="/dashboard/change-password"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-775 dark:text-slate-330 hover:bg-slate-50 dark:hover:bg-[#181829] hover:text-black dark:hover:text-white transition-colors duration-150"
                      >
                        <TbLockPassword size={18} /> Change Password
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-780 dark:text-slate-335 hover:bg-slate-50 dark:hover:bg-[#181829] hover:text-black dark:hover:text-white transition-colors duration-150 cursor-pointer"
                      >
                        <LuLogOut size={18} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link href="/wishlist">
                <button className="relative cursor-pointer flex items-center justify-center p-2 text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-[#5f5eff] transition rounded-full hover:bg-slate-50 dark:hover:bg-[#151522]">
                  <Heart size={20} className="stroke-[2px]" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-650 text-white text-[10px] rounded-full w-4.5 h-4.5 flex items-center justify-center font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </button>
              </Link>

              {/* Cart */}
              <Link href="/cart">
                <button className="relative cursor-pointer flex items-center justify-center p-2 text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-[#5f5eff] transition rounded-full hover:bg-slate-50 dark:hover:bg-[#151522]">
                  <ShoppingCart size={20} className="stroke-[2px]" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary dark:bg-[#5f5eff] text-white text-[10px] rounded-full w-4.5 h-4.5 flex items-center justify-center font-bold transition-colors">
                      {cartCount}
                    </span>
                  )}
                </button>
              </Link>

              {/* Mobile Menu Trigger */}
              <div className="md:hidden">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <button
                      aria-label="Open menu"
                      className="p-2 rounded-full hover:bg-slate-50 dark:hover:bg-[#151522] text-slate-700 dark:text-slate-200 transition cursor-pointer"
                    >
                      <Menu size={24} />
                    </button>
                  </SheetTrigger>

                  <SheetContent
                    side="left"
                    className="w-72 p-0 flex flex-col h-full bg-white dark:bg-[#0B0B14] border-r border-slate-200 dark:border-slate-900"
                  >
                    <SheetHeader className="px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-900">
                      <SheetTitle className="text-left">
                        <Link href="/" className="shrink-0 block" onClick={closeSheet}>
                          <div className="relative w-36 h-9">
                            <Image
                              src="/Dekora.png"
                              alt="Company Logo"
                              fill
                              sizes="140px"
                              className="object-contain object-left dark:invert dark:brightness-200"
                            />
                          </div>
                        </Link>
                      </SheetTitle>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto">
                      {/* Navigation Links */}
                      <div className="pl-4 py-1 border-b border-slate-100 dark:border-slate-900">
                        <p className="text-xs font-semibold text-primary dark:text-[#5f5eff] uppercase tracking-wider mb-2 mt-2">
                          Categories
                        </p>
                        <div>
                          <NavLinks closeSheet={closeSheet} />
                        </div>
                      </div>

                      {/* Account Section */}
                      {token ? (
                        <div className="px-3 py-3 border-b border-slate-100 dark:border-slate-900 mt-2">
                          <p className="text-xs font-semibold text-primary dark:text-[#5f5eff] uppercase tracking-wider px-2 mb-2">
                            My Account
                          </p>
                          <Link
                            href="/dashboard"
                            onClick={closeSheet}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-750 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#181829] transition"
                          >
                            <User size={16} /> My Account
                          </Link>
                          <Link
                            href="/dashboard/my-orders"
                            onClick={closeSheet}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-755 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#181829] transition"
                          >
                            <ShoppingBag size={16} /> My Orders
                          </Link>
                          <Link
                            href="/dashboard/wish-list"
                            onClick={closeSheet}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-760 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#181829] transition"
                          >
                            <Heart size={16} /> Wishlist
                          </Link>
                          <Link
                            href="/dashboard/following-authors"
                            onClick={closeSheet}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-765 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#181829] transition"
                          >
                            <GoPencil size={16} /> Following Authors
                          </Link>
                          {(customerType === "admin" || customerType === "superadmin" || customerType === "supperadmin") && (
                            <Link
                              href="/dashboard/theme-settings"
                              onClick={closeSheet}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-770 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#181829] transition"
                            >
                              <Settings size={16} /> Theme Settings
                            </Link>
                          )}
                          <Link
                            href="/dashboard/change-password"
                            onClick={closeSheet}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-775 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#181829] transition"
                          >
                            <TbLockPassword size={16} /> Change Password
                          </Link>
                        </div>
                      ) : (
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-900">
                          <Link href="/login" onClick={closeSheet}>
                            <button className="w-full bg-primary dark:bg-[#5f5eff] hover:bg-primary-hover dark:hover:bg-[#4d4cff] text-white text-sm font-medium py-2.5 rounded-lg transition cursor-pointer">
                              Sign In
                            </button>
                          </Link>
                        </div>
                      )}
                    </div>

                    {token && (
                      <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-900 mt-auto">
                        <button
                          onClick={() => {
                            handleLogout();
                            closeSheet();
                          }}
                          className="flex w-full items-center justify-center gap-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 py-2.5 rounded-lg transition font-medium cursor-pointer"
                        >
                          <LuLogOut size={18} /> Logout
                        </button>
                      </div>
                    )}
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </Container>

        {/* Mobile Search */}
        <Container>
          <div className="mt-2 pb-1 md:hidden px-3">
            <NavbarSearch />
          </div>
        </Container>
      </div>

      {/* Desktop Navigation Links Row */}
      <nav className="border-t border-slate-100 dark:border-slate-900/60 bg-slate-50/50 dark:bg-[#0c0c16]/50 hidden md:block transition-colors duration-300">
        <Container>
          <NavLinks />
        </Container>
      </nav>
    </header>
  );
}
