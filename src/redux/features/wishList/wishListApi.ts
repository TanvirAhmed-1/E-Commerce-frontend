import { baseApi } from "@/redux/api/baseApi";

export const wishListApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWishList: builder.query({
      query: () => "/get-wishlist",
      providesTags: ["WishList"],
    }),

    addToWishList: builder.mutation({
      query: (data) => ({
        url: "/add-to-wishlist",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["WishList"],
    }),

    removeFromWishList: builder.mutation({
      query: (id) => ({
        url: `/delete-from-wishlist/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["WishList"],
    }),
  }),
});

export const {
  useGetWishListQuery,
  useAddToWishListMutation,
  useRemoveFromWishListMutation,
} = wishListApi;
