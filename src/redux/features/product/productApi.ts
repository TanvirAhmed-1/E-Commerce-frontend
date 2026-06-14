import { baseApi } from "@/redux/api/baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductById: builder.query({
      query: (id) => `/get-product-by-id/${id}`,
      providesTags: ["Product"],
    }),
    getCategoryWiseProduct: builder.query({
      query: (category) => `/get-category-wise-products/${category}`,
      providesTags: ["Product"],
    }),
    getAllProductAttributes: builder.query({
      query: () => ({
        url: `/get-search-attributes`,
      }),
      providesTags: ["Product"],
    }),
    searchAllProducts: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams(
          Object.entries(params).filter(
            //eslint-disable-next-line
            ([_, value]) => value !== null && value !== undefined
          ) as [string, string][]
        );
        return {
          url: "/search",
          method: "GET",
          params: searchParams,
        };
      },
      providesTags: ["Product"],
    }),
    submitReview: builder.mutation({
      query: (data) => ({
        url: "/submit-reviews",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ProductDetails", "Review"],
    }),

    getReviews: builder.query({
      query: (slug) => `/get-product-details/${slug}`,
      providesTags: ["ProductDetails"],
    }),
  }),
});

export const {
  useGetProductByIdQuery,
  useSubmitReviewMutation,
  useGetCategoryWiseProductQuery,
  useGetReviewsQuery,
  useSearchAllProductsQuery,
  useGetAllProductAttributesQuery,
} = productApi;
