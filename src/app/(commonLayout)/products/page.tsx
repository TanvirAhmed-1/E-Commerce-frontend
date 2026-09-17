"use client";

import React, { Suspense, useState } from "react";
import { useGetAllProductsQuery } from "@/redux/features/product/productApi";
import { useAddToCartMutation } from "@/redux/features/cart/cartApi";
import { useSearchParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";

import CatalogBanner from "@/components/ui/catalog/CatalogBanner";
import CatalogFilterSidebar from "@/components/ui/catalog/CatalogFilterSidebar";
import CatalogToolbar from "@/components/ui/catalog/CatalogToolbar";
import CatalogProductGrid from "@/components/ui/catalog/CatalogProductGrid";
import CatalogPagination from "@/components/ui/catalog/CatalogPagination";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token, customerType } = useSelector((state: RootState) => state.auth);
  const [addToCartApi] = useAddToCartMutation();

  const categoryParam = searchParams.get("category") || "Plastic Household";
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") || "1");

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("-createdAt");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [minPrice, maxPrice] = selectedPriceRange ? selectedPriceRange.split("-") : ["", ""];

  const { data: productsData, isLoading } = useGetAllProductsQuery({
    category: selectedCategory !== "All Categories" ? selectedCategory : undefined,
    searchTerm: search || undefined,
    page,
    limit: 12,
    sort: sortBy,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  });

  const products = productsData?.data?.data || [];
  const meta = productsData?.data?.meta || { page: 1, limit: 12, total: products.length || 12, totalPage: 1 };

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

  const handleClearFilters = () => {
    setSelectedCategory("Plastic Household");
    setSelectedPriceRange("");
    setSelectedBrand("");
    setInStockOnly(false);
    setSelectedRating(0);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 1. Category Banner */}
      <CatalogBanner
        categoryTitle={selectedCategory || "Household & Kitchen Products"}
        categorySubtitle="Durable and useful products for your everyday home needs. Quality you can trust."
      />

      {/* 2. Main Content Layout (Sidebar + Product Grid) */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Filter Sidebar */}
          <div className="lg:col-span-3">
            <CatalogFilterSidebar
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedPriceRange={selectedPriceRange}
              onSelectPriceRange={setSelectedPriceRange}
              selectedBrand={selectedBrand}
              onSelectBrand={setSelectedBrand}
              inStockOnly={inStockOnly}
              onToggleInStock={setInStockOnly}
              selectedRating={selectedRating}
              onSelectRating={setSelectedRating}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Right Product Grid & Toolbar */}
          <div className="lg:col-span-9 flex flex-col gap-4">
            <CatalogToolbar
              totalCount={meta.total || products.length}
              currentCount={products.length}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            <CatalogProductGrid
              products={products}
              isLoading={isLoading}
              onAddToCart={handleAddToCart}
              customerType={customerType}
              viewMode={viewMode}
            />

            <CatalogPagination
              currentPage={page}
              totalPages={meta.totalPage || 1}
              onPageChange={(p) => router.push(`/products?page=${p}`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-16 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#003820] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
