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

export default function Navbar() {
  const [cartItems, setCartItems] = useState([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { token, name } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (err) {
      console.error("Failed to clear cookie:", err);
    }
    dispatch(logout());
    router.push("/login");
  };
  useEffect(() => {
    function syncCart() {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        try {
          setCartItems(JSON.parse(storedCart));
        } catch (error) {
          console.error("Cart parsing error:", error);
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    }

    syncCart();
    window.addEventListener("storage", syncCart);
    window.addEventListener("cartUpdated", syncCart as EventListener);

    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener("cartUpdated", syncCart as EventListener);
    };
  }, []);

  const closeSheet = () => setIsSheetOpen(false);

  return (
    <div className="bg-white shadow-md sticky sm:top-0 -top-0.5 z-50 will-change-transform">
      <div className="py-1 md:pt-0.5"></div>

      {/* Main Header */}
      <div className="pt-1 pb-2">
        <Container>
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="shrink-0 block">
              {true ? (
                <div className="relative w-48 h-12 md:w-52 md:h-16">
                  <Image
                    src="/public/Dekora.png"
                    alt="Company Logo"
                    fill
                    priority
                    quality={100}
                    sizes="(max-width: 768px) 160px, 200px"
                    className="object-contain object-left"
                  />
                </div>
              ) : (
                <div className="relative w-48 h-12 md:w-52 md:h-16 bg-gray-200 rounded-lg overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
                </div>
              )}
            </Link>

            {/* Search Bar — Desktop */}
            <div className="hidden md:block">
              <NavbarSearch />
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4 space-x-3">
              {/* User Dropdown — Desktop Only */}
              <div className="relative group hidden md:flex items-center">
                {token && (
                  <button className="flex items-center justify-center gap-1.5 hover:text-primary transition">
                    <span className="text-base mt-2">{name}</span>
                    <div className="flex items-center">
                      <User size={24} />
                      <ChevronDown
                        size={14}
                        className="mt-0.5 transition-transform duration-200 group-hover:rotate-180"
                      />
                    </div>
                  </button>
                )}
                <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-gray-300 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-50">
                  <div className="absolute -top-2 right-3 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45" />
                  <div className="py-2 relative">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-150"
                    >
                      <User size={15} /> My Account
                    </Link>
                    <Link
                      href="/dashboard/my-orders"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-150"
                    >
                      <ShoppingBag size={15} /> My Orders
                    </Link>
                    <Link
                      href="/dashboard/wish-list"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-150"
                    >
                      <Heart size={15} /> Wishlist
                    </Link>
                    <Link
                      href="/dashboard/following-authors"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-150"
                    >
                      <GoPencil /> Author
                    </Link>
                    <div className="border-t border-gray-100 my-1" />
                    <Link
                      href="/dashboard/change-password"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-150"
                    >
                      <TbLockPassword size={18} /> Change Password
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-150"
                    >
                      <LuLogOut size={18} /> Logout
                    </button>
                  </div>
                </div>
              </div>

              {/* Wishlist */}
              <Link href="/dashboard/wish-list">
                <button className="relative cursor-pointer flex items-center gap-2 hover:text-primary transition">
                  <Heart className="md:w-6 md:h-6 w-5.5 h-5.5" />
                  <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                   0
                  </span>
                </button>
              </Link>

              {/* Cart */}
              <Link href="/cart">
                <button className="relative cursor-pointer flex items-center gap-2 hover:text-primary transition">
                  <ShoppingCart className="md:w-6 md:h-6 w-5.5 h-5.5" />
                  <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartItems.length > 0 ? cartItems.length : 0}
                  </span>
                </button>
              </Link>

              {/* Sign In — Desktop */}
              {!token && (
                <Link href="/login" className="hidden md:block">
                  <button className="flex whitespace-nowrap text-sm  bg-sky-500 text-white items-center gap-2  px-3 py-2 hover:bg-sky-600 active:bg-sky-700 rounded-sm transition duration-300 cursor-pointer font-semibold lg:ml-3">
                    Sign In
                  </button>
                </Link>
              )}

              {/* ─── Mobile  */}
              <div className="md:hidden">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <button
                      aria-label="Open menu"
                      className="p-2 rounded-md hover:bg-gray-100 transition"
                    >
                      <Menu size={24} />
                    </button>
                  </SheetTrigger>

                  <SheetContent
                    side="left"
                    className="w-72 p-0 flex flex-col h-full bg-white"
                  >
                    <SheetHeader className="px-5 pt-5 pb-3 border-b">
                      <SheetTitle className="text-left">
                        <Link href="/" className="shrink-0 block" onClick={closeSheet}>
                          {true ? (
                            <div className="relative w-40 h-10">
                              <Image
                                src="/public/Dekora.png"
                                alt="Company Logo"
                                fill
                                sizes="160px"
                                className="object-contain object-left"
                              />
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-gray-800">Menu</span>
                          )}
                        </Link>
                      </SheetTitle>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto">
                      {/* Navigation Links */}
                      <div className="pl-4 py-1 border-b">
                        <p className="text-sm font-semibold text-sky-600 uppercase tracking-wider mb-2 mt-2">
                          Categories
                        </p>
                        <div>
                          <NavLinks closeSheet={closeSheet} />
                        </div>
                      </div>

                      {/* Account Section */}
                      {token ? (
                        <div className="px-3 py-3 border-b mt-2">
                          <p className="text-sm font-semibold text-sky-600 uppercase tracking-wider px-2 mb-2">
                            My Account
                          </p>
                          <Link
                            href="/dashboard"
                            onClick={closeSheet}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-900 hover:bg-gray-100 transition"
                          >
                            <User size={16} /> My Account
                          </Link>
                          <Link
                            href="/dashboard/my-orders"
                            onClick={closeSheet}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-900 hover:bg-gray-100 transition"
                          >
                            <ShoppingBag size={16} /> My Orders
                          </Link>
                          <Link
                            href="/dashboard/wish-list"
                            onClick={closeSheet}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-900 hover:bg-gray-100 transition"
                          >
                            <Heart size={16} /> Wishlist
                          </Link>
                          <Link
                            href="/dashboard/following-authors"
                            onClick={closeSheet}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-900 hover:bg-gray-100 transition"
                          >
                            <GoPencil size={16} /> Following Authors
                          </Link>
                          <Link
                            href="/dashboard/change-password"
                            onClick={closeSheet}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-900 hover:bg-gray-100 transition"
                          >
                            <TbLockPassword size={16} /> Change Password
                          </Link>
                        </div>
                      ) : (
                        <div className="px-5 py-4 border-b">
                          <Link href="/login" onClick={closeSheet}>
                            <button className="w-full bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium py-2.5 rounded-lg hover:opacity-90 transition">
                              Sign In
                            </button>
                          </Link>
                        </div>
                      )}
                    </div>

                    {token && (
                      <div className="px-5 py-4 border-t mt-auto">
                        <button
                          onClick={() => {
                            handleLogout();
                            closeSheet();
                          }}
                          className="flex w-full items-center justify-center gap-2 text-sm text-red-600 hover:bg-red-50 py-2.5 rounded-lg transition font-medium"
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

      {/* Desktop Navigation */}
      <nav className="border-t bg-secondary hidden md:block">
        <Container>
          <NavLinks />
        </Container>
      </nav>
    </div>
  );
}
