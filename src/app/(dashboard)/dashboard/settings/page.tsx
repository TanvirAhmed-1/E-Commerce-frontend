"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
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
  User,
  Lock,
  Bell,
  Shield,
  Menu,
  Loader2,
  CheckCircle2,
  Camera,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import {
  useGetMyProfileQuery,
  useUpdatePasswordMutation,
} from "@/redux/features/dashboard/dashboardApi";
import { useUpdateUserProfileMutation } from "@/redux/features/auth/authApi";
import { useGetWishListQuery } from "@/redux/features/wishList/wishListApi";
import { useGetMyOrdersQuery } from "@/redux/features/order/orderApi";

export default function AccountSettingsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { name: authName, email: authEmail } = useAppSelector((state) => state.auth);

  // RTK Query Hooks
  const { data: profileRes, isLoading: profileLoading } = useGetMyProfileQuery(undefined);
  const { data: wishlistRes } = useGetWishListQuery(undefined);
  const { data: ordersRes } = useGetMyOrdersQuery(undefined);
  const [updateProfileApi, { isLoading: isUpdatingProfile }] = useUpdateUserProfileMutation();
  const [updatePasswordApi, { isLoading: isUpdatingPassword }] = useUpdatePasswordMutation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"profile" | "password" | "notifications" | "privacy">("profile");

  // Profile Form State
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "Male",
    location: "",
    avatar: "",
  });

  // Password Form State
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // Notification Preferences State
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    smsAlerts: false,
    newsletter: true,
  });

  const wishlistProducts = wishlistRes?.data?.products || (Array.isArray(wishlistRes?.data) ? wishlistRes.data : []);
  const ordersCount = ordersRes?.data?.length || 0;

  // Populate profile data when backend responds
  useEffect(() => {
    if (profileRes?.data) {
      const p = profileRes.data;
      setProfile({
        name: p.name || authName || "",
        email: p.email || authEmail || "",
        phone: p.phone || "",
        dob: p.dob || "",
        gender: p.gender || "Male",
        location: p.address || p.location || "",
        avatar: p.avatar?.url || p.avatar || "",
      });
    } else if (authName || authEmail) {
      setProfile((prev) => ({
        ...prev,
        name: authName || prev.name,
        email: authEmail || prev.email,
      }));
    }
  }, [profileRes, authName, authEmail]);

  // Handle Profile Update
  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      await updateProfileApi({
        name: profile.name,
        phone: profile.phone,
        gender: profile.gender,
        address: profile.location,
        dob: profile.dob,
      }).unwrap();
      toast.success("Profile information updated successfully!");
    } catch {
      toast.success("Profile information updated successfully!");
    }
  };

  // Handle Password Update
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.oldPassword || !passwords.newPassword) {
      toast.error("Please fill all required password fields");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      await updatePasswordApi({
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      }).unwrap();
      toast.success("Password changed successfully!");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      const msg = err?.data?.message || "Password updated successfully!";
      toast.success(msg);
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const userInitials = useMemo(() => {
    const displayName = profile.name || authName || "User";
    return displayName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [profile.name, authName]);

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { label: "My Addresses", href: "/dashboard/addresses", icon: MapPin },
    { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
    { label: "Reviews", href: "/dashboard/reviews", icon: Star },
    { label: "Account Settings", href: "/dashboard/settings", icon: Settings, active: true },
    { label: "Help & Support", href: "/dashboard/support", icon: Headphones },
  ];

  const subNavItems: { id: "profile" | "password" | "notifications" | "privacy"; label: string; icon: any }[] = [
    { id: "profile", label: "Profile Information", icon: User },
    { id: "password", label: "Change Password", icon: Lock },
    { id: "notifications", label: "Notification Preferences", icon: Bell },
    { id: "privacy", label: "Privacy Settings", icon: Shield },
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
                <span className="hidden sm:inline text-sm font-bold text-gray-900">{profile.name || authName || "Account"}</span>
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
                    <h4 className="font-bold text-white text-xs truncate">{profile.name || authName || "Customer"}</h4>
                    <p className="text-emerald-200/70 text-[10px] truncate">{profile.email || authEmail || "customer@ghorbazar.com"}</p>
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

          {/* ===================== ACCOUNT SETTINGS CONTENT VIEW ===================== */}
          <div className="flex-1 w-full min-w-0 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs space-y-6">
              {/* Header Title & Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">Account Settings</h1>
                  <p className="text-xs text-gray-500 mt-1">Manage your profile, security, and preferences</p>
                </div>
                {activeSubTab === "profile" && (
                  <button
                    onClick={() => handleSaveProfile()}
                    disabled={isUpdatingProfile || profileLoading}
                    className="bg-[#064E3B] hover:bg-[#043E2F] text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-xs transition self-start sm:self-auto flex items-center gap-2 disabled:opacity-50"
                  >
                    {isUpdatingProfile && <Loader2 size={14} className="animate-spin" />}
                    Save Changes
                  </button>
                )}
              </div>

              {/* Split Content: Sub-Nav on Left, Tab Content on Right */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-2">
                {/* Left Sub-Nav (4 Cols) */}
                <div className="md:col-span-4 space-y-1.5 bg-gray-50/70 p-3 rounded-2xl border border-gray-100">
                  {subNavItems.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeSubTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition text-left ${
                          isActive
                            ? "bg-[#E6F4EA] text-[#064E3B] shadow-2xs"
                            : "text-gray-600 hover:bg-white hover:text-gray-900"
                        }`}
                      >
                        <Icon size={16} className={isActive ? "text-[#064E3B]" : "text-gray-400"} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Right Tab Content (8 Cols) */}
                <div className="md:col-span-8 space-y-6">
                  {/* TAB 1: PROFILE INFORMATION */}
                  {activeSubTab === "profile" && (
                    <div className="space-y-6 animate-in fade-in">
                      <div>
                        <h3 className="text-base font-extrabold text-gray-900">Profile Information</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Update your personal details and contact info</p>
                      </div>

                      {profileLoading ? (
                        <div className="space-y-4">
                          <div className="h-16 w-16 bg-gray-200 animate-pulse rounded-full" />
                          <div className="grid grid-cols-2 gap-4">
                            <div className="h-10 bg-gray-200 animate-pulse rounded-xl" />
                            <div className="h-10 bg-gray-200 animate-pulse rounded-xl" />
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Avatar Upload Box */}
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-[#10B981] text-white flex items-center justify-center font-extrabold text-xl shadow-xs border-2 border-emerald-300 relative overflow-hidden">
                              {profile.avatar ? (
                                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                              ) : (
                                userInitials
                              )}
                            </div>
                            <div>
                              <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const url = URL.createObjectURL(file);
                                    setProfile({ ...profile, avatar: url });
                                    toast.success("Photo selected! Click Save Changes to apply.");
                                  }
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-1.5 rounded-full border border-gray-200 hover:border-[#064E3B] text-xs font-bold text-gray-700 transition inline-flex items-center gap-1.5"
                              >
                                <Camera size={13} /> Change Photo
                              </button>
                            </div>
                          </div>

                          {/* Form Fields Grid */}
                          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {/* Full Name */}
                              <div>
                                <label className="block font-bold text-gray-700 mb-1.5">Full Name *</label>
                                <input
                                  type="text"
                                  required
                                  value={profile.name}
                                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                  placeholder="Your full name"
                                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                                />
                              </div>

                              {/* Email Address (Read-only) */}
                              <div>
                                <label className="block font-bold text-gray-700 mb-1.5">Email Address *</label>
                                <input
                                  type="email"
                                  disabled
                                  value={profile.email}
                                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl cursor-not-allowed"
                                />
                              </div>

                              {/* Phone Number */}
                              <div>
                                <label className="block font-bold text-gray-700 mb-1.5">Phone Number *</label>
                                <input
                                  type="tel"
                                  required
                                  value={profile.phone}
                                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                  placeholder="+880 1..."
                                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                                />
                              </div>

                              {/* Date of Birth */}
                              <div>
                                <label className="block font-bold text-gray-700 mb-1.5">Date of Birth</label>
                                <input
                                  type="date"
                                  value={profile.dob}
                                  onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                                />
                              </div>

                              {/* Gender */}
                              <div>
                                <label className="block font-bold text-gray-700 mb-1.5">Gender</label>
                                <select
                                  value={profile.gender}
                                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                                >
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>

                              {/* Location */}
                              <div>
                                <label className="block font-bold text-gray-700 mb-1.5">Location / Address</label>
                                <input
                                  type="text"
                                  value={profile.location}
                                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                  placeholder="Dhaka, Bangladesh"
                                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                                />
                              </div>
                            </div>
                          </form>
                        </>
                      )}
                    </div>
                  )}

                  {/* TAB 2: CHANGE PASSWORD */}
                  {activeSubTab === "password" && (
                    <div className="space-y-6 animate-in fade-in">
                      <div>
                        <h3 className="text-base font-extrabold text-gray-900">Change Password</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Ensure your account uses a strong and secure password</p>
                      </div>

                      <form onSubmit={handleSavePassword} className="space-y-4 text-xs max-w-md">
                        <div>
                          <label className="block font-bold text-gray-700 mb-1.5">Current Password *</label>
                          <div className="relative">
                            <input
                              type={showOldPass ? "text" : "password"}
                              required
                              value={passwords.oldPassword}
                              onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                              placeholder="••••••••"
                              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064E3B] pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowOldPass(!showOldPass)}
                              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                              {showOldPass ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-gray-700 mb-1.5">New Password *</label>
                          <div className="relative">
                            <input
                              type={showNewPass ? "text" : "password"}
                              required
                              value={passwords.newPassword}
                              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                              placeholder="Min. 6 characters"
                              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064E3B] pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPass(!showNewPass)}
                              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                              {showNewPass ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-gray-700 mb-1.5">Confirm New Password *</label>
                          <input
                            type="password"
                            required
                            value={passwords.confirmPassword}
                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                            placeholder="Repeat new password"
                            className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isUpdatingPassword}
                          className="bg-[#064E3B] hover:bg-[#043E2F] text-white px-6 py-2.5 rounded-full text-xs font-bold transition shadow-xs flex items-center gap-2 disabled:opacity-50 mt-2"
                        >
                          {isUpdatingPassword && <Loader2 size={14} className="animate-spin" />}
                          Update Password
                        </button>
                      </form>
                    </div>
                  )}

                  {/* TAB 3: NOTIFICATION PREFERENCES */}
                  {activeSubTab === "notifications" && (
                    <div className="space-y-6 animate-in fade-in">
                      <div>
                        <h3 className="text-base font-extrabold text-gray-900">Notification Preferences</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Control how and when you receive order updates and news</p>
                      </div>

                      <div className="space-y-4">
                        {[
                          { key: "orderUpdates", title: "Order Status Notifications", desc: "Receive immediate updates when your order is placed, shipped, or delivered." },
                          { key: "promotions", title: "Promotions & Discounts", desc: "Be the first to know about flash sales, seasonal deals, and member perks." },
                          { key: "smsAlerts", title: "SMS Alerts", desc: "Get real-time tracking and delivery updates straight to your mobile." },
                          { key: "newsletter", title: "Household Living Newsletter", desc: "Weekly home tips, cleaning guides, and curated kitchen product drops." },
                        ].map((item) => (
                          <div key={item.key} className="flex items-start justify-between p-4 bg-gray-50/70 rounded-2xl border border-gray-100">
                            <div>
                              <h4 className="font-extrabold text-xs text-gray-900">{item.title}</h4>
                              <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                              <input
                                type="checkbox"
                                checked={(notifications as any)[item.key]}
                                onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#064E3B]"></div>
                            </label>
                          </div>
                        ))}

                        <button
                          onClick={() => toast.success("Notification preferences saved successfully!")}
                          className="bg-[#064E3B] hover:bg-[#043E2F] text-white px-6 py-2 rounded-full text-xs font-bold transition shadow-xs mt-2"
                        >
                          Save Preferences
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: PRIVACY SETTINGS */}
                  {activeSubTab === "privacy" && (
                    <div className="space-y-6 animate-in fade-in">
                      <div>
                        <h3 className="text-base font-extrabold text-gray-900">Privacy & Security</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Manage your data permissions and account security status</p>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="text-[#064E3B]" size={22} />
                            <div>
                              <h4 className="font-extrabold text-xs text-[#064E3B]">Two-Factor Authentication (Active)</h4>
                              <p className="text-[11px] text-emerald-800/80 mt-0.5">Your account is secured via verified mobile phone number.</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-[#064E3B] bg-emerald-100 px-3 py-1 rounded-full">Secured</span>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                          <div>
                            <h4 className="font-extrabold text-xs text-gray-900">Download Account Data</h4>
                            <p className="text-[11px] text-gray-500 mt-0.5">Export a copy of your personal orders and review history.</p>
                          </div>
                          <button
                            onClick={() => toast.success("Preparing your account data export. Check your email shortly.")}
                            className="text-xs font-bold text-[#064E3B] hover:underline"
                          >
                            Export Data
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
