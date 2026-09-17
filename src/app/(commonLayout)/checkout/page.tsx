"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useGetMyCartQuery, useClearCartMutation } from "@/redux/features/cart/cartApi";
import { useGetMyAddressesQuery, useCreateAddressMutation } from "@/redux/features/address/addressApi";
import { useCheckoutMutation } from "@/redux/features/order/orderApi";
import { clearCart } from "@/redux/features/cart/cartSlice";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import Link from "next/link";

import CheckoutSteps from "@/components/ui/checkout/CheckoutSteps";
import CheckoutShippingAddress from "@/components/ui/checkout/CheckoutShippingAddress";
import CheckoutDeliveryMethod from "@/components/ui/checkout/CheckoutDeliveryMethod";
import CheckoutPaymentMethod from "@/components/ui/checkout/CheckoutPaymentMethod";
import CheckoutOrderSummary from "@/components/ui/checkout/CheckoutOrderSummary";

function CheckoutContent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  const [clearDbCart] = useClearCartMutation();
  const { data: dbCartResponse } = useGetMyCartQuery(undefined, { skip: !token });
  const { data: addressesResponse, refetch: refetchAddresses } = useGetMyAddressesQuery(undefined, { skip: !token });
  const [createAddress, { isLoading: isCreatingAddress }] = useCreateAddressMutation();
  const [checkout, { isLoading: isCheckingOut }] = useCheckoutMutation();

  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bkash" | "nagad" | "card">("cod");
  const [transactionId, setTransactionId] = useState("");
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  const addresses = addressesResponse?.data || [];
  const dbCart = dbCartResponse?.data;
  const items = dbCart?.items || [];
  const subtotal = dbCart?.totalAmount || 0;
  const deliveryCharge = deliveryMethod === "standard" ? 80 : 130;
  const discount = Math.round(subtotal * 0.1);
  const total = Math.max(0, subtotal - discount + deliveryCharge);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find((a: any) => a.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddr._id);
    }
  }, [addresses, selectedAddressId]);

  if (!token) {
    return (
      <div className="bg-[#faf8ff] dark:bg-[#0B0B14] min-h-[70vh] py-16 flex flex-col items-center justify-center px-4">
        <div className="bg-white dark:bg-[#121320] p-10 rounded-2xl border border-slate-200/70 dark:border-slate-800 shadow-xs text-center flex flex-col items-center max-w-md w-full">
          <div className="w-16 h-16 bg-[#f2f3ff] dark:bg-[#09090e] text-[#003820] dark:text-[#95d4ac] rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl">lock</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Authentication Required</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-xs">Please log in to proceed with secure checkout.</p>
          <Button asChild className="mt-6 w-full bg-[#003820] hover:bg-[#0f5132] text-white h-11 rounded-xl cursor-pointer">
            <Link href="/login">Log In / Register</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddNewAddress = async (formData: any) => {
    try {
      const res = await createAddress(formData).unwrap();
      toast.success("Address saved successfully!");
      refetchAddresses();
      if (res?.data?._id) {
        setSelectedAddressId(res.data._id);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save address.");
    }
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!selectedAddressId && addresses.length === 0) {
      toast.error("Please add a delivery address.");
      return;
    }

    const toastId = toast.loading("Processing your order...");
    try {
      const orderPayload = {
        shippingAddress: selectedAddressId || addresses[0]?._id,
        paymentMethod,
        transactionId: paymentMethod !== "cod" ? transactionId : undefined,
        deliveryMethod,
      };

      const res = await checkout(orderPayload).unwrap();
      dispatch(clearCart());
      try {
        await clearDbCart(undefined).unwrap();
      } catch (e) {}

      toast.success("Order placed successfully!", { id: toastId });
      setOrderSuccess(res?.data || { orderNumber: "GB-" + Math.floor(100000 + Math.random() * 900000) });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to place order. Please try again.", { id: toastId });
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white dark:bg-[#121320] p-8 md:p-12 rounded-2xl border border-slate-200/70 dark:border-slate-800 shadow-sm flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#b0f1c7] text-[#002111] flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">check_circle</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Order Confirmed!</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Thank you for your order. We have received your order and will dispatch it shortly.
          </p>
          <div className="bg-[#f2f3ff] dark:bg-[#09090e] p-4 rounded-xl w-full text-xs flex justify-between font-bold">
            <span>Order Reference:</span>
            <span className="text-[#003820] dark:text-[#95d4ac]">{orderSuccess.orderNumber || "GB-2025"}</span>
          </div>
          <Button asChild className="w-full bg-[#003820] hover:bg-[#0f5132] text-white mt-2">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 w-full">
      <div className="flex flex-col gap-6">
        <CheckoutSteps currentStep={1} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Forms */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <CheckoutShippingAddress
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelectAddress={setSelectedAddressId}
              onAddNewAddress={handleAddNewAddress}
              isCreatingAddress={isCreatingAddress}
            />

            <CheckoutDeliveryMethod
              selectedMethod={deliveryMethod}
              onSelectMethod={setDeliveryMethod}
            />

            <CheckoutPaymentMethod
              selectedPayment={paymentMethod}
              onSelectPayment={setPaymentMethod}
              transactionId={transactionId}
              onTransactionIdChange={setTransactionId}
            />
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 sticky top-24">
            <CheckoutOrderSummary
              items={items}
              subtotal={subtotal}
              deliveryCharge={deliveryCharge}
              discount={discount}
              total={total}
              onPlaceOrder={handlePlaceOrder}
              isPlacingOrder={isCheckingOut}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-16 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#003820] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
