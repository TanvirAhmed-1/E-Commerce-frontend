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
  ChevronRight,
  HelpCircle,
  Truck,
  MessageCircle,
  RotateCcw,
  Phone,
  Mail,
  MessageSquare,
  ArrowRight,
  X,
  Menu,
  Send,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import { useGetMyProfileQuery } from "@/redux/features/dashboard/dashboardApi";
import { useGetWishListQuery } from "@/redux/features/wishList/wishListApi";
import { useGetMyOrdersQuery } from "@/redux/features/order/orderApi";

export default function HelpAndSupportPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { name: authName, email: authEmail } = useAppSelector((state) => state.auth);
  const { data: profileRes, isLoading: profileLoading } = useGetMyProfileQuery(undefined);
  const { data: wishlistRes } = useGetWishListQuery(undefined);
  const { data: ordersRes } = useGetMyOrdersQuery(undefined);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

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

  const [chatMessages, setChatMessages] = useState([
    {
      sender: "agent",
      text: "Hello! Welcome to GhorBazar 24/7 Priority Support. How can our customer care team assist you today?",
      time: "Just now",
    },
  ]);

  const faqs = [
    {
      q: "How can I track my order?",
      a: "You can track your order in real-time by clicking the 'My Orders' tab or by using the tracking button in your order history.",
    },
    {
      q: "What is the standard delivery timeline?",
      a: "Delivery inside Dhaka takes 24 to 48 hours. Orders across other divisions within Bangladesh are delivered within 3 to 5 business days.",
    },
    {
      q: "Can I update my delivery address after placing an order?",
      a: "Yes, you can edit or update your shipping destination prior to order shipment dispatch by contacting our support desk.",
    },
    {
      q: "What is your return and replacement policy?",
      a: "We offer a 7-day hassle-free replacement guarantee on any defective or damaged household and kitchenware goods upon delivery.",
    },
    {
      q: "Which payment methods are accepted?",
      a: "We support Cash on Delivery (COD), bKash, Nagad, Visa, Mastercard, and direct bank wire transfers.",
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const msg = chatMessage;
    setChatMessages((prev) => [...prev, { sender: "user", text: msg, time: "Just now" }]);
    setChatMessage("");
    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "agent",
          text: "Thank you for reaching out! A dedicated customer care representative is reviewing your message and will assist you immediately.",
          time: "Just now",
        },
      ]);
    }, 700);
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
    { label: "Reviews", href: "/dashboard/reviews", icon: Star },
    { label: "Account Settings", href: "/dashboard/settings", icon: Settings },
    { label: "Help & Support", href: "/dashboard/support", icon: Headphones, active: true },
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

          {/* ===================== HELP & SUPPORT MAIN CONTENT ===================== */}
          <div className="flex-1 w-full min-w-0 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs space-y-6">
              {/* Header Title */}
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Help & Support</h1>
                <p className="text-xs text-gray-500 mt-1">
                  We're here to help you. Find answers to common questions or get in touch with our customer care team.
                </p>
              </div>

              {/* 4 Support Quick Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* FAQs */}
                <div
                  onClick={() => {
                    const el = document.getElementById("faq-section");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="p-4 rounded-2xl border border-gray-100 bg-[#F0FDF4]/50 hover:bg-[#F0FDF4] transition flex flex-col justify-between cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#064E3B] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <HelpCircle size={20} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-gray-900">FAQs</h4>
                    <p className="text-xs text-gray-500 mt-1">Find answers to common questions.</p>
                  </div>
                  <span className="text-xs font-bold text-[#064E3B] mt-3 block">View FAQs →</span>
                </div>

                {/* Track Order */}
                <div
                  onClick={() => router.push("/dashboard/orders")}
                  className="p-4 rounded-2xl border border-gray-100 bg-[#F0FDF4]/50 hover:bg-[#F0FDF4] transition flex flex-col justify-between cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#064E3B] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-gray-900">Track Order</h4>
                    <p className="text-xs text-gray-500 mt-1">Check your order delivery status.</p>
                  </div>
                  <span className="text-xs font-bold text-[#064E3B] mt-3 block">Track Now →</span>
                </div>

                {/* Contact Us */}
                <div
                  onClick={() => setShowChatModal(true)}
                  className="p-4 rounded-2xl border border-gray-100 bg-[#F0FDF4]/50 hover:bg-[#F0FDF4] transition flex flex-col justify-between cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#064E3B] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-gray-900">Contact Us</h4>
                    <p className="text-xs text-gray-500 mt-1">Get in touch with live customer support.</p>
                  </div>
                  <span className="text-xs font-bold text-[#064E3B] mt-3 block">Contact Support →</span>
                </div>

                {/* Return & Refund */}
                <div
                  onClick={() => toast("Our policy allows 7-day hassle-free replacement on delivered orders.", { icon: "📦" })}
                  className="p-4 rounded-2xl border border-gray-100 bg-[#F0FDF4]/50 hover:bg-[#F0FDF4] transition flex flex-col justify-between cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#064E3B] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <RotateCcw size={20} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-gray-900">Return & Refund</h4>
                    <p className="text-xs text-gray-500 mt-1">Learn about our replacement policy.</p>
                  </div>
                  <span className="text-xs font-bold text-[#064E3B] mt-3 block">Learn More →</span>
                </div>
              </div>

              {/* Middle Section: Popular Questions (Accordion) + Still Need Help Card */}
              <div id="faq-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Popular Questions Accordion (8 Cols) */}
                <div className="lg:col-span-8 bg-white border border-gray-200/80 rounded-3xl p-5 sm:p-6 shadow-xs space-y-3">
                  <h3 className="font-extrabold text-base text-gray-900 mb-4">Popular Questions</h3>
                  <div className="divide-y divide-gray-100">
                    {faqs.map((faq, idx) => {
                      const isOpen = activeFaq === idx;
                      return (
                        <div key={idx} className="py-3.5">
                          <button
                            onClick={() => setActiveFaq(isOpen ? null : idx)}
                            className="w-full flex items-center justify-between text-left text-xs font-bold text-gray-800 hover:text-[#064E3B] transition"
                          >
                            <span>{faq.q}</span>
                            <ChevronRight
                              size={15}
                              className={`text-gray-400 transition-transform ${isOpen ? "rotate-90 text-[#064E3B]" : ""}`}
                            />
                          </button>
                          {isOpen && (
                            <p className="text-xs text-gray-500 mt-2 leading-relaxed pl-1 pr-4 animate-in fade-in">
                              {faq.a}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Still Need Help Card (4 Cols) */}
                <div className="lg:col-span-4 bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] border border-emerald-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between min-h-[300px]">
                  <div>
                    <h3 className="font-extrabold text-base text-gray-900">Still need help?</h3>
                    <p className="text-xs text-gray-600 mt-1">Our support team is available 24/7 to assist you.</p>

                    <button
                      onClick={() => setShowChatModal(true)}
                      className="mt-4 bg-[#064E3B] hover:bg-[#043E2F] text-white px-5 py-2.5 rounded-full text-xs font-bold transition shadow-xs flex items-center gap-2"
                    >
                      Contact Support <ArrowRight size={13} />
                    </button>
                  </div>

                  {/* Customer Support Illustration */}
                  <div className="flex justify-end mt-4">
                    <div className="w-20 h-20 rounded-full bg-white/80 shadow-inner flex items-center justify-center text-4xl">
                      👩‍💼
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Contact Information Bar (3 Columns) */}
              <div className="border-t border-gray-100 pt-6">
                <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-4">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Phone */}
                  <a
                    href="tel:+8801712345678"
                    className="flex items-center gap-3 p-3 bg-gray-50/70 hover:bg-gray-100/70 rounded-2xl border border-gray-100 transition"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#E6F4EA] text-[#064E3B] flex items-center justify-center shrink-0">
                      <Phone size={16} />
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 block">+880 1712 345678</span>
                      <span className="text-[10px] text-gray-400">(9AM - 10PM)</span>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:support@ghorbazar.com"
                    className="flex items-center gap-3 p-3 bg-gray-50/70 hover:bg-gray-100/70 rounded-2xl border border-gray-100 transition"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#E6F4EA] text-[#064E3B] flex items-center justify-center shrink-0">
                      <Mail size={16} />
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 block">support@ghorbazar.com</span>
                      <span className="text-[10px] text-gray-400">(24/7 Response)</span>
                    </div>
                  </a>

                  {/* Live Chat */}
                  <div
                    onClick={() => setShowChatModal(true)}
                    className="flex items-center gap-3 p-3 bg-gray-50/70 hover:bg-[#E6F4EA]/40 rounded-2xl border border-gray-100 cursor-pointer transition"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#E6F4EA] text-[#064E3B] flex items-center justify-center shrink-0">
                      <MessageSquare size={16} />
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 block">Live Chat</span>
                      <span className="text-[10px] text-gray-400">Chat with us (9AM - 10PM)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Live Support Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <h3 className="font-extrabold text-sm text-gray-900">GhorBazar Priority Support</h3>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                <X size={15} />
              </button>
            </div>

            <div className="h-72 overflow-y-auto space-y-2.5 p-3 bg-gray-50 rounded-2xl text-xs">
              {chatMessages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                      m.sender === "user"
                        ? "bg-[#064E3B] text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none shadow-2xs border border-gray-100"
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9px] text-gray-400 mt-0.5 px-1">{m.time}</span>
                </div>
              ))}
              {isSending && (
                <div className="flex items-center gap-1.5 text-gray-400 text-[11px] p-2">
                  <Loader2 size={12} className="animate-spin" /> Representative is typing...
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-[#064E3B]"
              />
              <button
                type="submit"
                className="bg-[#064E3B] text-white px-4 py-2.5 rounded-full text-xs font-bold hover:bg-[#043E2F] flex items-center gap-1 shadow-xs"
              >
                <Send size={13} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
