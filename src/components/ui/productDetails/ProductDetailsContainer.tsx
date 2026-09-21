"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import { useGetProductBySlugQuery } from "@/redux/features/product/productApi";

import { ProductProvider } from "@/components/ui/productDetails/ProductContext";
import ProductBreadcrumb from "@/components/ui/productDetails/ProductBreadcrumb";
import ProductGallery from "@/components/ui/productDetails/ProductGallery";
import ProductHeaderInfo from "@/components/ui/productDetails/ProductHeaderInfo";
import ProductPricingCard from "@/components/ui/productDetails/ProductPricingCard";
import ProductFeatureHighlights from "@/components/ui/productDetails/ProductFeatureHighlights";
import ProductVariantSelector from "@/components/ui/productDetails/ProductVariantSelector";
import ProductQuantityAndActions from "@/components/ui/productDetails/ProductQuantityAndActions";
import ProductDeliveryWarrantyCard from "@/components/ui/productDetails/ProductDeliveryWarrantyCard";
import ProductTabs from "@/components/ui/productDetails/ProductTabs";
import RelatedProductsSection from "@/components/ui/productDetails/RelatedProductsSection";
import ProductDetailsSkeleton from "@/components/ui/productDetails/ProductDetailsSkeleton";
import ProductNotFound from "@/components/ui/productDetails/ProductNotFound";

function ProductDetailsContent() {
  const params = useParams();
  const slug = params?.id as string;

  const { data: responseData, isLoading, error } = useGetProductBySlugQuery(slug, {
    skip: !slug,
  });

  const product = responseData?.data;

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (error || !product) {
    return <ProductNotFound />;
  }

  return (
    <ProductProvider product={product}>
      <main className="w-full bg-[#faf8ff] dark:bg-[#0B0B14] min-h-screen text-slate-900 dark:text-slate-100 transition-colors">
        <ProductBreadcrumb />

        {/* Main 2-Column Product Showcase */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Product Media Gallery */}
            <div className="lg:col-span-5">
              <ProductGallery />
            </div>

            {/* Right: Core Information & Purchasing Actions */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="bg-white dark:bg-[#121320] p-4 md:p-6 rounded-xl shadow-xs border border-slate-100 dark:border-slate-800/80 flex flex-col gap-3">
                <ProductHeaderInfo />
                <ProductPricingCard />
                <ProductFeatureHighlights />
                <ProductVariantSelector />
                <ProductQuantityAndActions />
              </div>

              <ProductDeliveryWarrantyCard />
            </div>
          </div>
        </section>

        {/* Detailed Tabs (Description, Specifications, Reviews, Warranty) */}
        <ProductTabs />

        {/* Related Products Recommendation */}
        <RelatedProductsSection />
      </main>
    </ProductProvider>
  );
}

export default function ProductDetailsContainer() {
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductDetailsContent />
    </Suspense>
  );
}
