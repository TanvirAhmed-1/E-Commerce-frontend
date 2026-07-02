"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Container from "@/components/shared/Container";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useGetProductBySlugQuery } from "@/redux/features/product/productApi";
import { useGetWishListQuery, useToggleWishListMutation, useRemoveFromWishListMutation } from "@/redux/features/wishList/wishListApi";
import { renderStars } from "@/utils/renderStars";
import { Button } from "@/components/ui/button";
import { FaMinus, FaPlus, FaRegHeart, FaHeart } from "react-icons/fa";
import { ShoppingBag,CheckCircle, AlertCircle, Shield, Truck, Star, X, UploadCloud, Eye } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAddToCartMutation } from "@/redux/features/cart/cartApi";
import toast from "react-hot-toast";
import { getDisplayPrice } from "@/utils/priceHelper";
import {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useUploadImagesMutation,
} from "@/redux/features/review/reviewApi";

function SingleProductPage() {
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
  const [addToCartApi] = useAddToCartMutation();

  const [count, setCount] = useState(1);
  const [activeImage, setActiveImage] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("description");

  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewMessage, setReviewMessage] = useState("");
  const [localImages, setLocalImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { data: reviewsResponse, isLoading: isLoadingReviews, refetch: refetchReviews } = useGetProductReviewsQuery(product?._id, { skip: !product?._id });
  const [createReview, { isLoading: isCreatingReview }] = useCreateReviewMutation();
  const [uploadImages] = useUploadImagesMutation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files);
      const updated = [...localImages, ...filesArr].slice(0, 5); // Limit to 5 images
      setLocalImages(updated);
    }
  };

  const removeLocalImage = (idx: number) => {
    setLocalImages(localImages.filter((_, i) => i !== idx));
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please login to write a review.");
      return;
    }
    if (reviewMessage.trim().length < 5) {
      toast.error("Review message must be at least 5 characters long.");
      return;
    }

    const toastId = toast.loading("Submitting your review...");
    try {
      setIsUploading(true);
      let uploadedUrls: string[] = [];

      // 1. Upload images if any
      if (localImages.length > 0) {
        const formData = new FormData();
        localImages.forEach((img) => {
          formData.append("images", img);
        });
        const uploadRes = await uploadImages(formData).unwrap();
        if (uploadRes?.success && Array.isArray(uploadRes.data)) {
          uploadedUrls = uploadRes.data.map((item: any) => item.url);
        }
      }

      // 2. Submit review
      await createReview({
        product: product._id,
        rating: reviewRating,
        message: reviewMessage,
        images: uploadedUrls,
      }).unwrap();

      toast.success("Review submitted successfully! Thank you.", { id: toastId });
      setReviewMessage("");
      setLocalImages([]);
      setReviewRating(5);
      refetchReviews();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || err?.message || "Failed to submit review.", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const reviews = reviewsResponse?.data || [];

  const wishlistProducts = wishlistResponse?.data?.products || [];
  const isWishlisted = product ? wishlistProducts.some((p: any) => p._id === product._id) : false;

  // Set default selection when product changes, prioritizing URL query params
  React.useEffect(() => {
    if (product) {
      const initial: Record<string, string> = {};
      if (product.hasVariants && product.productVariants?.length > 0) {
        const defaultVariant = product.productVariants.find((v: any) => v.isActive && v.stock > 0) || product.productVariants[0];
        defaultVariant.attributes?.forEach((attr: any) => {
          const name = attr.attribute?.name;
          if (name) {
            const paramKey = name.toLowerCase().replace(/\s+/g, "_");
            const urlVal = searchParams.get(paramKey);
            if (urlVal) {
              initial[name] = urlVal;
            } else {
              initial[name] = attr.value;
            }
          }
        });
      }
      setSelectedOptions(initial);
    }
  }, [product, searchParams]);

  // Sync selectedOptions to URL query parameters in real-time
  React.useEffect(() => {
    if (typeof window !== "undefined" && Object.keys(selectedOptions).length > 0) {
      const url = new URL(window.location.href);
      Object.entries(selectedOptions).forEach(([key, val]) => {
        const paramKey = key.toLowerCase().replace(/\s+/g, "_");
        url.searchParams.set(paramKey, val);
      });
      window.history.replaceState({}, "", url.pathname + url.search);
    }
  }, [selectedOptions]);

  // Find currently selected variant matching selected options
  const selectedVariant = React.useMemo(() => {
    if (!product || !product.hasVariants || !product.productVariants) return null;
    return product.productVariants.find((variant: any) => {
      if (!variant.isActive) return false;
      return variant.attributes?.every((attr: any) => {
        const name = attr.attribute?.name;
        return selectedOptions[name] === attr.value;
      });
    });
  }, [product, selectedOptions]);

  // Sync active image with variant's first image
  React.useEffect(() => {
    if (selectedVariant?.images?.[0]) {
      setActiveImage(selectedVariant.images[0]);
    }
  }, [selectedVariant]);

  // Group the variants attributes
  const uniqueAttributes = React.useMemo(() => {
    const map: Record<string, Set<string>> = {};
    product?.productVariants?.forEach((variant: any) => {
      if (!variant.isActive) return;
      variant.attributes?.forEach((attr: any) => {
        const name = attr.attribute?.name;
        if (name && attr.value) {
          if (!map[name]) {
            map[name] = new Set<string>();
          }
          map[name].add(attr.value);
        }
      });
    });
    
    const result: Record<string, string[]> = {};
    Object.keys(map).forEach(key => {
      result[key] = Array.from(map[key]);
    });
    return result;
  }, [product]);

  // Fallback for active image
  const variantImages = selectedVariant?.images || [];
  const allImages = React.useMemo(() => {
    if (!product) return [];
    const baseList = [product.thumbnail, ...(product.images || [])].filter(Boolean);
    if (variantImages.length > 0) {
      return [...variantImages, ...baseList.filter((img: string) => !variantImages.includes(img))];
    }
    return baseList;
  }, [product, variantImages]);

  const handleOptionSelect = (attrName: string, value: string) => {
    const newOptions = { ...selectedOptions, [attrName]: value };
    
    const exactMatch = product.productVariants?.find((variant: any) => 
      variant.isActive && variant.attributes?.every((attr: any) => newOptions[attr.attribute?.name] === attr.value)
    );
    
    if (exactMatch) {
      setSelectedOptions(newOptions);
    } else {
      const alternative = product.productVariants?.find((variant: any) =>
        variant.isActive && variant.attributes?.some((attr: any) => attr.attribute?.name === attrName && attr.value === value)
      );
      if (alternative) {
        const updatedOptions: Record<string, string> = {};
        alternative.attributes?.forEach((attr: any) => {
          updatedOptions[attr.attribute?.name] = attr.value;
        });
        setSelectedOptions(updatedOptions);
      } else {
        setSelectedOptions(newOptions);
      }
    }
    setCount(1);
  };

  const handleCount = (type: "plus" | "minus", maxStock: number) => {
    if (type === "plus") {
      setCount((prev) => Math.min(prev + 1, maxStock));
    } else {
      if (count > 1) {
        setCount((prev) => prev - 1);
      }
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      toast.error("Please log in to add items to your cart.");
      const redirectPath = encodeURIComponent(window.location.pathname + window.location.search);
      router.push(`/login?redirect=${redirectPath}`);
      return;
    }
    if (!product) return;

    if (product.hasVariants && !selectedVariant) {
      toast.error("The selected variant combination is unavailable.");
      return;
    }

    const variantId = selectedVariant?._id || product._id;

    try {
      await addToCartApi({
        product: product._id,
        variant: variantId,
        quantity: count,
      }).unwrap();
      toast.success(`${count} x ${product.name} added to cart!`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add to cart.");
    }
  };

  const handleWishlistToggle = async () => {
    if (!token) {
      toast.error("Please log in to add items to your wishlist.");
      const redirectPath = encodeURIComponent(window.location.pathname + window.location.search);
      router.push(`/login?redirect=${redirectPath}`);
      return;
    }
    if (!product) return;

    try {
      if (isWishlisted) {
        await removeFromWishlist(product._id).unwrap();
        toast.success("Removed from wishlist");
      } else {
        await toggleWishList({ productId: product._id }).unwrap();
        toast.success("Added to wishlist");
      }
      refetchWishlist();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update wishlist.");
    }
  };

  const getColorHex = (colorName: string) => {
    const map: Record<string, string> = {
      black: "#0b0c10",
      "carbon black": "#13141f",
      blue: "#2b4cff",
      indigo: "#4f46e5",
      grey: "#6b7280",
      gray: "#6b7280",
      white: "#ffffff",
      red: "#ef4444",
      green: "#10b981",
      silver: "#cbd5e1",
    };
    return map[colorName.toLowerCase()] || colorName;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#0B0B14] min-h-screen py-12 transition-colors duration-300">
        <Container>
          <div className="animate-pulse">
            <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded mb-8" />
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="w-full lg:w-1/2 h-[500px] bg-slate-200 dark:bg-slate-800 rounded-3xl" />
              <div className="flex-1 space-y-6">
                <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-6 w-1/4 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-32 w-full bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-white dark:bg-[#0B0B14] min-h-screen py-16 flex flex-col items-center justify-center px-4 transition-colors duration-300">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Product Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">The product you are looking for does not exist or is unavailable.</p>
        <Button onClick={() => router.push("/products")} className="mt-6 bg-primary hover:bg-primary-hover dark:bg-[#5f5eff] dark:hover:bg-[#4d4cff] text-white cursor-pointer transition-colors duration-200">
          Back to Catalog
        </Button>
      </div>
    );
  }

  const displayImage = activeImage || allImages[0] || "/placeholder.png";

  const maxStock = product.hasVariants 
    ? (selectedVariant ? selectedVariant.stock : 0)
    : (product.totalStock || 0);

  const currentPrice = getDisplayPrice(product, customerType, selectedVariant);

  const currentBasePrice = product.hasVariants && selectedVariant
    ? selectedVariant.price
    : product.basePrice;

  const discountPercent = product.productDiscount
    ? product.discountType === "percentage"
      ? `${product.productDiscount}%`
      : `৳${product.productDiscount}`
    : null;

  return (
    <div className="bg-white dark:bg-[#0B0B14] text-slate-900 dark:text-white min-h-screen py-12 transition-colors duration-300">
      <Container>


        {/* Product Details Section */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-16">
          {/* Product Gallery */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <div className="bg-slate-50 dark:bg-[#09090e] aspect-square rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800/80 relative flex items-center justify-center p-8">
              <Image
                src={displayImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                priority
              />
              <span className="absolute top-4 right-4 bg-primary/10 border border-primary/30 text-primary dark:bg-[#5f5eff]/10 dark:border-[#5f5eff]/30 dark:text-[#5f5eff] text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-lg">
                High Precision
              </span>
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${
                      displayImage === img ? "border-primary dark:border-[#5f5eff] scale-95" : "border-slate-200 dark:border-slate-800/65 bg-slate-50 dark:bg-[#09090e] hover:border-slate-350 dark:hover:border-slate-700"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name}-${i}`}
                      fill
                      sizes="80px"
                      className="object-contain p-1.5"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Panel */}
          <div className="flex-1 flex flex-col">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {product.name}
            </h1>

            {/* SKU and Stock Row */}
            <div className="flex items-center gap-4 mt-2">
              {product.sku && (
                <span className="text-xs text-slate-500 font-mono">SKU: {product.sku}</span>
              )}
              {maxStock > 0 ? (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-[#00e5a3]">
                  <CheckCircle size={14} /> In Stock ({maxStock} units)
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-bold text-red-650 dark:text-red-500">
                  <AlertCircle size={14} /> Out of Stock
                </span>
              )}
            </div>

            {/* Rating row (placed before price) */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500 dark:text-yellow-450 mt-4">
              {renderStars(product.averageRating || 5)}
              <span className="text-slate-500 dark:text-slate-400 font-bold ml-1">
                {(product.averageRating || 5).toFixed(1)} / {product.totalReviews || 124} reviews
              </span>
            </div>

            {/* Price display block */}
            <div className="mt-4 flex items-baseline gap-4">
              <span className="text-4xl font-black text-slate-900 dark:text-white">৳{currentPrice}</span>
              {currentBasePrice > currentPrice && (
                <span className="text-lg text-slate-400 dark:text-slate-500 line-through">৳{currentBasePrice}</span>
              )}
              {discountPercent && (
                <span className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/30 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded">
                  Save {discountPercent}
                </span>
              )}
            </div>

            {/* Variant Selector swatches */}
            {product.hasVariants && Object.keys(uniqueAttributes).length > 0 && (
              <div className="mt-8 border-t border-slate-200 dark:border-slate-800/60 pt-6 space-y-6">
                {Object.keys(uniqueAttributes).map((attrName) => {
                  const isColor = attrName.toLowerCase() === "color" || attrName.toLowerCase() === "core color";
                  return (
                    <div key={attrName} className="flex flex-col gap-2.5">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Select {attrName}
                      </span>
                      <div className="flex flex-wrap gap-3">
                        {uniqueAttributes[attrName].map((value) => {
                          const isSelected = selectedOptions[attrName] === value;
                          
                          // For color option, find the first variant matching this color to extract its image preview
                          let colorImageUrl = "";
                          if (isColor && product.productVariants) {
                            const matchingVariant = product.productVariants.find((v: any) =>
                              v.isActive && v.attributes?.some((a: any) => (a.attribute?.name || "").toLowerCase() === "color" && a.value === value)
                            );
                            if (matchingVariant?.images?.[0]) {
                              colorImageUrl = matchingVariant.images[0];
                            }
                          }
 
                          if (isColor && colorImageUrl) {
                            return (
                              <button
                                key={value}
                                onClick={() => handleOptionSelect(attrName, value)}
                                className={`relative w-16 h-16 rounded-xl border overflow-hidden transition-all cursor-pointer bg-white dark:bg-slate-950 ${
                                  isSelected 
                                    ? "border-primary dark:border-[#5f5eff] ring-2 ring-primary/20 dark:ring-[#5f5eff]/20 scale-95" 
                                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 opacity-80 hover:opacity-100"
                                }`}
                                title={value}
                              >
                                <img
                                  src={colorImageUrl}
                                  alt={value}
                                  className="w-full h-full object-cover"
                                />
                                <span className="absolute bottom-0 inset-x-0 bg-slate-100/90 dark:bg-black/75 text-[8px] font-black text-slate-800 dark:text-white text-center py-0.5 truncate px-1 uppercase tracking-tighter">
                                  {value}
                                </span>
                              </button>
                            );
                          }

                          return (
                            <button
                              key={value}
                              onClick={() => handleOptionSelect(attrName, value)}
                              className={`px-5 py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-slate-100 dark:bg-[#121320] text-slate-900 dark:text-white border-primary dark:border-[#5f5eff] shadow-sm dark:shadow-lg dark:shadow-[#5f5eff]/10"
                                  : "bg-white dark:bg-[#09090e] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white"
                              }`}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quantity Selector & Stock Limits */}
            {maxStock > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/60 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-slate-50 dark:bg-[#09090e] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                    <button
                      onClick={() => handleCount("minus", maxStock)}
                      className="p-3.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-450 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      <FaMinus size={10} />
                    </button>
                    <span className="px-5 text-sm font-bold text-slate-900 dark:text-white">{count}</span>
                    <button
                      onClick={() => handleCount("plus", maxStock)}
                      className="p-3.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-450 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      <FaPlus size={10} />
                    </button>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Only <span className="text-emerald-600 dark:text-[#00e5a3] font-bold">{maxStock} units</span> left in stock
                  </span>
                </div>
 
                <div className="flex gap-4">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary hover:bg-primary-hover dark:bg-[#5f5eff] dark:hover:bg-[#4d4cff] text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 shadow-md dark:shadow-lg dark:shadow-[#5f5eff]/10 transition-all active:scale-95 cursor-pointer text-xs uppercase tracking-wider"
                  >
                    <ShoppingBag size={14} /> Add to Cart
                  </Button>
                  <button
                    onClick={handleWishlistToggle}
                    disabled={isTogglingWishlist}
                    className="px-4 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-500 hover:border-red-200 dark:hover:border-red-950/40 bg-slate-50 dark:bg-[#121320] transition-all cursor-pointer flex items-center justify-center active:scale-95"
                  >
                    {isWishlisted ? (
                      <FaHeart size={16} className="text-red-500 animate-pulse" />
                    ) : (
                      <FaRegHeart size={16} />
                    )}
                  </button>
                </div>
              </div>
            )}
 
            {/* Delivery Badges */}
            <div className="flex flex-wrap gap-6 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/60">
              <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                <Truck size={16} className="text-primary dark:text-[#5f5eff]" />
                <span>Free Global Shipping</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                <Shield size={16} className="text-primary dark:text-[#5f5eff]" />
                <span>2 Year Warranty</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Technical Specifications Tabs */}
        <div className="border-t border-slate-200 dark:border-slate-800/80 pt-10">
          <div className="flex gap-8 border-b border-slate-200 dark:border-slate-800/60 pb-3 mb-8">
            <button
              onClick={() => setActiveTab("description")}
              className={`text-sm font-bold pb-2 transition-all relative cursor-pointer ${
                activeTab === "description" ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-350"
              }`}
            >
              Description
              {activeTab === "description" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary dark:bg-[#5f5eff]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("specifications")}
              className={`text-sm font-bold pb-2 transition-all relative cursor-pointer ${
                activeTab === "specifications" ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-350"
              }`}
            >
              Specifications
              {activeTab === "specifications" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary dark:bg-[#5f5eff]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`text-sm font-bold pb-2 transition-all relative cursor-pointer ${
                activeTab === "reviews" ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-350"
              }`}
            >
              Reviews ({reviewsResponse?.data?.length ?? product.totalReviews ?? 0})
              {activeTab === "reviews" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary dark:bg-[#5f5eff]" />
              )}
            </button>
          </div>

          <div className="bg-white dark:bg-[#121320] border border-slate-100 dark:border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-sm dark:shadow-xl">
            {activeTab === "description" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                <div className="lg:col-span-7 space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-wide">
                    Engineered for Extremes
                  </h3>
                  <div
                    className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ __html: product.description || product.shortDescription }}
                  />
                  <ul className="space-y-2.5 pt-4">
                    <li className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <span className="text-emerald-600 dark:text-[#00e5a3]">✓</span> Advanced Liquid Cooling Core with Graphene Heat Sinks
                    </li>
                    <li className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <span className="text-emerald-600 dark:text-[#00e5a3]">✓</span> Real-time Telemetry Processing via Integrated AI Chip
                    </li>
                    <li className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <span className="text-emerald-600 dark:text-[#00e5a3]">✓</span> Titanium-Reinforced External Shell for Physical Protection
                    </li>
                  </ul>
                </div>

                <div className="lg:col-span-5 bg-slate-50 dark:bg-[#09090e] border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold tracking-wider text-slate-500 uppercase bg-slate-100/50 dark:bg-[#121320]/40">
                        <th className="px-4 py-3">Feature</th>
                        <th className="px-4 py-3">Rating</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 dark:divide-slate-800/50">
                      <tr>
                        <td className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">Core Clock Speed</td>
                        <td className="px-4 py-3 text-primary dark:text-[#5f5eff] font-bold">8.4 GHz Burst</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">Thermal Capacity</td>
                        <td className="px-4 py-3 text-primary dark:text-[#5f5eff] font-bold">350W TDP</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">Bus Architecture</td>
                        <td className="px-4 py-3 text-primary dark:text-[#5f5eff] font-bold">Quantum-Link V3</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">Neural Engine</td>
                        <td className="px-4 py-3 text-primary dark:text-[#5f5eff] font-bold">128 Tera-Ops</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-600 dark:text-slate-350 divide-y divide-slate-100 dark:divide-slate-800">
                  <tbody>
                    <tr className="border-b border-slate-100 dark:border-slate-800/60">
                      <td className="py-3.5 font-bold text-slate-400 dark:text-slate-500 w-1/4 uppercase tracking-wider">Category</td>
                      <td className="py-3.5 text-slate-800 dark:text-white">{product.category?.name || "Premium Category"}</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-800/60">
                      <td className="py-3.5 font-bold text-slate-400 dark:text-slate-500 w-1/4 uppercase tracking-wider">SKU Code</td>
                      <td className="py-3.5 font-mono text-slate-800 dark:text-white">{product.sku || "N/A"}</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-800/60">
                      <td className="py-3.5 font-bold text-slate-400 dark:text-slate-500 w-1/4 uppercase tracking-wider">Stock Level</td>
                      <td className="py-3.5 text-slate-800 dark:text-white">{maxStock} available units</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-800/60">
                      <td className="py-3.5 font-bold text-slate-400 dark:text-slate-500 w-1/4 uppercase tracking-wider">Warranty Type</td>
                      <td className="py-3.5 text-slate-800 dark:text-white">2 Year Manufacturer Warranty</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "reviews" && (
                <div className="space-y-10">
                  {/* Reviews Summary Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-200 dark:border-slate-850 gap-4">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">Customer Reviews</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        Showing {reviewsResponse?.data?.length ?? 0} reviews
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        {(product.averageRating || 5.0).toFixed(1)}
                      </span>
                      <div className="text-amber-500 dark:text-yellow-450 flex text-sm">
                        {renderStars(product.averageRating || 5)}
                      </div>
                    </div>
                  </div>

                  {/* Two Column Layout: Reviews List & Write a Review Form */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Reviews List */}
                    <div className="lg:col-span-7 space-y-6">
                      {isLoadingReviews ? (
                        <div className="flex justify-center py-8">
                          <div className="w-8 h-8 border-2 border-primary dark:border-[#5f5eff] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : reviews.length === 0 ? (
                        <div className="p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center space-y-2">
                          <p className="text-xs text-slate-500 dark:border-slate-800 font-semibold">No reviews yet for this product</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-550">Be the first to share your thoughts with other customers!</p>
                        </div>
                      ) : (
                        <div className="space-y-6 divide-y divide-slate-150 dark:divide-slate-800/50">
                          {reviews.map((rev: any) => (
                            <div key={rev._id} className="pt-5 first:pt-0 space-y-2.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {rev.user?.avatar ? (
                                    <img
                                      src={rev.user.avatar}
                                      alt={rev.user.name}
                                      className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                                    />
                                  ) : (
                                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                                      {rev.user?.name?.charAt(0) || "U"}
                                    </div>
                                  )}
                                  <span className="font-bold text-slate-800 dark:text-white text-xs">
                                    {rev.user?.name || "Anonymous"}
                                  </span>
                                  {rev.isVerified && (
                                    <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/35 text-[9px] font-black uppercase px-2 py-0.5 rounded-lg">
                                      <CheckCircle size={10} /> Verified Buyer
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                                  {new Date(rev.createdAt).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              <div className="text-amber-500 dark:text-yellow-450 flex text-[10px]">
                                {renderStars(rev.rating)}
                              </div>
                              <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed">
                                {rev.message}
                              </p>
                              {rev.images && rev.images.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-1.5">
                                  {rev.images.map((img: string, idx: number) => (
                                    <div
                                      key={idx}
                                      onClick={() => setZoomedImage(img)}
                                      className="relative w-16 h-16 rounded-xl border border-slate-200 dark:border-slate-805 overflow-hidden cursor-zoom-in group hover:opacity-90 transition-all bg-slate-50 dark:bg-[#09090e]"
                                    >
                                      <img
                                        src={img}
                                        alt={`attachment-${idx}`}
                                        className="w-full h-full object-cover"
                                      />
                                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                        <Eye size={12} className="text-white" />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Write a Review Form */}
                    <div className="lg:col-span-5">
                      <div className="p-6 bg-slate-50 dark:bg-[#09090e]/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm">
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                          Write a Review
                        </h4>

                        {!token ? (
                          <div className="space-y-4 py-3 text-center">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              You must be logged in as a customer to submit a review for this product.
                            </p>
                            <Button
                              onClick={() => {
                                const redirectPath = encodeURIComponent(window.location.pathname + window.location.search);
                                router.push(`/login?redirect=${redirectPath}`);
                              }}
                              className="w-full bg-primary hover:bg-primary-hover dark:bg-[#5f5eff] dark:hover:bg-[#4d4cff] text-white font-bold h-10 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                            >
                              Log In to Review
                            </Button>
                          </div>
                        ) : (
                          <form onSubmit={handleReviewSubmit} className="space-y-5">
                            {/* Star Rating Selection */}
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                                Overall Rating
                              </label>
                              <div className="flex items-center gap-1.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setReviewRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="p-1 transition-all hover:scale-110 cursor-pointer"
                                  >
                                    <Star
                                      size={20}
                                      className={`${
                                        star <= (hoverRating || reviewRating)
                                          ? "text-amber-500 fill-amber-500"
                                          : "text-slate-350 dark:text-slate-700"
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Message Area */}
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                                Review Message
                              </label>
                              <textarea
                                value={reviewMessage}
                                onChange={(e) => setReviewMessage(e.target.value)}
                                rows={4}
                                placeholder="Share your experience... (min 5 characters)"
                                className="w-full px-4 py-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#06060a] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white"
                                required
                              />
                            </div>

                            {/* Photo Attach uploader */}
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                                Add Photos (Max 5)
                              </label>
                              <div className="flex flex-wrap gap-2.5">
                                {localImages.map((file, idx) => {
                                  const previewUrl = URL.createObjectURL(file);
                                  return (
                                    <div
                                      key={idx}
                                      className="relative w-14 h-14 rounded-xl border border-slate-200 dark:border-slate-805 overflow-hidden bg-slate-100"
                                    >
                                      <img
                                        src={previewUrl}
                                        alt="preview"
                                        className="w-full h-full object-cover"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removeLocalImage(idx)}
                                        className="absolute top-0.5 right-0.5 p-0.5 bg-black/60 hover:bg-black text-white rounded-full transition-all cursor-pointer"
                                      >
                                        <X size={8} />
                                      </button>
                                    </div>
                                  );
                                })}

                                {localImages.length < 5 && (
                                  <label className="w-14 h-14 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-[#5f5eff] flex flex-col items-center justify-center cursor-pointer transition-colors text-slate-400 hover:text-primary dark:hover:text-[#5f5eff]">
                                    <UploadCloud size={14} />
                                    <span className="text-[8px] font-bold mt-0.5 uppercase tracking-tighter">
                                      Upload
                                    </span>
                                    <input
                                      type="file"
                                      multiple
                                      accept="image/*"
                                      className="hidden"
                                      onChange={handleImageChange}
                                    />
                                  </label>
                                )}
                              </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                              type="submit"
                              disabled={isCreatingReview || isUploading}
                              className="w-full bg-primary hover:bg-primary-hover dark:bg-[#5f5eff] dark:hover:bg-[#4d4cff] text-white font-bold h-10 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-97 cursor-pointer"
                            >
                              {(isCreatingReview || isUploading) && (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              )}
                              Submit Review
                            </Button>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
            )}
          </div>
        </div>
      </Container>

      {/* Review Zoom Image Modal Overlay */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 bg-black/90 z-[70] flex items-center justify-center p-4 cursor-zoom-out"
        >
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute top-4 right-4 p-2 bg-black/40 text-white hover:bg-black/60 rounded-full cursor-pointer transition-colors"
          >
            <X size={20} />
          </button>
          <img
            src={zoomedImage}
            alt="zoomed-attachment"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}

export default function SingleProductPageWrapper() {
  return (
    <Suspense fallback={
      <div className="bg-white dark:bg-[#0B0B14] min-h-screen py-12 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary dark:border-[#5f5eff] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <SingleProductPage />
    </Suspense>
  );
}
