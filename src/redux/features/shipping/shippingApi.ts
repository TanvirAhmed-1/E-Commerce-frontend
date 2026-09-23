import { baseApi } from "@/redux/api/baseApi";

export const shippingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPublicLocations: builder.query({
      query: () => ({
        url: "/shipping/public-locations",
        method: "GET",
      }),
      providesTags: ["Shipping"],
    }),

    getShippingSettings: builder.query({
      query: () => ({
        url: "/shipping/settings",
        method: "GET",
      }),
      providesTags: ["Shipping"],
    }),

    calculateDeliveryCharge: builder.mutation({
      query: (data) => ({
        url: "/shipping/calculate-charge",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetPublicLocationsQuery,
  useGetShippingSettingsQuery,
  useCalculateDeliveryChargeMutation,
} = shippingApi;
