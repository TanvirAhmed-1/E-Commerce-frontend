import { baseApi } from "@/redux/api/baseApi";
export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyOrder: builder.query({
      query: () => "/get-my-orders",
      providesTags: ["Order"],
    }),
    createOrder: builder.mutation({
      query: (data) => ({
        url: "/submit-order",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),

    getOrderByOrderNo: builder.query({
      query: (orderNo) => ({
        url: "/get-order-by-order-no",
        params: {
          order_no: orderNo,
        },
      }),
    }),

    // ssl payment
    sslPayment: builder.mutation({
      query: (data) => ({
        url: "/ssl-payment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["payment"],
    }),
  }),
});

export const {
  useGetMyOrderQuery,
  useCreateOrderMutation,
  useSslPaymentMutation,
  useGetOrderByOrderNoQuery,
} = orderApi;
