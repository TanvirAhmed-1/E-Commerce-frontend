"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import Container from "@/components/shared/Container";
import DashboardSidebar from "@/components/ui/dashboard/DashboardSidebar";
import OverviewTab from "@/components/ui/dashboard/OverviewTab";
import OrdersTab from "@/components/ui/dashboard/OrdersTab";
import OrderDetailsView from "@/components/ui/dashboard/OrderDetailsView";
import ProfileTab from "@/components/ui/dashboard/ProfileTab";
import AddressesTab from "@/components/ui/dashboard/AddressesTab";
import WishlistTab from "@/components/ui/dashboard/WishlistTab";
import toast from "react-hot-toast";

export default function UserDashboardPage() {
  const { token, name, email } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !token) {
      toast.error("Please sign in to access the dashboard");
      router.push("/login");
    }
  }, [mounted, token, router]);

  if (!mounted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50/50 dark:bg-[#0B0B14]/50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!token) {
    return null; // Will redirect via useEffect
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            user={{ name, email }}
            setActiveTab={setActiveTab}
            setSelectedOrderId={(id) => {
              setSelectedOrderId(id);
              setActiveTab("orders");
            }}
          />
        );
      case "orders":
        if (selectedOrderId) {
          return (
            <OrderDetailsView
              orderId={selectedOrderId}
              onBack={() => setSelectedOrderId("")}
            />
          );
        }
        return <OrdersTab setSelectedOrderId={setSelectedOrderId} />;
      case "addresses":
        return <AddressesTab />;
      case "wishlist":
        return <WishlistTab />;
      case "profile":
        return <ProfileTab />;
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">Select a navigation tab from the side panel.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0B0B14] py-8 transition-colors duration-300">
      <Container>
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Dashboard Left Sidebar */}
          <DashboardSidebar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              // Clear selected order details if navigating away from orders tab
              if (tab !== "orders") {
                setSelectedOrderId("");
              }
            }}
            user={{ name, email }}
          />

          {/* Active Tab Panel */}
          <div className="flex-1 w-full min-w-0">
            <div className="bg-white dark:bg-[#121320] border border-gray-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-xs dark:shadow-xl transition-all duration-300 min-h-[50vh]">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
