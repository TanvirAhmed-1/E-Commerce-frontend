import { baseApi } from "@/redux/api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: () => ({
        url: "/get-profile",
        method: "GET",
      }),
      providesTags: ["User", "Profile"],
    }),
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: "/update-profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User", "Profile"],
    }),
  }),
});

export const { useGetUserProfileQuery, useUpdateUserProfileMutation } = authApi;

