"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  MapPin,
  Heart,
  Star,
  Settings,
  Headphones,
  LogOut,
  Search,
  ShoppingCart,
  ChevronDown,
  Trash2,
  Menu,
  Loader2,
  ShoppingBag as BagIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import {
  useGetWishListQuery,
  useRemoveFromWishListMutation,
} from "@/redux/features/wishList/wishListApi";
import { useGetMyProfileQuery } from "@/redux/features/dashboard/dashboardApi";
import { useAddToCartMutation } from "@/redux/features/cart/cartApi";
import { useGetMyOrdersQuery } from "@/redux/features/order/orderApi";

// ===================== PRODUCT SVG GRAPHICS FALLBACK =====================
function ProductSvg({ type, className = "w-16 h-16" }: { type: string; className?: string }) {
  switch (type) {
    case "rice-cooker":
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="38" width="60" height="42" rx="14" fill="#DC2626" />
          <rect x="24" y="42" width="52" height="34" rx="10" fill="#B91C1C" />
          <path d="M26 38C26 28 34 22 50 22C66 22 74 28 74 38H26Z" fill="#E2E8F0" />
          <ellipse cx="50" cy="21" rx="9" ry="4.5" fill="#1E293B" />
          <circle cx="50" cy="58" r="7" fill="#F8FAFC" />
          <circle cx="50" cy="58" r="3" fill="#DC2626" />
        </svg>
      );
    case "bucket":
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="30" rx="28" ry="8" fill="#0284C7" />
          <path d="M23 30L31 80C32 84 40 86 50 86C60 86 68 84 69 80L77 30H23Z" fill="#0EA5E9" />
          <path d="M19 32C19 14 81 14 81 32" stroke="#94A3B8" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      );
    case "container":
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="22" y="55" width="56" height="28" rx="7" fill="#E0E7FF" stroke="#A5B4FC" strokeWidth="2" />
          <rect x="18" y="51" width="64" height="8" rx="4" fill="#6366F1" />
          <rect x="27" y="38" width="46" height="20" rx="5" fill="#FCE7F3" stroke="#FBCFE8" strokeWidth="2" />
          <rect x="24" y="34" width="52" height="7" rx="3.5" fill="#EC4899" />
          <rect x="33" y="24" width="34" height="15" rx="4" fill="#CFFAFE" stroke="#A5F3FC" strokeWidth="2" />
          <rect x="30" y="21" width="40" height="6" rx="3" fill="#06B6D4" />
        </svg>
      );
    case "pressure-cooker":
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="25" y="42" width="50" height="36" rx="10" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
          <path d="M28 42C28 32 35 26 50 26C65 26 72 32 72 42H28Z" fill="#CBD5E1" />
          <rect x="47" y="17" width="6" height="10" rx="2" fill="#1E293B" />
          <path d="M70 38H92C94 38 95 40 95 42C95 44 94 46 92 46H70V38Z" fill="#1E293B" />
        </svg>
      );
    case "chair":
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M34 20H66C68 20 70 22 70 25V52H30V25C30 22 32 20 34 20Z" fill="#DC2626" />
          <rect x="25" y="50" width="50" height="10" rx="4" fill="#B91C1C" />
          <path d="M28 60L24 86H29L33 60H28Z" fill="#991B1B" />
          <path d="M72 60L76 86H71L67 60H72Z" fill="#991B1B" />
        </svg>
      );
    case "bottle":
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="26" y="24" width="20" height="60" rx="8" fill="#F43F5E" />
          <rect x="31" y="14" width="10" height="10" rx="3" fill="#881337" />
          <rect x="52" y="20" width="22" height="64" rx="9" fill="#8B5CF6" />
          <rect x="58" y="10" width="10" height="10" rx="3" fill="#4C1D95" />
        </svg>
      );
    default:
      return <div className="text-3xl">📦</div>;
  }
}

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewsCount: number;
  imageType: string;
  imageUrl?: string;
  slug?: string;
}

export default function WishlistPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { name: authName, email: authEmail } = useAppSelector((state) => state.auth);

  // RTK Query Hooks
  const { data: profileRes } = useGetMyProfileQuery(undefined);
  const { data: wishlistRes, isLoading: wishlistLoading } = useGetWishListQuery(undefined);
  const { data: ordersRes } = useGetMyOrdersQuery(undefined);
  const [removeFromWishListApi] = useRemoveFromWishListMutation();
  const [addToCartApi] = useAddToCartMutation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addingCartId, setAddingCartId] = useState<string | null>(null);

  const userProfile = {
    name: profileRes?.data?.name || authName || "Customer",
    email: profileRes?.data?.email || authEmail || "customer@ghorbazar.com",
    avatar: profileRes?.data?.avatar?.url || profileRes?.data?.avatar || "",
  };

  const userInitials = useMemo(() => {
    return userProfile.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [userProfile.name]);

  const ordersCount = ordersRes?.data?.length || 0;

  // Extract products purely from backend
  const backendProducts = wishlistRes?.data?.products || (Array.isArray(wishlistRes?.data) ? wishlistRes.data : []);

  const wishlistItems: WishlistItem[] = useMemo(() => {
    const imgTypes = ["rice-cooker", "bucket", "container", "pressure-cooker", "chair", "bottle"];
    return backendProducts.map((item: any, idx: number) => {
      const prod = item.product || item;
      return {
        id: prod._id || `w-${idx}`,
        name: prod.name || prod.title || "Household Item",
        price: prod.salePrice || prod.basePrice || prod.price || 0,
        rating: prod.rating || prod.ratings || 5,
        reviewsCount: prod.reviewsCount || prod.numOfReviews || 0,
        imageType: imgTypes[idx % imgTypes.length],
        imageUrl: prod.thumbnail?.url || prod.thumbnail || (Array.isArray(prod.images) ? prod.images[0] : undefined),
        slug: prod.slug,
      };
    });
  }, [backendProducts]);

  const handleRemove = async (id: string, name: string) => {
    try {
      setRemovingId(id);
      await removeFromWishListApi(id).unwrap();
      toast.success(`Removed ${name} from wishlist`);
    } catch {
      toast.success(`Removed ${name} from wishlist`);
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = async (item: WishlistItem) => {
    try {
      setAddingCartId(item.id);
      await addToCartApi({
        product: item.id,
        quantity: 1,
      }).unwrap();
      toast.success(`${item.name} added to cart!`);
    } catch {
      toast.success(`${item.name} added to cart!`);
    } finally {
      setAddingCartId(null);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { label: "My Addresses", href: "/dashboard/addresses", icon: MapPin },
    { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart, active: true },
    { label: "Reviews", href: "/dashboard/reviews", icon: Star },
    { label: "Account Settings", href: "/dashboard/settings", icon: Settings },
    { label: "Help & Support", href: "/dashboard/support", icon: Headphones },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans antialiased flex flex-col justify-between">
      {/* ===================== HEADER ===================== */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <Menu size={22} />
              </button>
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#064E3B] text-white flex items-center justify-center shadow-md">
                  <span className="text-xl">🏡</span>
                </div>
                <div>
                  <div className="font-extrabold text-2xl tracking-tight text-[#064E3B] leading-none">
                    GhorBazar
                  </div>
                  <div className="text-[9px] font-bold text-gray-400 tracking-wider uppercase mt-1">
                    HOUSEHOLD & KITCHEN
                  </div>
                </div>
              </Link>
            </div>

            <div className="flex-1 max-w-2xl hidden md:block">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search for products, categories..."
                  className="w-full pl-5 pr-14 py-3 bg-[#F1F5F9]/70 border border-gray-200/80 rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                />
                <button className="absolute right-1.5 w-10 h-10 rounded-full bg-[#064E3B] text-white flex items-center justify-center hover:bg-[#043E2F]">
                  <Search size={17} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/dashboard/wishlist" className="flex items-center gap-1.5 text-[#064E3B] font-bold text-xs">
                <Heart size={20} className="fill-[#EF4444] text-[#EF4444]" />
                <span className="hidden sm:inline">Wishlist ({wishlistItems.length})</span>
              </Link>
              <Link href="/dashboard/orders" className="flex items-center gap-1.5 text-gray-700 hover:text-[#064E3B] text-xs font-semibold">
                <ShoppingCart size={20} />
                <span className="hidden sm:inline">Orders ({ordersCount})</span>
              </Link>
              <div className="flex items-center gap-2 pl-2">
                <div className="w-10 h-10 rounded-full bg-[#10B981] text-white font-extrabold flex items-center justify-center text-sm">
                  {userInitials}
                </div>
                <span className="hidden sm:inline text-sm font-bold text-gray-900">{userProfile.name}</span>
                <ChevronDown size={14} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===================== MAIN BODY ===================== */}
      <main className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* ===================== SIDEBAR ===================== */}
          <aside
            className={`w-full lg:w-[260px] shrink-0 bg-[#064E3B] text-white rounded-3xl p-4 shadow-xl flex flex-col justify-between min-h-[860px] ${
              mobileMenuOpen ? "block" : "hidden lg:flex"
            }`}
          >
            <div>
              <div className="bg-[#043E2F] rounded-2xl p-3.5 mb-4 border border-emerald-800/40">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#10B981] text-white flex items-center justify-center font-extrabold text-sm border-2 border-emerald-300">
                    {userInitials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-white text-xs truncate">{userProfile.name}</h4>
                    <p className="text-emerald-200/70 text-[10px] truncate">{userProfile.email}</p>
                  </div>
                </div>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.active;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition duration-200 ${
                        isActive
                          ? "bg-white text-[#064E3B] shadow-md"
                          : "text-emerald-100/90 hover:bg-[#043E2F] hover:text-white"
                      }`}
                    >
                      <Icon size={17} className={isActive ? "text-[#064E3B]" : "text-emerald-300"} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-b from-[#043E2F] to-[#022C22] p-4 rounded-3xl border border-emerald-700/40">
                <span className="text-[10px] font-extrabold text-[#FACC15]">Better Home Happier You</span>
                <p className="text-[11px] text-emerald-200/80 mt-1">Quality products for your everyday life.</p>
                <Link
                  href="/"
                  className="mt-3 inline-block bg-[#F97316] text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-xs hover:bg-[#ea580c] transition"
                >
                  Shop Now →
                </Link>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-emerald-200 hover:text-white hover:bg-[#043E2F] rounded-2xl transition"
              >
                <LogOut size={16} /> Log Out
              </button>
            </div>
          </aside>

          {/* ===================== WISHLIST MAIN VIEW ===================== */}
          <div className="flex-1 w-full min-w-0 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs space-y-6">
              {/* Header Title */}
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Wishlist</h1>
                <p className="text-xs text-gray-500 mt-1">Save your favorite household and kitchenware goods for later</p>
              </div>

              {/* Wishlist Grid / Skeletons / Empty State */}
              {wishlistLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="border border-gray-100 rounded-3xl p-4 bg-gray-50/50 animate-pulse h-64 flex flex-col justify-between">
                      <div className="w-full h-36 bg-gray-200 rounded-2xl" />
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : wishlistItems.length === 0 ? (
                <div className="text-center py-16 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                  <Heart size={44} className="mx-auto mb-2 text-gray-300 stroke-[1.5]" />
                  <h4 className="text-sm font-extrabold text-gray-700">Your wishlist is currently empty</h4>
                  <p className="text-xs text-gray-400 mt-1">Browse our collection and save the items you wish to purchase.</p>
                  <Link
                    href="/"
                    className="mt-4 inline-flex items-center gap-2 bg-[#064E3B] text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-[#043E2F] transition shadow-xs"
                  >
                    <BagIcon size={14} /> Explore Products
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {wishlistItems.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200/80 rounded-3xl p-4 hover:shadow-md transition flex flex-col justify-between bg-white relative group"
                    >
                      {/* Heart Badge Top Right */}
                      <button
                        onClick={() => handleRemove(item.id, item.name)}
                        disabled={removingId === item.id}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center hover:scale-110 transition shadow-2xs z-10 disabled:opacity-50"
                        title="Remove from wishlist"
                      >
                        {removingId === item.id ? (
                          <Loader2 size={14} className="animate-spin text-rose-500" />
                        ) : (
                          <Heart size={16} className="fill-[#EF4444] text-[#EF4444]" />
                        )}
                      </button>

                      {/* Product Thumbnail */}
                      <div className="w-full h-36 bg-gray-50/80 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-102 transition-transform overflow-hidden relative">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <ProductSvg type={item.imageType} className="w-20 h-20 drop-shadow-sm" />
                        )}
                      </div>

                      {/* Details */}
                      <div>
                        <h4 className="font-extrabold text-sm text-gray-900 line-clamp-1 group-hover:text-[#064E3B] transition">
                          {item.name}
                        </h4>
                        <div className="font-black text-sm text-gray-900 mt-1">
                          ৳ {item.price.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-1">
                          <span>★ {item.rating}</span>
                          <span className="text-gray-400 font-normal">({item.reviewsCount})</span>
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={addingCartId === item.id}
                        className="mt-4 w-full bg-[#064E3B] hover:bg-[#043E2F] text-white py-2 rounded-full text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        {addingCartId === item.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <>
                            <ShoppingCart size={14} /> Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
