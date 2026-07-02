/**
 * Helper to get the correct price of a product or product variant based on the user's customerType.
 * If the user is a reseller, it shows the resellerPrice (falling back to salePrice/basePrice if resellerPrice is not set).
 * Otherwise (customer, guest, admin), it shows the salePrice (falling back to basePrice).
 * 
 * @param product The product object containing pricing details (basePrice, salePrice, resellerPrice).
 * @param customerType The role or customer type of the logged-in user (e.g. "reseller", "customer").
 * @param variant Optional selected variant object containing variant-specific price.
 * @returns The calculated display price.
 */
export const getDisplayPrice = (
  product: any,
  customerType: string | null | undefined,
  variant?: any
): number => {
  if (!product) return 0;

  const isReseller = customerType?.toLowerCase() === "reseller";

  if (isReseller) {
    // If a variant is selected, check if it has a custom price
    if (variant && variant.price !== undefined && variant.price !== null) {
      // Calculate proportional reseller price based on variant price if root prices exist
      if (product.salePrice && product.resellerPrice) {
        const ratio = product.resellerPrice / product.salePrice;
        return Math.round(variant.price * ratio);
      }
      // If reseller price is specified on product, use it as fallback
      if (product.resellerPrice) {
        return product.resellerPrice;
      }
      return variant.price;
    }

    // Root-level reseller price
    if (product.resellerPrice !== undefined && product.resellerPrice !== null && product.resellerPrice > 0) {
      return product.resellerPrice;
    }
  }

  // Non-reseller or fallback price flow
  if (variant && variant.price !== undefined && variant.price !== null) {
    return variant.price;
  }

  return product.salePrice !== undefined && product.salePrice !== null
    ? product.salePrice
    : product.basePrice || 0;
};

/**
 * Helper to check if a product has a discount applied for the current user.
 * For resellers, the discount status is based on resellerPrice vs basePrice.
 * For regular customers, it's based on salePrice vs basePrice.
 */
export const hasDiscount = (
  product: any,
  customerType: string | null | undefined,
  variant?: any
): boolean => {
  if (!product) return false;

  const displayPrice = getDisplayPrice(product, customerType, variant);
  const basePrice = product.basePrice || 0;

  return basePrice > displayPrice;
};
