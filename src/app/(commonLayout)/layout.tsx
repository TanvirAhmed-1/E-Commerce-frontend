import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import React from "react";

type TProps = { children: React.ReactNode };

function Commonlayout({ children }: TProps) {
  return (
    <div className="min-h-svh bg-white flex flex-col relative">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

export default Commonlayout;
