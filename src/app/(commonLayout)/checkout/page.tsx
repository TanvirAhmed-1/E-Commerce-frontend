"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useGetMyCartQuery, useClearCartMutation } from "@/redux/features/cart/cartApi";
import {
  useGetMyAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} from "@/redux/features/address/addressApi";
import { useCheckoutMutation } from "@/redux/features/order/orderApi";
import { useGetPublicLocationsQuery } from "@/redux/features/shipping/shippingApi";
import { clearCart } from "@/redux/features/cart/cartSlice";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import Link from "next/link";

import CheckoutSteps from "@/components/ui/checkout/CheckoutSteps";
import CheckoutShippingAddress from "@/components/ui/checkout/CheckoutShippingAddress";
import CheckoutPaymentMethod from "@/components/ui/checkout/CheckoutPaymentMethod";
import CheckoutOrderSummary from "@/components/ui/checkout/CheckoutOrderSummary";
import OrderSuccessView from "@/components/ui/checkout/OrderSuccessView";
import { validateAddressForm } from "@/utils/addressValidation";

function CheckoutContent() {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  const [clearDbCart] = useClearCartMutation();
  const { data: dbCartResponse } = useGetMyCartQuery(undefined, { skip: !token });
  const { data: addressesResponse, refetch: refetchAddresses } = useGetMyAddressesQuery(undefined, { skip: !token });
  const { data: locationsResponse } = useGetPublicLocationsQuery(undefined);
  const [createAddress, { isLoading: isCreatingAddress }] = useCreateAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const [checkout, { isLoading: isCheckingOut }] = useCheckoutMutation();

  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bkash" | "nagad">("cod");
  const [transactionId, setTransactionId] = useState("");
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [currentFormData, setCurrentFormData] = useState<any>({ district: "Dhaka", notes: "" });

  const addresses = addressesResponse?.data || [];
  const dbCart = dbCartResponse?.data;
  const items = dbCart?.items || [];
  const subtotal = dbCart?.totalAmount || 0;

  const selectedAddress = addresses.find((a: any) => a._id === selectedAddressId);
  const selectedDistrictName = selectedAddress?.district || currentFormData?.district || "Dhaka";
  const districtsList: any[] = locationsResponse?.data?.districts || [];
  const matchedDistrict = districtsList.find(
    (d: any) => d.name?.toLowerCase() === selectedDistrictName?.toLowerCase()
  );

  const deliveryCharge = matchedDistrict
    ? matchedDistrict.deliveryCharge
    : selectedDistrictName?.toLowerCase() === "dhaka"
    ? 70
    : 130;

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
      toast.success("ঠিকানা সফলভাবে সংরক্ষণ করা হয়েছে!");
      refetchAddresses();
      if (res?.data?._id) setSelectedAddressId(res.data._id);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save address.");
    }
  };

  const handleUpdateAddress = async (id: string, formData: any) => {
    try {
      await updateAddress({ id, data: formData }).unwrap();
      toast.success("ঠিকানা সফলভাবে আপডেট করা হয়েছে!");
      refetchAddresses();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update address.");
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await deleteAddress(id).unwrap();
      toast.success("ঠিকানা মুছে ফেলা হয়েছে!");
      if (selectedAddressId === id) setSelectedAddressId("");
      refetchAddresses();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete address.");
    }
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) return toast.error("Your cart is empty.");

    let finalAddressId = selectedAddressId;
    if (!finalAddressId) {
      const validation = validateAddressForm(currentFormData);
      if (!validation.isValid) {
        const firstError =
          validation.errors.phone ||
          validation.errors.fullName ||
          validation.errors.address ||
          validation.errors.district ||
          validation.errors.upazila ||
          "দয়া করে সঠিক ডেলিভারি তথ্য পূরণ করুন।";
        return toast.error(firstError);
      }
      const addressToastId = toast.loading("Saving delivery address...");
      try {
        const res = await createAddress({
          ...currentFormData,
          fullName: currentFormData.fullName.trim(),
          phone: currentFormData.phone.trim(),
          address: currentFormData.address.trim(),
          isDefault: true,
        }).unwrap();
        const createdId = res?.data?._id || res?._id || res?.data?.id || res?.id;
        if (createdId) {
          finalAddressId = createdId;
          setSelectedAddressId(createdId);
        }
        toast.dismiss(addressToastId);
      } catch (err: any) {
        return toast.error(err?.data?.message || "Failed to save delivery address.", { id: addressToastId });
      }
    }

    if (!finalAddressId) return toast.error("Please add a delivery address.");
    if ((paymentMethod === "bkash" || paymentMethod === "nagad") && !transactionId.trim()) {
      return toast.error(`দয়া করে ${paymentMethod === "bkash" ? "bKash" : "Nagad"} Transaction ID (TrxID) লিখুন।`);
    }

    const toastId = toast.loading("Processing your order...");
    try {
      const selectedObj = addresses.find((a: any) => (a._id || a.id) === finalAddressId);
      const structuredShippingAddress = selectedObj
        ? {
            fullName: selectedObj.fullName,
            phone: selectedObj.phone,
            address: selectedObj.address,
            division: selectedObj.division || "Dhaka",
            district: selectedObj.district || "Dhaka",
            upazila: selectedObj.upazila || "",
            city: selectedObj.district || selectedObj.division || "Dhaka",
          }
        : {
            fullName: currentFormData.fullName?.trim() || "",
            phone: currentFormData.phone?.trim() || "",
            address: currentFormData.address?.trim() || "",
            division: currentFormData.division || "Dhaka",
            district: currentFormData.district || "Dhaka",
            upazila: currentFormData.upazila || "",
            city: currentFormData.district || currentFormData.division || "Dhaka",
          };

      const res = await checkout({
        address: finalAddressId,
        shippingAddress: structuredShippingAddress,
        paymentMethod,
        transactionId: paymentMethod !== "cod" ? transactionId.trim() : undefined,
        deliveryType: "home_delivery",
        deliveryCharge,
        notes: currentFormData?.notes?.trim() || undefined,
      }).unwrap();

      const createdOrderData = res?.data || res || {};
      const enrichedOrderData = {
        ...createdOrderData,
        items:
          createdOrderData?.items && createdOrderData.items.length > 0
            ? createdOrderData.items
            : items.map((cartIt: any) => ({
                product: cartIt.product,
                variant: cartIt.variant,
                quantity: cartIt.quantity,
                price: cartIt.price,
              })),
        shippingAddress:
          createdOrderData?.shippingAddress || structuredShippingAddress,
        deliveryCharge:
          createdOrderData?.deliveryCharge !== undefined
            ? createdOrderData.deliveryCharge
            : deliveryCharge,
        subtotal:
          createdOrderData?.subtotal !== undefined
            ? createdOrderData.subtotal
            : subtotal,
        totalAmount:
          createdOrderData?.totalAmount !== undefined
            ? createdOrderData.totalAmount
            : subtotal + deliveryCharge,
      };

      dispatch(clearCart());
      try {
        await clearDbCart(undefined).unwrap();
      } catch (e) {}
      toast.success("Order placed successfully!", { id: toastId });
      setOrderSuccess(enrichedOrderData);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to place order. Please try again.", { id: toastId });
    }
  };

  if (orderSuccess) {
    return <OrderSuccessView orderData={orderSuccess} />;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 w-full">
      <div className="flex flex-col gap-6">
        <CheckoutSteps currentStep={1} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <CheckoutShippingAddress
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelectAddress={setSelectedAddressId}
              onAddNewAddress={handleAddNewAddress}
              onUpdateAddress={handleUpdateAddress}
              onDeleteAddress={handleDeleteAddress}
              isCreatingAddress={isCreatingAddress}
              onFormDataChange={setCurrentFormData}
            />
            <CheckoutPaymentMethod
              selectedPayment={paymentMethod}
              onSelectPayment={setPaymentMethod}
              transactionId={transactionId}
              onTransactionIdChange={setTransactionId}
            />
          </div>
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
