export interface ProductAttribute {
  attribute?: {
    _id?: string;
    name?: string;
  };
  value?: string;
}

export interface ProductVariant {
  _id: string;
  name?: string;
  sku?: string;
  price?: number;
  stock: number;
  isActive: boolean;
  images?: string[];
  attributes?: ProductAttribute[];
}

export interface ProductReview {
  _id: string;
  user?: {
    name?: string;
    avatar?: string;
  };
  rating: number;
  message: string;
  images?: string[];
  isVerified?: boolean;
  createdAt: string;
}

export interface RelatedProduct {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountBadge?: string;
  rating: number;
  reviewsCount: number;
  image: string;
  slug?: string;
}
