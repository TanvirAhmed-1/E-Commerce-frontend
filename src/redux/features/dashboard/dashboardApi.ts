import { baseApi } from "@/redux/api/baseApi";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query({
      query: () => ({
        url: "/get-profile",
        method: "GET",
      }),
      providesTags: ["Profile"], 
    }),

    updatePassword: builder.mutation({
      query: (data) => ({
        url: "/update-password",
        body: data,
        method: "PUT",
      }),
    }),
  }),
});

export const { 
    useGetMyProfileQuery,
    useUpdatePasswordMutation, 
} = dashboardApi;