"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useGetMyCartQuery, useAddToCartMutation, useClearCartMutation } from "@/redux/features/cart/cartApi";
import { useGetMyAddressesQuery, useCreateAddressMutation } from "@/redux/features/address/addressApi";
import { useCheckoutMutation } from "@/redux/features/order/orderApi";
import { clearCart } from "@/redux/features/cart/cartSlice";
import { Button } from "@/components/ui/button";
import { CreditCard, MapPin, Plus, Loader, CheckCircle, AlertCircle, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

function CheckoutContent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const localCart = useSelector((state: RootState) => state.cart.items);

  // APIs
  const [syncCart, { isLoading: isSyncing }] = useAddToCartMutation();
  const [clearDbCart] = useClearCartMutation();
  const { data: dbCartResponse, refetch: refetchCart } = useGetMyCartQuery(undefined, { skip: !token });
  const { data: addressesResponse, refetch: refetchAddresses } = useGetMyAddressesQuery(undefined, { skip: !token });
  const [createAddress, { isLoading: isCreatingAddress }] = useCreateAddressMutation();
  const [checkout, { isLoading: isCheckingOut }] = useCheckoutMutation();

  // State
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bkash" | "nagad">("cod");
  const [transactionId, setTransactionId] = useState("");
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  // Address Form State
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    division: "",
    district: "",
    upazila: "",
    address: "",
  });



  // Select first address by default
  useEffect(() => {
    const addresses = addressesResponse?.data || [];
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find((a: any) => a.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddr._id);
    }
  }, [addressesResponse, selectedAddressId]);

  if (!token) {
    return (
      <div className="bg-slate-50 dark:bg-[#0B0B14] min-h-screen py-16 flex flex-col items-center justify-center px-4 transition-colors duration-300">
        <div className="bg-white dark:bg-[#131424] p-12 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center flex flex-col items-center max-w-md w-full transition-colors duration-300">
          <div className="w-20 h-20 bg-slate-50 dark:bg-[#18182c] text-gray-400 dark:text-slate-400 rounded-full flex items-center justify-center mb-6">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Authentication Required</h2>
          <p className="text-gray-500 dark:text-slate-400 mt-2 text-sm">Please log in to proceed with secure checkout.</p>
          <Button asChild className="mt-8 w-full bg-slate-900 dark:bg-[#5f5eff] hover:bg-primary dark:hover:bg-[#4d4cff] text-white h-12 rounded-2xl cursor-pointer">
            <Link href="/login">Log In / Sign Up</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Get active cart data
  const dbCart = dbCartResponse?.data;
  const dbCartItems = dbCart?.items || [];
  const totalAmount = dbCart?.totalAmount || 0;

  const vat = Math.round(totalAmount * 0.05); // 5% VAT
  const shipping = totalAmount > 1000 || totalAmount === 0 ? 0 : 60;
  const grandTotal = totalAmount + vat + shipping;

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createAddress(addressForm).unwrap();
      toast.success("Address added successfully!");
      refetchAddresses();
      setShowAddressForm(false);
      setAddressForm({
        fullName: "",
        phone: "",
        division: "",
        district: "",
        upazila: "",
        address: "",
      });
      if (res?.data?._id) {
        setSelectedAddressId(res.data._id);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add address.");
    }
  };

  const handleCheckout = async () => {
    const addresses = addressesResponse?.data || [];
    const activeAddress = addresses.find((a: any) => a._id === selectedAddressId);

    if (!activeAddress) {
      toast.error("Please select or add a shipping address.");
      return;
    }

    if ((paymentMethod === "bkash" || paymentMethod === "nagad") && !transactionId.trim()) {
      toast.error(`Please provide the ${paymentMethod} Transaction ID.`);
      return;
    }

    try {
      const checkoutPayload = {
        shippingAddress: {
          fullName: activeAddress.fullName,
          phone: activeAddress.phone,
          address: `${activeAddress.address}, ${activeAddress.upazila}, ${activeAddress.district}`,
          city: activeAddress.division,
        },
        paymentMethod,
        deliveryType: "home_delivery" as const,
        transactionId: transactionId || undefined,
      };

      const res = await checkout(checkoutPayload).unwrap();
      toast.success("Order placed successfully!");
      dispatch(clearCart());
      setOrderSuccess(res?.data);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Checkout failed.");
    }
  };

  if (orderSuccess) {
    return (
      <div className="bg-slate-50 dark:bg-[#0B0B14] min-h-screen py-16 flex flex-col items-center justify-center px-4 transition-colors duration-300">
        <div className="bg-white dark:bg-[#131424] p-12 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-center flex flex-col items-center max-w-lg w-full transition-colors duration-300">
          <div className="w-20 h-20 bg-green-50 dark:bg-green-950/20 text-green-500 dark:text-[#00e5a3] rounded-full flex items-center justify-center mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Order Placed Successfully!</h2>
          <p className="text-gray-500 dark:text-slate-400 mt-2 text-sm">Thank you for your purchase. Your invoice and delivery details are ready.</p>

          <div className="bg-slate-50 dark:bg-[#18182c] rounded-2xl p-6 w-full my-8 text-left space-y-3 border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 dark:text-slate-400 font-medium">Order Number:</span>
              <span className="font-mono font-bold text-gray-800 dark:text-white">{orderSuccess._id || "N/A"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 dark:text-slate-400 font-medium">Total Paid:</span>
              <span className="font-bold text-primary dark:text-[#5f5eff]">৳{orderSuccess.totalAmount || grandTotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 dark:text-slate-400 font-medium">Payment Mode:</span>
              <span className="font-bold uppercase text-gray-700 dark:text-slate-200">{orderSuccess.payment?.method || paymentMethod}</span>
            </div>
          </div>

          <div className="flex gap-4 w-full">
            <Button asChild className="flex-1 bg-slate-900 dark:bg-[#5f5eff] hover:bg-primary dark:hover:bg-[#4d4cff] text-white h-12 rounded-2xl cursor-pointer">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-[#0B0B14] min-h-screen py-12 transition-colors duration-300">
      <div className="container lg:max-w-[1400px] mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8">
          Checkout
        </h1>

        {isSyncing ? (
          <div className="bg-white dark:bg-[#131424] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-16 text-center flex flex-col items-center justify-center transition-colors duration-300">
            <Loader className="animate-spin text-primary dark:text-[#5f5eff] mb-4" size={36} />
            <p className="text-gray-500 dark:text-slate-400 font-medium">Synchronizing your cart...</p>
          </div>
        ) : dbCartItems.length === 0 ? (
          <div className="bg-white dark:bg-[#131424] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-16 text-center flex flex-col items-center justify-center transition-colors duration-300">
            <ShoppingCart size={40} className="text-gray-300 dark:text-slate-700 mb-4" />
            <p className="text-gray-500 dark:text-slate-400 font-medium">Your checkout cart is empty.</p>
            <Button asChild className="mt-6 cursor-pointer bg-slate-900 dark:bg-[#5f5eff] hover:bg-primary dark:hover:bg-[#4d4cff] text-white">
              <Link href="/products">Browse products</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Steps & Form */}
            <div className="flex-1 flex flex-col gap-8">
              {/* 1. Shipping Address */}
              <div className="bg-white dark:bg-[#131424] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 md:p-8 transition-colors duration-300">
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100 dark:border-slate-800">
                  <h2 className="font-extrabold text-gray-800 dark:text-white text-lg tracking-tight flex items-center gap-2">
                    <MapPin size={20} className="text-primary dark:text-[#5f5eff]" /> 1. Shipping Address
                  </h2>
                  {!showAddressForm && (
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="text-xs font-bold text-primary dark:text-[#5f5eff] hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-0"
                    >
                      <Plus size={14} /> Add New
                    </button>
                  )}
                </div>

                {showAddressForm ? (
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">Full Name</label>
                        <input
                          type="text"
                          required
                          value={addressForm.fullName}
                          onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                          className="border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none text-sm focus:border-primary dark:focus:border-[#5f5eff] bg-white dark:bg-[#151522] text-slate-800 dark:text-slate-100 transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">Phone Number</label>
                        <input
                          type="text"
                          required
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          className="border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none text-sm focus:border-primary dark:focus:border-[#5f5eff] bg-white dark:bg-[#151522] text-slate-800 dark:text-slate-100 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">Division</label>
                        <input
                          type="text"
                          required
                          value={addressForm.division}
                          onChange={(e) => setAddressForm({ ...addressForm, division: e.target.value })}
                          className="border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none text-sm focus:border-primary dark:focus:border-[#5f5eff] bg-white dark:bg-[#151522] text-slate-800 dark:text-slate-100 transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">District</label>
                        <input
                          type="text"
                          required
                          value={addressForm.district}
                          onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                          className="border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none text-sm focus:border-primary dark:focus:border-[#5f5eff] bg-white dark:bg-[#151522] text-slate-800 dark:text-slate-100 transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">Upazila</label>
                        <input
                          type="text"
                          required
                          value={addressForm.upazila}
                          onChange={(e) => setAddressForm({ ...addressForm, upazila: e.target.value })}
                          className="border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none text-sm focus:border-primary dark:focus:border-[#5f5eff] bg-white dark:bg-[#151522] text-slate-800 dark:text-slate-100 transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase">Detailed Address</label>
                      <textarea
                        required
                        value={addressForm.address}
                        onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                        className="border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none text-sm focus:border-primary dark:focus:border-[#5f5eff] bg-white dark:bg-[#151522] text-slate-800 dark:text-slate-100 min-h-[80px] transition-all"
                      />
                    </div>

                    <div className="flex gap-4 pt-2 justify-end">
                      <Button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-250 font-bold h-10 px-5 rounded-xl cursor-pointer transition-all"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isCreatingAddress}
                        className="bg-slate-900 dark:bg-[#5f5eff] hover:bg-primary dark:hover:bg-[#4d4cff] text-white font-bold h-10 px-5 rounded-xl cursor-pointer transition-all"
                      >
                        {isCreatingAddress ? "Saving..." : "Save Address"}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(addressesResponse?.data || []).map((addr: any) => (
                      <div
                        key={addr._id}
                        onClick={() => setSelectedAddressId(addr._id)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative ${
                          selectedAddressId === addr._id
                            ? "border-primary dark:border-[#5f5eff] bg-primary/5 dark:bg-[#5f5eff]/10"
                            : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-[#121320]"
                        }`}
                      >
                        <h4 className="font-bold text-gray-800 dark:text-white text-sm">{addr.fullName}</h4>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 font-semibold">{addr.phone}</p>
                        <p className="text-xs text-gray-500 dark:text-slate-450 mt-2 line-clamp-2">
                          {addr.address}, {addr.upazila}, {addr.district}, {addr.division}
                        </p>
                      </div>
                    ))}
                    {(addressesResponse?.data || []).length === 0 && (
                      <div className="col-span-2 text-center py-6 text-gray-500 dark:text-slate-400 text-sm">
                        No shipping address configured. Please add one.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 2. Payment Method */}
              <div className="bg-white dark:bg-[#131424] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 md:p-8 transition-colors duration-300">
                <h2 className="font-extrabold text-gray-800 dark:text-white text-lg tracking-tight flex items-center gap-2 mb-6 pb-2 border-b border-gray-100 dark:border-slate-800">
                  <CreditCard size={20} className="text-primary dark:text-[#5f5eff]" /> 2. Payment Method
                </h2>

                <div className="grid grid-cols-3 gap-4">
                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-4 rounded-2xl border-2 text-center cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-primary dark:border-[#5f5eff] bg-primary/5 dark:bg-[#5f5eff]/10 font-bold text-primary dark:text-[#5f5eff]"
                        : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 font-medium text-gray-600 dark:text-slate-350 bg-white dark:bg-[#121320]"
                    }`}
                  >
                    <span className="text-sm">Cash on Delivery</span>
                  </div>
                  <div
                    onClick={() => setPaymentMethod("bkash")}
                    className={`p-4 rounded-2xl border-2 text-center cursor-pointer transition-all ${
                      paymentMethod === "bkash"
                        ? "border-primary dark:border-[#5f5eff] bg-primary/5 dark:bg-[#5f5eff]/10 font-bold text-primary dark:text-[#5f5eff]"
                        : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 font-medium text-gray-600 dark:text-slate-350 bg-white dark:bg-[#121320]"
                    }`}
                  >
                    <span className="text-sm">bKash</span>
                  </div>
                  <div
                    onClick={() => setPaymentMethod("nagad")}
                    className={`p-4 rounded-2xl border-2 text-center cursor-pointer transition-all ${
                      paymentMethod === "nagad"
                        ? "border-primary dark:border-[#5f5eff] bg-primary/5 dark:bg-[#5f5eff]/10 font-bold text-primary dark:text-[#5f5eff]"
                        : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 font-medium text-gray-600 dark:text-slate-350 bg-white dark:bg-[#121320]"
                    }`}
                  >
                    <span className="text-sm">Nagad</span>
                  </div>
                </div>

                {paymentMethod !== "cod" && (
                  <div className="mt-6 p-6 bg-slate-50 dark:bg-[#18182c] border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col gap-3">
                    <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                      Please send the payable amount to our official merchant wallet number: <span className="font-bold text-gray-700 dark:text-slate-200">017XXXXXXXX</span>. Enter the Transaction ID below for verification.
                    </p>
                    <input
                      type="text"
                      placeholder="Transaction ID"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 bg-white dark:bg-[#151522] text-slate-800 dark:text-slate-100 outline-none text-sm w-full focus:border-primary dark:focus:border-[#5f5eff] transition-all"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary & Cart list */}
            <aside className="w-full lg:w-96 shrink-0 flex flex-col gap-6">
              <div className="bg-white dark:bg-[#131424] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 md:p-8 flex flex-col gap-6 transition-colors duration-300">
                <h3 className="font-extrabold text-gray-800 dark:text-white text-lg pb-4 border-b border-gray-100 dark:border-slate-800">
                  Checkout Summary
                </h3>

                {/* Items preview list */}
                <div className="max-h-60 overflow-y-auto space-y-4 custom-scrollbar pr-2">
                  {dbCartItems.map((item: any) => (
                    <div key={item._id} className="flex gap-4 items-center">
                      <div className="relative w-12 h-12 bg-slate-50 dark:bg-[#09090e] rounded-xl overflow-hidden border border-gray-100 dark:border-slate-800 shrink-0">
                        <Image
                          src={item.product?.thumbnail || "/placeholder.png"}
                          alt={item.product?.name || "Product"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-800 dark:text-white truncate">{item.product?.name}</h4>
                        <p className="text-[10px] text-gray-400 dark:text-slate-400 mt-0.5">
                          {item.quantity} x ৳{item.price}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-gray-900 dark:text-white">৳{item.totalPrice}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400 font-medium">
                    <span>Subtotal</span>
                    <span className="text-gray-800 dark:text-slate-200 font-bold">৳{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400 font-medium">
                    <span>VAT (5%)</span>
                    <span className="text-gray-800 dark:text-slate-200 font-bold">৳{vat}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-slate-400 font-medium">
                    <span>Shipping</span>
                    <span className="text-gray-800 dark:text-slate-200 font-bold">
                      {shipping === 0 ? "FREE" : `৳${shipping}`}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex justify-between items-end">
                  <span className="text-xs font-extrabold text-gray-800 dark:text-white">Grand Total</span>
                  <span className="text-xl font-black text-primary dark:text-[#5f5eff]">৳{grandTotal}</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-slate-900 dark:bg-[#5f5eff] hover:bg-primary dark:hover:bg-[#4d4cff] text-white font-bold h-12 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer mt-4"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader className="animate-spin" size={18} /> Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} /> Confirm Order
                    </>
                  )}
                </Button>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <React.Suspense fallback={
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-primary" size={36} />
      </div>
    }>
      <CheckoutContent />
    </React.Suspense>
  );
}
