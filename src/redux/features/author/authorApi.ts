import { baseApi } from "@/redux/api/baseApi";

export const authorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPopularAuthor: builder.query({
      query: () => "/get-home-page-writers",
    }),
    getAllAuthor: builder.query({
      query: () => "/get-all-writers",
    }),
    getSingleAuthor: builder.query({
      query: (id) => `/get-all-writers/${id}`,
    }),
  }),
});

export const {
  useGetPopularAuthorQuery,
  useGetAllAuthorQuery,
  useGetSingleAuthorQuery,
} = authorApi;
