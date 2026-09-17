"use client";

import React, { Suspense } from "react";
import toast from "react-hot-toast";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import ProductBreadcrumb from "@/components/ui/productDetails/ProductBreadcrumb";
import ProductGallery from "@/components/ui/productDetails/ProductGallery";
import ProductHeaderInfo from "@/components/ui/productDetails/ProductHeaderInfo";
import ProductPricingCard from "@/components/ui/productDetails/ProductPricingCard";
import ProductFeatureHighlights from "@/components/ui/productDetails/ProductFeatureHighlights";
import ProductVariantSelector from "@/components/ui/productDetails/ProductVariantSelector";
import ProductQuantityAndActions from "@/components/ui/productDetails/ProductQuantityAndActions";
import ProductDeliveryWarrantyCard from "@/components/ui/productDetails/ProductDeliveryWarrantyCard";
import ProductTabs from "@/components/ui/productDetails/ProductTabs";
import ProductDescriptionTab from "@/components/ui/productDetails/ProductDescriptionTab";
import ProductSpecsTab from "@/components/ui/productDetails/ProductSpecsTab";
import ProductReviewsTab from "@/components/ui/productDetails/ProductReviewsTab";
import ProductWarrantyTab from "@/components/ui/productDetails/ProductWarrantyTab";
import RelatedProductsSection from "@/components/ui/productDetails/RelatedProductsSection";
import { useProductDetails } from "@/components/ui/productDetails/useProductDetails";

function SingleProductPage() {
  const {
    product,
    isLoading,
    error,
    token,
    count,
    activeImage,
    setActiveImage,
    allImages,
    selectedOptions,
    activeTab,
    setActiveTab,
    maxStock,
    currentPrice,
    originalPrice,
    productName,
    isWishlisted,
    isTogglingWishlist,
    isAddingToCart,
    uniqueAttributes,
    reviews,
    isLoadingReviews,
    isCreatingReview,
    handleOptionSelect,
    handleQuantityChange,
    handleAddToCart,
    handleInstantBuy,
    handleWishlistToggle,
    handleReviewSubmit,
    handleCopyLink,
    router,
  } = useProductDetails();

  if (isLoading) {
    return (
      <div className="bg-[#faf8ff] dark:bg-[#0B0B14] min-h-screen py-12 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-[#003820] dark:border-[#95d4ac] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="bg-[#faf8ff] dark:bg-[#0B0B14] min-h-screen py-16 flex flex-col items-center justify-center px-4">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Product Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">The product you are looking for is unavailable.</p>
        <Button onClick={() => router.push("/products")} className="mt-6 bg-[#003820] text-white">Back to Catalog</Button>
      </div>
    );
  }

  return (
    <main className="w-full bg-[#faf8ff] dark:bg-[#0B0B14] min-h-screen text-slate-900 dark:text-slate-100 transition-colors">
      <ProductBreadcrumb
        productName={productName}
        categoryName={product?.category?.name || "Kitchen Appliances"}
        subCategoryName="Rice Cookers"
        sku={product?.sku || "GB-RC-2800-SS"}
      />

      {/* Main 2-Column Showcase */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <ProductGallery
              images={allImages}
              activeImage={activeImage}
              onSelectImage={setActiveImage}
              productName={productName}
              discountBadge={product?.productDiscount ? `-${product.productDiscount}% OFF` : "-26% OFF"}
              isWishlisted={isWishlisted}
              onToggleWishlist={handleWishlistToggle}
              isTogglingWishlist={isTogglingWishlist}
            />
          </div>

          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="bg-white dark:bg-[#121320] p-4 md:p-6 rounded-xl shadow-xs border border-slate-100 dark:border-slate-800/80 flex flex-col gap-3">
              <ProductHeaderInfo
                productName={productName}
                stockCount={maxStock}
                rating={product?.averageRating || 4.8}
                totalRatingsCount={reviews?.length || 142}
                onReviewsClick={() => {
                  setActiveTab("reviews");
                  document.getElementById("product-tabs-section")?.scrollIntoView({ behavior: "smooth" });
                }}
              />
              <ProductPricingCard
                currentPrice={currentPrice}
                originalPrice={originalPrice}
                discountBadge={product?.productDiscount ? `-${product.productDiscount}% OFF` : "-26% OFF"}
              />
              <ProductFeatureHighlights />
              <hr className="border-0 h-[1px] bg-slate-100 dark:bg-slate-800 my-1" />
              <ProductVariantSelector
                hasVariants={product?.hasVariants}
                uniqueAttributes={uniqueAttributes}
                selectedOptions={selectedOptions}
                onOptionSelect={handleOptionSelect}
                productVariants={product?.productVariants}
              />
              <ProductQuantityAndActions
                quantity={count}
                onQuantityChange={handleQuantityChange}
                maxStock={maxStock}
                totalPrice={currentPrice * count}
                onAddToCart={handleAddToCart}
                onInstantBuy={handleInstantBuy}
                isAddingToCart={isAddingToCart}
                onCopyLink={handleCopyLink}
              />
            </div>
            <ProductDeliveryWarrantyCard />
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <div id="product-tabs-section">
        <ProductTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          reviewsCount={reviews?.length || 142}
        >
          {activeTab === "description" && (
            <ProductDescriptionTab
              customDescriptionHtml={product?.description}
              shortDescription={product?.shortDescription}
            />
          )}
          {activeTab === "specs" && (
            <ProductSpecsTab
              categoryName={product?.category?.name}
              sku={product?.sku}
              stock={maxStock}
            />
          )}
          {activeTab === "reviews" && (
            <ProductReviewsTab
              productId={product?._id}
              reviews={reviews}
              isLoadingReviews={isLoadingReviews}
              token={token}
              onReviewSubmit={handleReviewSubmit}
              isSubmittingReview={isCreatingReview}
              onLoginRedirect={() => router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)}
            />
          )}
          {activeTab === "warranty" && <ProductWarrantyTab />}
        </ProductTabs>
      </div>

      <RelatedProductsSection onAddToCartItem={(item) => toast.success(`${item.name} added to cart!`)} />
    </main>
  );
}

export default function SingleProductPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#faf8ff] dark:bg-[#0B0B14] min-h-screen py-12 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#003820] dark:border-[#95d4ac] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <SingleProductPage />
    </Suspense>
  );
}
