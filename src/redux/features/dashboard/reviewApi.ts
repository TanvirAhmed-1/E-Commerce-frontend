import { baseApi } from "@/redux/api/baseApi";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyReviews: builder.query({
      query: () => "/get-my-product-reviews",
      providesTags: ["Review"],
    }),

    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/delete-product-review/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Review"],
    }),
  }),
});

export const { useGetMyReviewsQuery, useDeleteReviewMutation } = reviewApi;
