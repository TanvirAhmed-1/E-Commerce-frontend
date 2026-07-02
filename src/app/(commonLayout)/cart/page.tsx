import React from "react";
import { cookies } from "next/headers";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { customFetch } from "@/utils/fetchHelper";
import CartContainer from "@/components/ui/cart/CartContainer";

export const metadata = {
  title: "Your Cart | Gear Manifest",
  description: "Review and manage your high-performance gears in the cart before deployment.",
};

export default async function CartPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return (
      <div className="bg-[#0B0B14] min-h-screen py-16 flex flex-col items-center justify-center px-4">
        <div className="bg-[#121320] p-12 rounded-3xl border border-slate-800 shadow-xl text-center flex flex-col items-center max-w-md w-full">
          <div className="w-20 h-20 bg-[#09090e] text-slate-500 rounded-full flex items-center justify-center mb-6 border border-slate-800">
            <ShoppingCart size={40} />
          </div>
          <h2 className="text-xl font-bold text-white">Authentication Required</h2>
          <p className="text-slate-400 mt-2 text-sm">Please log in to view and manage your cart.</p>
          <Button asChild className="mt-8 w-full bg-[#5f5eff] hover:bg-[#4d4cff] text-white h-12 rounded-2xl cursor-pointer">
            <Link href="/login">Log In / Sign Up</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Server-side fetching using our retry-enabled customFetch helper
  const cartResult = await customFetch<any>("/get-cart", {
    token,
    next: { revalidate: 0 }, // no-store equivalent in standard Next fetches
  });

  const productsResult = await customFetch<any>("/product", {
    next: { revalidate: 0 },
  });

  const initialCart = cartResult.success ? cartResult.data : null;
  const products = productsResult.success ? (productsResult.data as any)?.data || [] : [];
  const recommended = products.slice(0, 3);

  return (
    <CartContainer
      initialCart={initialCart}
      recommended={recommended}
      token={token}
    />
  );
}
