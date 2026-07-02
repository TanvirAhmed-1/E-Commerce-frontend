import { baseApi } from "@/redux/api/baseApi";

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyCart: builder.query({
      query: () => "/get-cart",
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: (data) => ({
        url: "/add-cart",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),
    updateQuantity: builder.mutation({
      query: (data) => ({
        url: "/update-quantity",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),
    removeItem: builder.mutation({
      query: (variantId) => ({
        url: `/remove-item/${variantId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: "/clear-cart",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetMyCartQuery,
  useAddToCartMutation,
  useUpdateQuantityMutation,
  useRemoveItemMutation,
  useClearCartMutation,
} = cartApi;
