"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";
import { getDisplayPrice } from "@/utils/priceHelper";
import { useAddToCartMutation } from "@/redux/features/cart/cartApi";
import { TabType } from "./ProductTabs";

export interface ProductContextType {
  product: any;
  selectedVariant: any;
  selectedOptions: Record<string, string>;
  selectOption: (name: string, value: string) => void;
  uniqueAttributes: Record<string, string[]>;
  activeImage: string;
  setActiveImage: (url: string) => void;
  allImages: string[];
  quantity: number;
  handleQuantityChange: (type: "plus" | "minus") => void;
  currentPrice: number;
  originalPrice?: number;
  discountPercentage?: number;
  maxStock: number;
  isOutOfStock: boolean;
  isAddingToCart: boolean;
  handleAddToCart: () => Promise<void>;
  handleInstantBuy: () => Promise<void>;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{
  product: any;
  children: React.ReactNode;
}> = ({ product, children }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, customerType } = useSelector((state: RootState) => state.auth);
  const [addToCartApi, { isLoading: isAddingToCart }] = useAddToCartMutation();

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<TabType>("description");

  // Initialize selected variant options from URL query or default first variant
  useEffect(() => {
    if (product?.hasVariants && product.productVariants?.length > 0) {
      const defaultVariant =
        product.productVariants.find((v: any) => v.isActive && v.stock > 0) ||
        product.productVariants[0];

      const initial: Record<string, string> = {};
      defaultVariant?.attributes?.forEach((attr: any) => {
        const name = attr.attribute?.name;
        if (name) {
          const paramKey = name.toLowerCase().replace(/\s+/g, "_");
          initial[name] = searchParams.get(paramKey) || attr.value;
        }
      });
      setSelectedOptions(initial);
    }
  }, [product, searchParams]);

  // Match the currently selected variant
  const selectedVariant = useMemo(() => {
    if (!product?.hasVariants || !product.productVariants) return null;
    return (
      product.productVariants.find(
        (variant: any) =>
          variant.isActive &&
          variant.attributes?.every(
            (attr: any) => selectedOptions[attr.attribute?.name] === attr.value
          )
      ) || null
    );
  }, [product, selectedOptions]);

  // Sync active image when selected variant changes
  useEffect(() => {
    if (selectedVariant?.images?.[0]) {
      setActiveImage(selectedVariant.images[0]);
    }
  }, [selectedVariant]);

  // Compute unique attributes for variant selector
  const uniqueAttributes = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    product?.productVariants?.forEach((variant: any) => {
      if (!variant.isActive) return;
      variant.attributes?.forEach((attr: any) => {
        const name = attr.attribute?.name;
        if (name && attr.value) {
          if (!map[name]) map[name] = new Set<string>();
          map[name].add(attr.value);
        }
      });
    });

    const result: Record<string, string[]> = {};
    Object.keys(map).forEach((key) => {
      result[key] = Array.from(map[key]);
    });
    return result;
  }, [product]);

  // Combine gallery images (variant images prioritized + base product images)
  const allImages = useMemo(() => {
    if (!product) return [];
    const base = [product.thumbnail, ...(product.images || [])].filter(Boolean);
    const variantImgs = selectedVariant?.images || [];
    return variantImgs.length > 0
      ? [...variantImgs, ...base.filter((img: string) => !variantImgs.includes(img))]
      : base;
  }, [product, selectedVariant]);

  // Stock & Pricing calculations
  const maxStock = product?.hasVariants ? selectedVariant?.stock || 0 : product?.totalStock ?? 0;
  const isOutOfStock = maxStock === 0;
  const currentPrice = product ? getDisplayPrice(product, customerType, selectedVariant) : 0;
  const rawOriginalPrice = product?.hasVariants && selectedVariant?.price ? selectedVariant.price : product?.basePrice;
  const originalPrice = rawOriginalPrice && rawOriginalPrice > currentPrice ? rawOriginalPrice : undefined;
  const discountPercentage = product?.productDiscount && product.productDiscount > 0 ? product.productDiscount : undefined;

  const selectOption = (attrName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [attrName]: value }));
    setQuantity(1);
  };

  const handleQuantityChange = (type: "plus" | "minus") => {
    setQuantity((prev) =>
      type === "plus" ? Math.min(prev + 1, maxStock || 1) : Math.max(1, prev - 1)
    );
  };

  const handleAddToCart = async () => {
    if (!token) {
      toast.error("Please log in to add items to your cart.");
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    if (!product || isOutOfStock) return;

    const variantId = selectedVariant?._id || product._id;
    try {
      await addToCartApi({ product: product._id, variant: variantId, quantity }).unwrap();
      toast.success(`${quantity}x ${product.name} added to cart!`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add to cart.");
    }
  };

  const handleInstantBuy = async () => {
    if (!token) {
      toast.error("Please log in to proceed with checkout.");
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    if (isOutOfStock) return;

    await handleAddToCart();
    router.push("/checkout");
  };

  const value = {
    product,
    selectedVariant,
    selectedOptions,
    selectOption,
    uniqueAttributes,
    activeImage,
    setActiveImage,
    allImages,
    quantity,
    handleQuantityChange,
    currentPrice,
    originalPrice,
    discountPercentage,
    maxStock,
    isOutOfStock,
    isAddingToCart,
    handleAddToCart,
    handleInstantBuy,
    activeTab,
    setActiveTab,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};
