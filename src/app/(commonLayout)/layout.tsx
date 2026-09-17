import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import MobileBottomNav from "@/components/shared/Navbar/MobileBottomNav";
import React from "react";

type TProps = { children: React.ReactNode };

function Commonlayout({ children }: TProps) {
  return (
    <div className="min-h-svh bg-[#faf8ff] dark:bg-[#0B0B14] flex flex-col relative pb-14 md:pb-0">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

export default Commonlayout;
