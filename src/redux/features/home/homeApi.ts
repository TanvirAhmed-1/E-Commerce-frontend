import { baseApi } from "@/redux/api/baseApi";

export const homeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSliderImage: builder.query({
      query: () => "/get-highlighted-sliders",
      providesTags: ["Home"],
    }),
    getHomeSliders: builder.query({
      query: () => "/sliders",
      providesTags: ["Home"],
    }),
    getHighlightedCategories: builder.query({
      query: () => "/get-highlighted-categories",
    }),
    getMenuCategory: builder.query({
      query: () => "/get-menu-categories",
    }),
    getHighlightProducts: builder.query({
      query: () => `/get-all-highlighted-types-product`,
    }),
    getCompanyInfo: builder.query({
      query: () => "/get-company-info",
    }),
    getFooterInfo: builder.query({
      query: () => "/get-footer",
    }),
  }),
});

export const {
  useGetSliderImageQuery,
  useGetHomeSlidersQuery,
  useGetHighlightedCategoriesQuery,
  useGetHighlightProductsQuery,
  useGetMenuCategoryQuery,
  useGetCompanyInfoQuery,
  useGetFooterInfoQuery,
} = homeApi;
