"use client";

import React from "react";
import { useGetAllProductsQuery } from "@/redux/features/product/productApi";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAddToCartMutation } from "@/redux/features/cart/cartApi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import CategoryIconsRow from "@/components/ui/home/CategoryIconsRow";
import HomeFeaturedProducts from "@/components/ui/home/HomeFeaturedProducts";
import HomePromoBanner from "@/components/ui/home/HomePromoBanner";
import HomeBestSellers from "@/components/ui/home/HomeBestSellers";
import WhyChooseUsBar from "@/components/ui/home/WhyChooseUsBar";
import HomeCustomerReviews from "@/components/ui/home/HomeCustomerReviews";

export default function HomeMainContent() {
  const router = useRouter();
  const { token, customerType } = useSelector((state: RootState) => state.auth);
  const [addToCartApi] = useAddToCartMutation();

  const { data: productsData } = useGetAllProductsQuery(undefined);
  const products = productsData?.data?.data || [];

  const handleAddToCart = async (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      toast.error("Please log in to add items to your cart.");
      router.push("/login");
      return;
    }

    const defaultVariant = product.productVariants?.[0];
    const variantId = defaultVariant?._id || product._id;

    try {
      await addToCartApi({
        product: product._id,
        variant: variantId,
        quantity: 1,
      }).unwrap();
      toast.success(`${product.name} added to cart!`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add to cart.");
    }
  };

  return (
    <>
      {/* Category Icons Row */}
      <CategoryIconsRow />

      {/* Featured Products */}
      <HomeFeaturedProducts
        products={products}
        onAddToCart={handleAddToCart}
        customerType={customerType}
      />

      {/* Promo Banner */}
      <HomePromoBanner />

      {/* Best Sellers */}
      <HomeBestSellers
        products={products}
        onAddToCart={handleAddToCart}
        customerType={customerType}
      />

      {/* Value Proposition Bar */}
      <WhyChooseUsBar />

      {/* Customer Reviews */}
      <HomeCustomerReviews />
    </>
  );
}
