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
        const name = attr.attribute?.name || attr.name;
        if (name) {
          const paramKey = name.toLowerCase().replace(/\s+/g, "_");
          initial[name] = searchParams.get(paramKey) || attr.value;
        }
      });

      // Ensure all variantAttributes keys are initialized
      if (product.variantAttributes && Array.isArray(product.variantAttributes)) {
        product.variantAttributes.forEach((va: any) => {
          if (va.name && !initial[va.name] && Array.isArray(va.values) && va.values.length > 0) {
            initial[va.name] = va.values[0];
          }
        });
      }

      setSelectedOptions(initial);
    }
  }, [product, searchParams]);

  // Match the currently selected variant
  const selectedVariant = useMemo(() => {
    if (!product?.hasVariants || !product.productVariants || !Array.isArray(product.productVariants)) return null;

    const normalizedSelected: Record<string, string> = {};
    Object.entries(selectedOptions).forEach(([key, val]) => {
      if (key && val) {
        normalizedSelected[key.trim().toLowerCase()] = val.trim().toLowerCase();
      }
    });

    return (
      product.productVariants.find((variant: any) => {
        if (!variant.isActive) return false;
        if (!variant.attributes || !Array.isArray(variant.attributes)) return false;

        return variant.attributes.every((attr: any) => {
          const attrName = (attr.attribute?.name || attr.name || "").trim().toLowerCase();
          if (!attrName) return true;

          const selectedVal = normalizedSelected[attrName];
          if (!selectedVal) return false;

          return selectedVal === attr.value?.trim().toLowerCase();
        });
      }) || null
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
    if (product?.variantAttributes && Array.isArray(product.variantAttributes) && product.variantAttributes.length > 0) {
      const result: Record<string, string[]> = {};
      product.variantAttributes.forEach((va: any) => {
        if (va.name && Array.isArray(va.values)) {
          result[va.name] = va.values;
        }
      });
      return result;
    }

    const map: Record<string, Set<string>> = {};
    product?.productVariants?.forEach((variant: any) => {
      if (!variant.isActive) return;
      variant.attributes?.forEach((attr: any) => {
        const name = attr.attribute?.name || attr.name;
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
  const maxStock = product?.hasVariants ? (selectedVariant?.stock ?? 0) : (product?.totalStock ?? 0);
  const isOutOfStock = maxStock <= 0 || (Boolean(product?.hasVariants) && !selectedVariant);
  const currentPrice = product ? getDisplayPrice(product, customerType, selectedVariant) : 0;
  const rawOriginalPrice = product?.hasVariants && selectedVariant?.price ? selectedVariant.price : product?.basePrice;
  const originalPrice = rawOriginalPrice && rawOriginalPrice > currentPrice ? rawOriginalPrice : undefined;
  const discountPercentage = product?.productDiscount && product.productDiscount > 0 ? product.productDiscount : undefined;

  const selectOption = (attrName: string, value: string) => {
    setSelectedOptions((prev) => {
      const updated = { ...prev };
      const existingKey = Object.keys(updated).find(
        (k) => k.trim().toLowerCase() === attrName.trim().toLowerCase()
      );
      if (existingKey) {
        updated[existingKey] = value;
      } else {
        updated[attrName] = value;
      }
      return updated;
    });
    setQuantity(1);

    if (product?.productVariants) {
      const match = product.productVariants.find((v: any) =>
        v.isActive !== false &&
        v.attributes?.some((a: any) =>
          (a.attribute?.name || a.name || "").toString().trim().toLowerCase() === attrName.trim().toLowerCase() &&
          a.value?.toString().trim().toLowerCase() === value.trim().toLowerCase()
        ) &&
        v.images?.[0]
      );
      if (match?.images?.[0]) {
        setActiveImage(match.images[0]);
      }
    }
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
    if (!product) return;

    if (product?.hasVariants && !selectedVariant) {
      toast.error("Please select a valid product variant.");
      return;
    }

    if (isOutOfStock || maxStock <= 0) {
      toast.error(product?.hasVariants ? "This product variant is currently out of stock." : "This product is currently out of stock.");
      return;
    }

    const variantId = product?.hasVariants
      ? selectedVariant?._id
      : (product?.productVariants?.[0]?._id || product?._id);

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
    if (isOutOfStock || maxStock <= 0) {
      toast.error(product?.hasVariants ? "This product variant is currently out of stock." : "This product is currently out of stock.");
      return;
    }
    if (product?.hasVariants && !selectedVariant) {
      toast.error("Please select a valid product variant.");
      return;
    }

    const variantId = product?.hasVariants
      ? selectedVariant?._id
      : (product?.productVariants?.[0]?._id || product?._id);

    try {
      await addToCartApi({ product: product._id, variant: variantId, quantity }).unwrap();
      router.push("/checkout");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to proceed to checkout.");
    }
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
