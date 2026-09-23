import React, { Suspense } from "react";
import type { Metadata } from "next";
import CategoryContainer from "@/components/ui/product/CategoryContainer";

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const category = resolvedParams?.category;

  if (category && typeof category === "string") {
    const formattedCategory = category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return {
      title: `${formattedCategory} - Buy Online | Best Deals`,
      description: `Explore top quality ${formattedCategory} with verified authenticity, official warranty, and fast delivery across Bangladesh.`,
    };
  }

  return {
    title: "All Products - Explore Household & Kitchen Appliances",
    description: "Discover our full catalog of authentic kitchenware, appliances, and everyday essentials at best prices.",
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const categoryParam = typeof resolvedParams?.category === "string" ? resolvedParams.category : "";
  const searchParam = typeof resolvedParams?.search === "string" ? resolvedParams.search : "";
  const pageParam = typeof resolvedParams?.page === "string" ? Number(resolvedParams.page) : 1;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-16 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#003820] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <CategoryContainer
        initialCategory={categoryParam}
        initialSearch={searchParam}
        initialPage={pageParam}
      />
    </Suspense>
  );
}
