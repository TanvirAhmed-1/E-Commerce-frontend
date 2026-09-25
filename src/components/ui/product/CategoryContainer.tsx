"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import { RootState } from "@/redux/store";
import { useGetAllProductsQuery } from "@/redux/features/product/productApi";
import { useAddToCartMutation } from "@/redux/features/cart/cartApi";
import { useGetMenuCategoryQuery } from "@/redux/features/home/homeApi";

import CatalogBanner from "@/components/ui/product/CatalogBanner";
import CatalogFilterSidebar from "@/components/ui/product/CatalogFilterSidebar";
import CatalogToolbar from "@/components/ui/product/CatalogToolbar";
import CatalogProductGrid from "@/components/ui/product/CatalogProductCard";
import CatalogPagination from "@/components/ui/product/CatalogPagination";
import CategorySeoFooter from "@/components/ui/product/CategorySeoFooter";
import Container from "@/components/shared/Container";

interface CategoryContainerProps {
  initialCategory?: string;
  initialSearch?: string;
  initialPage?: number;
}

export default function CategoryContainer({
  initialCategory = "",
  initialSearch = "",
  initialPage = 1,
}: CategoryContainerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token, customerType } = useSelector((state: RootState) => state.auth);
  const [addToCartApi] = useAddToCartMutation();

  const categoryParam = searchParams.get("category") || initialCategory;
  const search = searchParams.get("search") || initialSearch;
  const page = Number(searchParams.get("page") || initialPage || "1");

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || "All Products");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("-createdAt");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Sync selectedCategory with categoryParam in URL
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory("All Products");
    }
  }, [categoryParam]);

  // Load category tree for title, banner, subtitle, and SEO footer matching
  const { data: categoriesRes } = useGetMenuCategoryQuery(undefined);
  const categoriesList = categoriesRes?.data || [];

  const matchedCategory = useMemo(() => {
    if (!selectedCategory || selectedCategory === "All Products" || !Array.isArray(categoriesList)) return null;
    const target = selectedCategory.toLowerCase().trim();

    const findInTree = (nodes: any[]): any => {
      for (const node of nodes) {
        const nameMatch = node.name && node.name.toLowerCase().trim() === target;
        const slugMatch = node.slug && node.slug.toLowerCase().trim() === target;
        const nameSlugMatch = node.name && node.name.toLowerCase().trim().replace(/\s+/g, "-") === target;
        const targetSlugMatch = target.replace(/[-_]/g, " ") === (node.name || "").toLowerCase().trim();
        const idMatch = node._id && node._id === selectedCategory;

        if (nameMatch || slugMatch || nameSlugMatch || targetSlugMatch || idMatch) {
          return node;
        }
        if (node.children && node.children.length > 0) {
          const found = findInTree(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findInTree(categoriesList);
  }, [selectedCategory, categoriesList]);

  const [minPrice, maxPrice] = selectedPriceRange ? selectedPriceRange.split("-") : ["", ""];

  const { data: productsData, isLoading } = useGetAllProductsQuery({
    category:
      selectedCategory && selectedCategory !== "All Products" && selectedCategory !== "All Categories"
        ? matchedCategory?.slug || matchedCategory?.name || selectedCategory
        : undefined,
    searchTerm: search || undefined,
    page,
    limit: 12,
    sort: sortBy,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  });

  const products = productsData?.data?.data || [];
  const meta = productsData?.data?.meta || { page: 1, limit: 12, total: products.length || 12, totalPage: 1 };

  // Dynamically extract brands from products returned by backend
  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    products.forEach((p: any) => {
      const bName = typeof p.brand === "string" ? p.brand : p.brand?.name;
      if (bName && typeof bName === "string" && bName.trim()) {
        brandsSet.add(bName.trim());
      }
    });
    return Array.from(brandsSet);
  }, [products]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === "All Products" || cat === "All Categories" || !cat) {
      router.push("/products");
    } else {
      router.push(`/products?category=${encodeURIComponent(cat.toLowerCase().replace(/\s+/g, "-"))}`);
    }
  };

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
    setSelectedCategory("All Products");
    setSelectedPriceRange("");
    setSelectedBrand("");
    setInStockOnly(false);
    setSelectedRating(0);
    router.push("/products");
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* 1. Category Hero Banner */}
      <CatalogBanner
        categoryName={matchedCategory?.name || (selectedCategory !== "All Products" ? selectedCategory : "All Products")}
        categoryTitle={matchedCategory?.metaTitle || matchedCategory?.title || matchedCategory?.name || (selectedCategory !== "All Products" ? selectedCategory : "Explore All Products")}
        categorySubtitle={matchedCategory?.subtitle}
        categoryBanner={matchedCategory?.banner}
        categoryImage={matchedCategory?.image || matchedCategory?.thumbnail}
      />

      {/* 2. Main Content Layout (Sidebar + Product Grid) */}
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-15 gap-3">
          {/* Left Filter Sidebar */}
          <div className="lg:col-span-3">
            <CatalogFilterSidebar
              categoriesList={categoriesList}
              availableBrands={availableBrands}
              selectedCategory={matchedCategory?.name || selectedCategory}
              onSelectCategory={handleCategorySelect}
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
          <div className="lg:col-span-12 flex flex-col gap-4">
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
      </Container>

      {/* 3. Category SEO Description Section */}
      <CategorySeoFooter
        categoryName={matchedCategory?.name || selectedCategory}
        categoryTitle={matchedCategory?.metaTitle || matchedCategory?.title || matchedCategory?.name || selectedCategory}
        description={matchedCategory?.description}
      />
    </div>
  );
}