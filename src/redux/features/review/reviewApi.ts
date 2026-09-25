import { baseApi } from "@/redux/api/baseApi";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query({
      query: (productId) => ({
        url: `/product-reviews/${productId}`,
        method: "GET",
      }),
      providesTags: ["Review"],
    }),
    getAllReviews: builder.query({
      query: () => ({
        url: "/all-reviews",
        method: "GET",
      }),
      providesTags: ["Review"],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: "/create-review",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Review", "ProductDetails", "Product"],
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/delete-review/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Review", "ProductDetails", "Product"],
    }),
    uploadImages: builder.mutation({
      query: (formData) => ({
        url: "/upload/multiple",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetProductReviewsQuery,
  useGetAllReviewsQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useUploadImagesMutation,
} = reviewApi;

