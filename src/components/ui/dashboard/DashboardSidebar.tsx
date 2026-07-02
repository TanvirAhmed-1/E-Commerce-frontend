"use client";

import React from "react";
import { 
  ShoppingBag, 
  MapPin, 
  Heart, 
  Settings, 
  LogOut, 
  LayoutDashboard 
} from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: {
    name: string | null;
    email: string | null;
  };
}

export default function DashboardSidebar({ activeTab, setActiveTab, user }: SidebarProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "orders", label: "My Orders", icon: ShoppingBag },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "profile", label: "Settings", icon: Settings },
  ];

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
      {/* User Profile Card */}
      <div className="bg-white dark:bg-[#121320] rounded-3xl border border-gray-200/80 dark:border-slate-800/60 p-6 shadow-sm dark:shadow-xl transition-all duration-300 hover:shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center font-bold text-xl border border-primary/20 shrink-0">
            {getInitials(user.name)}
          </div>
          <div className="min-w-0">
            <h3 className="font-extrabold text-gray-900 dark:text-white text-base truncate leading-snug">
              {user.name || "Customer Profile"}
            </h3>
            <p className="text-gray-400 dark:text-slate-400 text-xs truncate mt-0.5">
              {user.email || "No Email Provided"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Card */}
      <div className="bg-white dark:bg-[#121320] rounded-3xl border border-gray-200/80 dark:border-slate-800/60 p-4 shadow-sm dark:shadow-xl">
        {/* Desktop Vertical Menu */}
        <nav className="hidden lg:flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon size={18} className={isActive ? "stroke-[2.5]" : "stroke-[2] opacity-80"} />
                {item.label}
              </button>
            );
          })}
          
          <div className="h-px bg-gray-200 dark:bg-slate-800/60 my-2" />
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all duration-200 cursor-pointer"
          >
            <LogOut size={18} className="stroke-[2]" />
            Sign Out
          </button>
        </nav>

        {/* Mobile Horizontal Menu */}
        <div className="lg:hidden flex overflow-x-auto gap-2 pb-1 scrollbar-none">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap rounded-xl transition-all duration-200 cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon size={14} className={isActive ? "stroke-[2.5]" : "stroke-[2]"} />
                {item.label}
              </button>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all duration-200 cursor-pointer shrink-0"
          >
            <LogOut size={14} className="stroke-[2]" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
