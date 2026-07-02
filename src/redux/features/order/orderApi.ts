import { baseApi } from "@/redux/api/baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyOrders: builder.query({
      query: () => "/my-orders",
      providesTags: ["Order"],
    }),
    checkout: builder.mutation({
      query: (data) => ({
        url: "/checkout",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Order", "Cart"],
    }),
    getOrderById: builder.query({
      query: (id) => `/order/${id}`,
      providesTags: ["Order"],
    }),
  }),
});

export const {
  useGetMyOrdersQuery,
  useCheckoutMutation,
  useGetOrderByIdQuery,
} = orderApi;
