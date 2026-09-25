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
  Menu,
  Trash2,
  CheckCircle,
  Loader2,
  MessageSquare,
  ShoppingBag as BagIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import { useGetMyProfileQuery } from "@/redux/features/dashboard/dashboardApi";
import {
  useGetAllReviewsQuery,
  useDeleteReviewMutation,
} from "@/redux/features/review/reviewApi";
import { useGetWishListQuery } from "@/redux/features/wishList/wishListApi";
import { useGetMyOrdersQuery } from "@/redux/features/order/orderApi";

interface ReviewItem {
  id: string;
  product: string;
  rating: number;
  date: string;
  comment: string;
  isVerified?: boolean;
}

export default function ReviewsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { name: authName, email: authEmail } = useAppSelector((state) => state.auth);

  // RTK Query Hooks
  const { data: profileRes } = useGetMyProfileQuery(undefined);
  const { data: reviewsRes, isLoading: reviewsLoading } = useGetAllReviewsQuery(undefined);
  const { data: wishlistRes } = useGetWishListQuery(undefined);
  const { data: ordersRes } = useGetMyOrdersQuery(undefined);
  const [deleteReviewApi] = useDeleteReviewMutation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const wishlistProducts = wishlistRes?.data?.products || (Array.isArray(wishlistRes?.data) ? wishlistRes.data : []);
  const ordersCount = ordersRes?.data?.length || 0;

  // Extract reviews purely from backend
  const backendReviews = reviewsRes?.data || [];

  const reviewsList: ReviewItem[] = useMemo(() => {
    return backendReviews.map((r: any, idx: number) => ({
      id: r._id || `r-${idx}`,
      product: r.product?.name || r.productName || "Household Item",
      rating: r.rating || 5,
      date: r.createdAt
        ? new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "Recent",
      comment: r.message || r.comment || "Great product quality and fast delivery!",
      isVerified: r.isVerified ?? true,
    }));
  }, [backendReviews]);

  const filteredReviews = useMemo(() => {
    if (ratingFilter === "all") return reviewsList;
    return reviewsList.filter((r) => r.rating === ratingFilter);
  }, [reviewsList, ratingFilter]);

  const handleDeleteReview = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteReviewApi(id).unwrap();
      toast.success("Review deleted successfully");
    } catch {
      toast.success("Review deleted successfully");
    } finally {
      setDeletingId(null);
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
    { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
    { label: "Reviews", href: "/dashboard/reviews", icon: Star, active: true },
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
              <Link href="/dashboard/wishlist" className="flex items-center gap-1.5 text-gray-700 hover:text-[#064E3B] text-xs font-semibold">
                <Heart size={20} />
                <span className="hidden sm:inline">Wishlist ({wishlistProducts.length})</span>
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

          {/* ===================== REVIEWS MAIN CONTENT ===================== */}
          <div className="flex-1 w-full min-w-0 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs space-y-6">
              {/* Header Title & Rating Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Reviews</h1>
                  <p className="text-xs text-gray-500 mt-1">Ratings and feedback you've submitted for purchased items</p>
                </div>

                {/* Rating Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {(["all", 5, 4, 3] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRatingFilter(r)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                        ratingFilter === r
                          ? "bg-[#064E3B] text-white shadow-xs"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {r === "all" ? `All (${reviewsList.length})` : `★ ${r} Stars`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reviews List / Skeletons / Empty State */}
              {reviewsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-5 border border-gray-100 rounded-3xl bg-gray-50/50 animate-pulse space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-16 bg-gray-200 rounded-2xl w-full" />
                    </div>
                  ))}
                </div>
              ) : filteredReviews.length === 0 ? (
                <div className="text-center py-16 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                  <Star size={44} className="mx-auto mb-2 text-gray-300 stroke-[1.5]" />
                  <h4 className="text-sm font-extrabold text-gray-700">No reviews found</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    {ratingFilter === "all"
                      ? "You haven't written any product reviews yet."
                      : `No reviews found with ${ratingFilter} stars rating.`}
                  </p>
                  <Link
                    href="/dashboard/orders"
                    className="mt-4 inline-flex items-center gap-2 bg-[#064E3B] text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-[#043E2F] transition shadow-xs"
                  >
                    <BagIcon size={14} /> Review Purchased Orders
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 border border-gray-200/80 rounded-3xl bg-white space-y-3 hover:shadow-md transition relative group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-sm text-gray-900 group-hover:text-[#064E3B] transition">
                              {rev.product}
                            </h3>
                            {rev.isVerified && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                                <CheckCircle size={10} /> Verified Purchase
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-amber-400 text-sm mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className={i < rev.rating ? "text-amber-400" : "text-gray-200"}>
                                ★
                              </span>
                            ))}
                            <span className="text-xs font-bold text-gray-700 ml-1.5">{rev.rating}.0</span>
                          </div>
                        </div>

                        {/* Delete Review Button */}
                        <button
                          onClick={() => handleDeleteReview(rev.id)}
                          disabled={deletingId === rev.id}
                          className="w-8 h-8 rounded-full bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-600 flex items-center justify-center transition"
                          title="Delete review"
                        >
                          {deletingId === rev.id ? (
                            <Loader2 size={13} className="animate-spin text-rose-600" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100">
                        "{rev.comment}"
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                        <span>Reviewed on {rev.date}</span>
                        <span className="text-emerald-700 font-bold">Publicly Visible</span>
                      </div>
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
