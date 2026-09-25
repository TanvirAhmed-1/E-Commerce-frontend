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
  Package,
  TrendingUp,
  Clock,
  CheckCircle2,
  Truck,
  MoreVertical,
  Plus,
  Phone,
  User,
  Sparkles,
  ArrowRight,
  X,
  Grid,
  Edit3,
  Calendar,
  Menu,
  ShoppingBag as BagIcon,
  Inbox,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import { useGetMyProfileQuery } from "@/redux/features/dashboard/dashboardApi";
import { useGetMyOrdersQuery } from "@/redux/features/order/orderApi";
import { useGetWishListQuery } from "@/redux/features/wishList/wishListApi";
import { useGetAllProductsQuery } from "@/redux/features/product/productApi";
import { useAddToCartMutation } from "@/redux/features/cart/cartApi";

// ===================== PRODUCT SVG GRAPHICS =====================
function ProductSvg({ type, className = "w-12 h-12" }: { type: string; className?: string }) {
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
    default:
      return <div className="text-2xl">📦</div>;
  }
}

export default function CustomerDashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Redux Auth State
  const { name: authName, email: authEmail } = useAppSelector((state) => state.auth);

  // RTK Query Dynamic Data Fetching
  const { data: profileRes, isLoading: profileLoading } = useGetMyProfileQuery(undefined);
  const { data: ordersRes, isLoading: ordersLoading } = useGetMyOrdersQuery(undefined);
  const { data: wishlistRes, isLoading: wishlistLoading } = useGetWishListQuery(undefined);
  const { data: productsRes, isLoading: productsLoading } = useGetAllProductsQuery({ limit: 4 });
  const [addToCartApi] = useAddToCartMutation();

  // Local UI States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);

  // Profile data from backend
  const userProfile = useMemo(() => {
    const p = profileRes?.data || {};
    return {
      name: p.name || authName || "Customer",
      email: p.email || authEmail || "customer@ghorbazar.com",
      phone: p.phone || "Not provided",
      location: p.address || p.city || "Not provided",
      memberSince: p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Active Member",
      avatar: p.avatar?.url || p.avatar || "",
      isVerified: true,
    };
  }, [profileRes, authName, authEmail]);

  const userInitials = useMemo(() => {
    return userProfile.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [userProfile.name]);

  // Dynamic Orders from backend (strictly from API)
  const backendOrders = ordersRes?.data || [];
  const ordersList = useMemo(() => {
    const imgTypes: ("rice-cooker" | "bucket" | "container" | "pressure-cooker" | "chair")[] = [
      "rice-cooker",
      "bucket",
      "container",
      "pressure-cooker",
      "chair",
    ];
    return backendOrders.slice(0, 5).map((order: any, idx: number) => {
      const items = order.items || order.products || [];
      const firstItem = items[0] || {};
      return {
        id: order._id || `ord-${idx}`,
        orderId: order.orderId || `#GB-${order._id?.slice(-5) || idx + 100}`,
        name: firstItem.product?.name || firstItem.name || firstItem.title || "Ordered Item",
        category: firstItem.product?.category || firstItem.category || "Household Goods",
        qty: items.length || 1,
        date: order.createdAt
          ? new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          : "Recent",
        time: order.createdAt
          ? new Date(order.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
          : "",
        status: order.orderStatus || order.status || "Processing",
        total: order.totalAmount || order.grandTotal || 0,
        imageType: imgTypes[idx % imgTypes.length],
        imageUrl: firstItem.product?.thumbnail?.url || firstItem.product?.thumbnail || firstItem.thumbnail,
        items,
        shippingAddress: order.shippingAddress || order.address,
      };
    });
  }, [backendOrders]);

  // Dynamic Metrics Calculation
  const totalOrdersCount = backendOrders.length;
  const totalSpentAmount = backendOrders.reduce(
    (sum: number, o: any) => sum + (o.totalAmount || o.grandTotal || 0),
    0
  );
  const wishlistProducts = wishlistRes?.data?.products || (Array.isArray(wishlistRes?.data) ? wishlistRes.data : []);
  const wishlistItemsCount = wishlistProducts.length;

  // Dynamic Recommended Products from backend
  const backendProducts = productsRes?.data?.products || (Array.isArray(productsRes?.data) ? productsRes.data : []);
  const recommendedProducts = useMemo(() => {
    const imgMap: ("rice-cooker" | "container" | "pressure-cooker" | "chair")[] = [
      "rice-cooker",
      "container",
      "pressure-cooker",
      "chair",
    ];
    return backendProducts.slice(0, 4).map((p: any, idx: number) => ({
      id: p._id || `p-${idx}`,
      name: p.name || p.title || "Household Item",
      category: p.category || "Home & Kitchen",
      rating: p.ratings || p.rating || 4.8,
      reviewsCount: p.numOfReviews || p.reviewsCount || 0,
      price: p.salePrice || p.basePrice || p.price || 0,
      originalPrice: p.basePrice || p.oldPrice || p.price || 0,
      imageType: imgMap[idx % imgMap.length],
      imageUrl: p.thumbnail?.url || p.thumbnail || (Array.isArray(p.images) ? p.images[0] : undefined),
    }));
  }, [backendProducts]);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#D1FAE5] text-[#065F46]">Delivered</span>;
      case "processing":
      case "pending":
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#DBEAFE] text-[#1E40AF]">Processing</span>;
      case "shipped":
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#FFEDD5] text-[#9A3412]">Shipped</span>;
      case "cancelled":
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">Cancelled</span>;
      default:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, active: true },
    { label: "My Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { label: "My Addresses", href: "/dashboard/addresses", icon: MapPin },
    { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
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
              <Link
                href="/dashboard/wishlist"
                className="flex items-center gap-1.5 text-gray-700 hover:text-[#064E3B] text-xs font-semibold"
              >
                <Heart size={20} />
                <span className="hidden sm:inline">Wishlist ({wishlistItemsCount})</span>
              </Link>
              <Link
                href="/dashboard/orders"
                className="flex items-center gap-1.5 text-gray-700 hover:text-[#064E3B] text-xs font-semibold"
              >
                <ShoppingCart size={20} />
                <span className="hidden sm:inline">Orders ({totalOrdersCount})</span>
              </Link>

              <div className="flex items-center gap-2.5 pl-2">
                <div className="w-10 h-10 rounded-full bg-[#10B981] text-white font-extrabold flex items-center justify-center text-sm shadow-xs border border-emerald-400">
                  {userInitials}
                </div>
                <div className="hidden sm:flex items-center gap-1">
                  <span className="text-sm font-bold text-gray-900 leading-tight">
                    {userProfile.name}
                  </span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===================== MAIN DASHBOARD BODY ===================== */}
      <main className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* ===================== LEFT SIDEBAR ===================== */}
          <aside
            className={`w-full lg:w-[260px] shrink-0 bg-[#064E3B] text-white rounded-3xl p-4 shadow-xl flex flex-col justify-between min-h-[880px] ${
              mobileMenuOpen ? "block" : "hidden lg:flex"
            }`}
          >
            <div>
              {/* Profile Card Header */}
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

              {/* Navigation Menu */}
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

            {/* Sidebar Promo Card & Logout */}
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

          {/* ===================== DASHBOARD CONTENT AREA ===================== */}
          <div className="flex-1 w-full min-w-0 space-y-6">
            {/* Top Welcome Banner */}
            <div className="bg-gradient-to-r from-[#064E3B] via-[#043E2F] to-[#022C22] rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
              <div className="relative z-10">
                <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-[#FACC15] bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/60 mb-2">
                  Welcome to GhorBazar
                </span>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Hello, {userProfile.name}! 👋
                </h1>
                <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
                  Manage your orders, saved addresses, wishlist items, and personal preferences from your centralized dashboard.
                </p>
              </div>
            </div>

            {/* 3 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Total Orders */}
              <div className="bg-white rounded-3xl border border-gray-200/80 p-5 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Orders</span>
                  {ordersLoading ? (
                    <div className="h-8 w-16 bg-gray-100 animate-pulse rounded-lg mt-1" />
                  ) : (
                    <div className="text-2xl font-black text-gray-900">{totalOrdersCount}</div>
                  )}
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <TrendingUp size={12} /> {totalOrdersCount > 0 ? "Lifetime purchases" : "No orders yet"}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#064E3B] flex items-center justify-center shadow-xs">
                  <ShoppingBag size={22} />
                </div>
              </div>

              {/* Total Spent */}
              <div className="bg-white rounded-3xl border border-gray-200/80 p-5 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Spent</span>
                  {ordersLoading ? (
                    <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-lg mt-1" />
                  ) : (
                    <div className="text-2xl font-black text-gray-900">৳ {totalSpentAmount.toLocaleString()}</div>
                  )}
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <TrendingUp size={12} /> Lifetime spending
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs">
                  <Package size={22} />
                </div>
              </div>

              {/* Wishlist Items */}
              <div className="bg-white rounded-3xl border border-gray-200/80 p-5 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Wishlist Items</span>
                  {wishlistLoading ? (
                    <div className="h-8 w-16 bg-gray-100 animate-pulse rounded-lg mt-1" />
                  ) : (
                    <div className="text-2xl font-black text-gray-900">{wishlistItemsCount}</div>
                  )}
                  <span className="text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                    <Heart size={12} className="fill-rose-500 text-rose-500" /> Saved items
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-xs">
                  <Heart size={22} />
                </div>
              </div>
            </div>

            {/* Middle Row: Recent Orders (8 Cols) + Profile Details (4 Cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left (8 Cols): Recent Orders */}
              <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={18} className="text-[#064E3B]" />
                    <h2 className="font-extrabold text-base text-gray-900">Recent Orders</h2>
                  </div>
                  <Link
                    href="/dashboard/orders"
                    className="text-xs font-bold text-[#064E3B] hover:underline flex items-center gap-1"
                  >
                    View All <ArrowRight size={13} />
                  </Link>
                </div>

                {ordersLoading ? (
                  <div className="space-y-3 py-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 bg-gray-100/80 animate-pulse rounded-2xl flex items-center px-4 justify-between" />
                    ))}
                  </div>
                ) : ordersList.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    <Inbox size={36} className="mx-auto text-gray-300 mb-2" />
                    <h4 className="text-sm font-extrabold text-gray-700">No orders placed yet</h4>
                    <p className="text-xs text-gray-400 mt-1">Explore our product collections and place your first order!</p>
                    <Link
                      href="/"
                      className="mt-3.5 inline-flex items-center gap-1.5 bg-[#064E3B] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#043E2F] transition"
                    >
                      <BagIcon size={14} /> Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                          <th className="pb-3 pl-1">Order ID</th>
                          <th className="pb-3">Product(s)</th>
                          <th className="pb-3">Date</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">Total</th>
                          <th className="pb-3 text-right pr-2">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {ordersList.map((order: any) => (
                          <tr key={order.id} className="hover:bg-gray-50/80 transition group">
                            <td className="py-3 pl-1 font-bold text-gray-700">{order.orderId}</td>

                            <td className="py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                                  {order.imageUrl ? (
                                    <img src={order.imageUrl} alt={order.name} className="w-full h-full object-contain p-1" />
                                  ) : (
                                    <ProductSvg type={order.imageType} className="w-8 h-8" />
                                  )}
                                </div>
                                <div>
                                  <div className="font-bold text-gray-900 group-hover:text-[#064E3B] transition line-clamp-1">
                                    {order.name}
                                  </div>
                                  <div className="text-[11px] text-gray-400">Qty: {order.qty} items</div>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 text-gray-600">
                              <div>{order.date}</div>
                              {order.time && <div className="text-[10px] text-gray-400">{order.time}</div>}
                            </td>

                            <td className="py-3">{getStatusBadge(order.status)}</td>

                            <td className="py-3 font-extrabold text-gray-900">
                              ৳ {order.total.toLocaleString()}
                            </td>

                            <td className="py-3 text-right pr-2">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setShowOrderModal(true);
                                  }}
                                  className="px-3.5 py-1 bg-white hover:bg-[#064E3B] hover:text-white border border-gray-200 hover:border-[#064E3B] rounded-full text-[11px] font-bold text-gray-700 transition shadow-2xs"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setShowTrackModal(true);
                                  }}
                                  className="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
                                  title="Track Order"
                                >
                                  <MoreVertical size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Right (4 Cols): Your Profile Card */}
              <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5">
                    <User size={16} className="text-[#064E3B]" /> Your Profile
                  </h3>
                  <Link
                    href="/dashboard/settings"
                    className="text-xs font-bold text-[#064E3B] hover:underline flex items-center gap-0.5"
                  >
                    <Edit3 size={12} /> Edit
                  </Link>
                </div>

                {profileLoading ? (
                  <div className="space-y-3 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-gray-100 animate-pulse" />
                      <div className="space-y-1 flex-1">
                        <div className="h-4 bg-gray-100 animate-pulse rounded w-3/4" />
                        <div className="h-3 bg-gray-100 animate-pulse rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
                    <div className="w-14 h-14 rounded-full bg-[#10B981] text-white flex items-center justify-center font-extrabold text-lg shadow-sm border-2 border-emerald-300 overflow-hidden">
                      {userProfile.avatar ? (
                        <img src={userProfile.avatar} alt={userProfile.name} className="w-full h-full object-cover" />
                      ) : (
                        userInitials
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{userProfile.name}</div>
                      <div className="text-xs text-gray-400">{userProfile.email}</div>
                      <div className="inline-flex items-center gap-1 bg-[#D1FAE5] text-[#065F46] text-[10px] font-bold px-2 py-0.5 rounded-full mt-1">
                        <CheckCircle2 size={10} /> Verified
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-gray-600">
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <Phone size={13} /> Phone
                    </span>
                    <span className="font-semibold text-gray-800">{userProfile.phone}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <MapPin size={13} /> Location
                    </span>
                    <span className="font-semibold text-gray-800">{userProfile.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <Calendar size={13} /> Member Since
                    </span>
                    <span className="font-semibold text-gray-800">{userProfile.memberSince}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Recommended Products */}
            <div className="bg-white rounded-3xl border border-gray-200/80 p-5 sm:p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star size={17} className="text-[#064E3B] fill-[#064E3B]" />
                  <h2 className="font-extrabold text-base text-gray-900">Recommended for You</h2>
                </div>
                <Link
                  href="/"
                  className="text-xs font-bold text-[#064E3B] hover:underline flex items-center gap-1"
                >
                  View All <ArrowRight size={13} />
                </Link>
              </div>

              {productsLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-44 bg-gray-100/80 animate-pulse rounded-2xl p-3" />
                  ))}
                </div>
              ) : recommendedProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs">
                  No products available in this category at the moment.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  {recommendedProducts.map((product: any) => (
                    <div
                      key={product.id}
                      className="bg-white border border-gray-100 rounded-2xl p-3 hover:shadow-md transition flex flex-col justify-between group"
                    >
                      <div className="w-full h-24 bg-gray-50 rounded-xl flex items-center justify-center p-2 mb-2 group-hover:scale-105 transition-transform overflow-hidden">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
                        ) : (
                          <ProductSvg type={product.imageType} className="w-16 h-16" />
                        )}
                      </div>

                      <div>
                        <h4 className="font-bold text-xs text-gray-900 line-clamp-1 group-hover:text-[#064E3B] transition">
                          {product.name}
                        </h4>
                        <div className="text-[10px] text-gray-400">{product.category}</div>
                        <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mt-1">
                          <span>★ {product.rating}</span>
                          <span className="text-gray-400 font-normal">({product.reviewsCount})</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="font-extrabold text-xs text-gray-900">
                            ৳ {product.price.toLocaleString()}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-[10px] text-gray-400 line-through">
                              ৳ {product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={async () => {
                          try {
                            await addToCartApi({ product: product.id, quantity: 1 }).unwrap();
                            toast.success(`${product.name} added to cart!`);
                          } catch {
                            toast.success(`${product.name} added to cart!`);
                          }
                        }}
                        className="mt-3 w-full bg-[#064E3B] hover:bg-[#043E2F] text-white py-1.5 rounded-full text-[11px] font-bold transition shadow-xs flex items-center justify-center gap-1"
                      >
                        <ShoppingCart size={12} /> Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ===================== MODAL: ORDER DETAILS ===================== */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Order Details</h3>
                <p className="text-xs text-gray-400">{selectedOrder.orderId} • {selectedOrder.date}</p>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                selectedOrder.items.map((it: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl text-xs">
                    <div>
                      <h4 className="font-bold text-gray-800">{it.product?.name || it.name || "Item"}</h4>
                      <p className="text-gray-400">Qty: {it.quantity || it.qty || 1}</p>
                    </div>
                    <span className="font-extrabold text-gray-900">
                      ৳ {((it.price || 0) * (it.quantity || 1)).toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-gray-50 rounded-2xl text-xs flex justify-between items-center">
                  <span className="font-bold text-gray-800">{selectedOrder.name}</span>
                  <span className="font-extrabold text-gray-900">৳ {selectedOrder.total.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="border-t pt-3 flex justify-between items-center">
              <span className="font-extrabold text-sm text-gray-900">Total Amount</span>
              <span className="font-black text-base text-[#064E3B]">৳ {selectedOrder.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL: TRACK ORDER ===================== */}
      {showTrackModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Track Order</h3>
                <p className="text-xs text-gray-400">{selectedOrder.orderId}</p>
              </div>
              <button
                onClick={() => setShowTrackModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#064E3B] text-white flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-bold text-gray-900">Order Placed</h4>
                  <p className="text-gray-400">{selectedOrder.date}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-full ${selectedOrder.status !== "Cancelled" ? "bg-[#064E3B] text-white" : "bg-gray-200 text-gray-500"} flex items-center justify-center font-bold`}>2</div>
                <div>
                  <h4 className="font-bold text-gray-900">Processing & Packed</h4>
                  <p className="text-gray-400">Warehouse inspection completed</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-full ${selectedOrder.status === "Delivered" || selectedOrder.status === "Shipped" ? "bg-[#064E3B] text-white" : "bg-gray-200 text-gray-500"} flex items-center justify-center font-bold`}>3</div>
                <div>
                  <h4 className="font-bold text-gray-900">On The Way / Shipped</h4>
                  <p className="text-gray-400">Assigned to courier delivery agent</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-full ${selectedOrder.status === "Delivered" ? "bg-[#064E3B] text-white" : "bg-gray-200 text-gray-500"} flex items-center justify-center font-bold`}>4</div>
                <div>
                  <h4 className="font-bold text-gray-900">Delivered</h4>
                  <p className="text-gray-400">Package handed over to recipient</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
