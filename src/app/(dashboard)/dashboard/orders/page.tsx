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
  ArrowRight,
  X,
  Truck,
  CheckCircle2,
  Clock,
  Menu,
  FileText,
  Inbox,
  ShoppingBag as BagIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import { useGetMyOrdersQuery } from "@/redux/features/order/orderApi";
import { useGetMyProfileQuery } from "@/redux/features/dashboard/dashboardApi";
import { useGetWishListQuery } from "@/redux/features/wishList/wishListApi";
import OrderInvoiceModal from "@/components/ui/dashboard/OrderInvoiceModal";

// ===================== PRODUCT SVG GRAPHICS =====================
function ProductThumb({ type, className = "w-10 h-10" }: { type: string; className?: string }) {
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
      return <div className="text-xl">📦</div>;
  }
}

export default function MyOrdersPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { name: authName, email: authEmail } = useAppSelector((state) => state.auth);

  // RTK Query hooks
  const { data: profileRes } = useGetMyProfileQuery(undefined);
  const { data: ordersRes, isLoading: ordersLoading } = useGetMyOrdersQuery(undefined);
  const { data: wishlistRes } = useGetWishListQuery(undefined);

  const [activeFilter, setActiveFilter] = useState("All Orders");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  const backendOrders = ordersRes?.data || [];
  const wishlistProducts = wishlistRes?.data?.products || (Array.isArray(wishlistRes?.data) ? wishlistRes.data : []);

  const orders = useMemo(() => {
    const imgTypes = ["rice-cooker", "bucket", "container", "pressure-cooker", "chair"];
    return backendOrders.map((order: any, idx: number) => {
      const items = order.items || order.products || [];
      const firstItem = items[0] || {};
      return {
        ...order,
        id: order._id || `ord-${idx}`,
        orderId: order.orderId || `#GB-${order._id?.slice(-5) || idx + 100}`,
        date: order.createdAt
          ? new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          : "Recent",
        time: order.createdAt
          ? new Date(order.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
          : "",
        itemsCount: items.length || 1,
        status: (order.orderStatus || order.status || "Processing") as string,
        total: order.totalAmount || order.grandTotal || 0,
        mainImage: imgTypes[idx % imgTypes.length],
        imageUrl: firstItem.product?.thumbnail?.url || firstItem.product?.thumbnail || firstItem.thumbnail,
        itemsList: items.map((it: any) => ({
          name: it.product?.name || it.name || it.title || "Household Item",
          qty: it.quantity || it.qty || 1,
          price: it.price || it.product?.price || 0,
          imageUrl: it.product?.thumbnail?.url || it.product?.thumbnail || it.thumbnail,
          product: it.product,
          variant: it.variant,
        })),
        shippingAddress: order.shippingAddress || order.address,
      };
    });
  }, [backendOrders]);

  const filterTabs = [
    { label: "All Orders", count: orders.length },
    { label: "Processing", count: orders.filter((o: any) => o.status?.toLowerCase() === "processing" || o.status?.toLowerCase() === "pending").length },
    { label: "Shipped", count: orders.filter((o: any) => o.status?.toLowerCase() === "shipped").length },
    { label: "Delivered", count: orders.filter((o: any) => o.status?.toLowerCase() === "delivered").length },
    { label: "Cancelled", count: orders.filter((o: any) => o.status?.toLowerCase() === "cancelled").length },
  ];

  const filteredOrders = useMemo(() => {
    return orders.filter((order: any) => {
      const matchFilter =
        activeFilter === "All Orders" ||
        order.status?.toLowerCase() === activeFilter.toLowerCase() ||
        (activeFilter === "Processing" && order.status?.toLowerCase() === "pending");
      const matchSearch =
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.itemsList.some((item: any) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchFilter && matchSearch;
    });
  }, [orders, activeFilter, searchTerm]);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-bold bg-[#D1FAE5] text-[#065F46]">Delivered</span>;
      case "processing":
      case "pending":
        return <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-bold bg-[#DBEAFE] text-[#1E40AF]">Processing</span>;
      case "shipped":
        return <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-bold bg-[#FFEDD5] text-[#9A3412]">Shipped</span>;
      case "cancelled":
        return <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">Cancelled</span>;
      default:
        return <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Orders", href: "/dashboard/orders", icon: ShoppingBag, active: true },
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
                  placeholder="Search in orders by ID, product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-5 pr-14 py-3 bg-[#F1F5F9]/70 border border-gray-200/80 rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                />
                <button className="absolute right-1.5 w-10 h-10 rounded-full bg-[#064E3B] text-white flex items-center justify-center hover:bg-[#043E2F]">
                  <Search size={17} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/dashboard/wishlist" className="flex items-center gap-1.5 text-gray-700 hover:text-[#064E3B] text-xs font-semibold">
                <Heart size={20} />
                <span className="hidden sm:inline">Wishlist ({wishlistProducts.length})</span>
              </Link>
              <Link href="/dashboard/orders" className="flex items-center gap-1.5 text-[#064E3B] font-bold text-xs">
                <ShoppingCart size={20} />
                <span className="hidden sm:inline">Orders ({orders.length})</span>
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
          {/* Sidebar */}
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

          {/* Orders Main Content View */}
          <div className="flex-1 w-full min-w-0 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs space-y-6">
              {/* Header Title & Description */}
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Orders</h1>
                <p className="text-xs text-gray-500 mt-1">Track and manage your previous and ongoing orders</p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-100">
                {filterTabs.map((tab) => {
                  const isActive = activeFilter === tab.label;
                  return (
                    <button
                      key={tab.label}
                      onClick={() => setActiveFilter(tab.label)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                        isActive
                          ? "bg-[#064E3B] text-white shadow-xs"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                          isActive ? "bg-emerald-800/80 text-white" : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Orders List / Skeletons / Empty State */}
              {ordersLoading ? (
                <div className="space-y-4 pt-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="border border-gray-100 rounded-3xl p-5 bg-gray-50/50 animate-pulse flex flex-col md:flex-row gap-5 items-center justify-between">
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-16 h-16 rounded-2xl bg-gray-200" />
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-gray-200 rounded w-48" />
                          <div className="h-3 bg-gray-200 rounded w-28" />
                        </div>
                      </div>
                      <div className="h-8 bg-gray-200 rounded-full w-24" />
                    </div>
                  ))}
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-16 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                  <Inbox size={44} className="mx-auto mb-2 text-gray-300 stroke-[1.5]" />
                  <h4 className="text-sm font-extrabold text-gray-700">No orders found</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    {activeFilter === "All Orders"
                      ? "You have not placed any orders yet."
                      : `You do not have any orders with "${activeFilter}" status.`}
                  </p>
                  <Link
                    href="/"
                    className="mt-4 inline-flex items-center gap-2 bg-[#064E3B] text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-[#043E2F] transition shadow-xs"
                  >
                    <BagIcon size={14} /> Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  {filteredOrders.map((order: any) => (
                    <div
                      key={order.id}
                      className="border border-gray-200/80 rounded-3xl p-5 hover:border-[#064E3B]/40 transition flex flex-col md:flex-row md:items-center justify-between gap-5 bg-white"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                          {order.imageUrl ? (
                            <img src={order.imageUrl} alt={order.orderId} className="w-full h-full object-contain p-1" />
                          ) : (
                            <ProductThumb type={order.mainImage} className="w-12 h-12" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-extrabold text-sm text-gray-900">{order.orderId}</span>
                            <span className="text-[11px] text-gray-400">• {order.date}</span>
                          </div>
                          <p className="text-xs font-semibold text-gray-700 mt-0.5">
                            {order.itemsList[0]?.name || "Household items"}{" "}
                            {order.itemsList.length > 1 && (
                              <span className="text-gray-400 font-normal">+{order.itemsList.length - 1} more items</span>
                            )}
                          </p>
                          <div className="text-xs font-black text-gray-900 mt-1">
                            ৳ {order.total.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0">
                        {getStatusBadge(order.status)}

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderModal(true);
                            }}
                            className="bg-gray-100 hover:bg-[#064E3B] hover:text-white text-gray-800 px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1"
                          >
                            <FileText size={13} /> View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Official Order Invoice Modal */}
      {showOrderModal && selectedOrder && (
        <OrderInvoiceModal
          orderData={selectedOrder}
          onClose={() => {
            setShowOrderModal(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
}
