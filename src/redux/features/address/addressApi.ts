import { baseApi } from "@/redux/api/baseApi";

export const addressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyAddresses: builder.query({
      query: () => "/get-my-addresses",
      providesTags: ["Address"],
    }),
    createAddress: builder.mutation({
      query: (data) => ({
        url: "/create-address",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Address"],
    }),
    deleteAddress: builder.mutation({
      query: (id) => ({
        url: `/delete-address/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Address"],
    }),
  }),
});

export const {
  useGetMyAddressesQuery,
  useCreateAddressMutation,
  useDeleteAddressMutation,
} = addressApi;
