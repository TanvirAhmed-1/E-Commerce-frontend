"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";
import { getDisplayPrice } from "@/utils/priceHelper";
import { useGetProductBySlugQuery } from "@/redux/features/product/productApi";
import {
  useGetWishListQuery,
  useToggleWishListMutation,
  useRemoveFromWishListMutation,
} from "@/redux/features/wishList/wishListApi";
import { useAddToCartMutation } from "@/redux/features/cart/cartApi";
import {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useUploadImagesMutation,
} from "@/redux/features/review/reviewApi";
import { TabType } from "./ProductTabs";

export function useProductDetails() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params.id as string;
  const { token, customerType } = useSelector((state: RootState) => state.auth);

  const { data: responseData, isLoading, error } = useGetProductBySlugQuery(slug);
  const product = responseData?.data;

  const { data: wishlistResponse, refetch: refetchWishlist } = useGetWishListQuery(undefined, { skip: !token });
  const [toggleWishList, { isLoading: isTogglingWishlist }] = useToggleWishListMutation();
  const [removeFromWishlist] = useRemoveFromWishListMutation();
  const [addToCartApi, { isLoading: isAddingToCart }] = useAddToCartMutation();

  const [count, setCount] = useState(1);
  const [activeImage, setActiveImage] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<TabType>("description");

  const { data: reviewsResponse, isLoading: isLoadingReviews, refetch: refetchReviews } = useGetProductReviewsQuery(
    product?._id,
    { skip: !product?._id }
  );
  const [createReview, { isLoading: isCreatingReview }] = useCreateReviewMutation();
  const [uploadImages] = useUploadImagesMutation();

  const wishlistProducts = wishlistResponse?.data?.products || [];
  const isWishlisted = product ? wishlistProducts.some((p: any) => p._id === product._id) : false;

  useEffect(() => {
    if (product?.hasVariants && product.productVariants?.length > 0) {
      const defaultVariant = product.productVariants.find((v: any) => v.isActive && v.stock > 0) || product.productVariants[0];
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

  const selectedVariant = useMemo(() => {
    if (!product?.hasVariants || !product.productVariants) return null;
    return product.productVariants.find((variant: any) =>
      variant.isActive &&
      variant.attributes?.every((attr: any) => selectedOptions[attr.attribute?.name] === attr.value)
    );
  }, [product, selectedOptions]);

  useEffect(() => {
    if (selectedVariant?.images?.[0]) {
      setActiveImage(selectedVariant.images[0]);
    }
  }, [selectedVariant]);

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

  const allImages = useMemo(() => {
    if (!product) return [];
    const base = [product.thumbnail, ...(product.images || [])].filter(Boolean);
    const variantImgs = selectedVariant?.images || [];
    return variantImgs.length > 0 ? [...variantImgs, ...base.filter((img: string) => !variantImgs.includes(img))] : base;
  }, [product, selectedVariant]);

  const maxStock = product?.hasVariants ? selectedVariant?.stock || 0 : product?.totalStock ?? 10;
  const currentPrice = product ? getDisplayPrice(product, customerType, selectedVariant) : 3850;
  const originalPrice = (product?.hasVariants && selectedVariant?.price ? selectedVariant.price : product?.basePrice) || 5200;
  const productName = product?.name || "Prestige Deluxe Duo-Pot Electric Rice Cooker & Steamer - 2.8 Liters (1000W)";

  const handleOptionSelect = (attrName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [attrName]: value }));
    setCount(1);
  };

  const handleQuantityChange = (type: "plus" | "minus") => {
    setCount((prev) => (type === "plus" ? Math.min(prev + 1, maxStock || 10) : Math.max(1, prev - 1)));
  };

  const handleAddToCart = async () => {
    if (!token) {
      toast.error("Please log in to add items to your cart.");
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    if (!product) return;
    const variantId = selectedVariant?._id || product._id;
    try {
      await addToCartApi({ product: product._id, variant: variantId, quantity: count }).unwrap();
      toast.success(`${count}x ${product.name} added to cart!`);
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
    await handleAddToCart();
    router.push("/checkout");
  };

  const handleWishlistToggle = async () => {
    if (!token) {
      toast.error("Please log in to update your wishlist.");
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    if (!product) return;
    try {
      if (isWishlisted) {
        await removeFromWishlist(product._id).unwrap();
        toast.success("Removed from wishlist");
      } else {
        await toggleWishList({ productId: product._id }).unwrap();
        toast.success("Saved to wishlist");
      }
      refetchWishlist();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update wishlist.");
    }
  };

  const handleReviewSubmit = async (rating: number, message: string, images: File[]) => {
    if (!token) {
      toast.error("Please log in to submit a review.");
      return;
    }
    const toastId = toast.loading("Submitting review...");
    try {
      let uploadedUrls: string[] = [];
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((img) => formData.append("images", img));
        const uploadRes = await uploadImages(formData).unwrap();
        if (uploadRes?.success && Array.isArray(uploadRes.data)) {
          uploadedUrls = uploadRes.data.map((item: any) => item.url);
        }
      }
      await createReview({ product: product._id, rating, message, images: uploadedUrls }).unwrap();
      toast.success("Review submitted successfully!", { id: toastId });
      refetchReviews();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit review.", { id: toastId });
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard!");
    }
  };

  return {
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
    reviews: reviewsResponse?.data,
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
  };
}
