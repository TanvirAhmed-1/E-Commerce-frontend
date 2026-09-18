import { baseApi } from "@/redux/api/baseApi";

export const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveBanners: builder.query({
      query: () => "/banners",
      providesTags: ["Banner"],
    }),
  }),
});

export const { useGetActiveBannersQuery } = bannerApi;
