import React from "react";
import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CartContainer from "@/components/ui/cart/CartContainer";

export const metadata = {
  title: "Your Cart | GhorBazar",
  description: "Review and manage your household items in your GhorBazar cart.",
};

export default async function CartPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return (
      <div className="bg-[#faf8ff] dark:bg-[#0B0B14] min-h-[70vh] py-16 flex flex-col items-center justify-center px-4">
        <div className="bg-white dark:bg-[#121320] p-10 rounded-2xl border border-slate-200/70 dark:border-slate-800 shadow-xs text-center flex flex-col items-center max-w-md w-full">
          <div className="w-16 h-16 bg-[#f2f3ff] dark:bg-[#09090e] text-[#003820] dark:text-[#95d4ac] rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl">shopping_cart</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Authentication Required</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-xs">
            Please log in to view and manage your cart items.
          </p>
          <Button asChild className="mt-6 w-full bg-[#003820] hover:bg-[#0f5132] text-white h-11 rounded-xl cursor-pointer">
            <Link href="/login">Log In / Register</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <CartContainer token={token} />;
}
