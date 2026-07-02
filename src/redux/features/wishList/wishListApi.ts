import { baseApi } from "@/redux/api/baseApi";

export const wishListApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWishList: builder.query({
      query: () => "/my-wishlist",
      providesTags: ["WishList"],
    }),
    toggleWishList: builder.mutation({
      query: (data) => ({
        url: "/add-wishlist",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["WishList", "Product", "ProductDetails"],
    }),
    removeFromWishList: builder.mutation({
      query: (productId) => ({
        url: `/remove-wishlist/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["WishList", "Product", "ProductDetails"],
    }),
  }),
});

export const {
  useGetWishListQuery,
  useToggleWishListMutation,
  useRemoveFromWishListMutation,
} = wishListApi;
