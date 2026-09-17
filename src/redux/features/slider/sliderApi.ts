import { baseApi } from "@/redux/api/baseApi";

export interface ISlider {
  _id: string;
  title?: string;
  image: string;
  link?: string;
  priority?: number;
  isActive?: boolean;
}

export const sliderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHomeSliders: builder.query<{ success: boolean; data: ISlider[] }, void>({
      query: () => "/sliders",
      providesTags: ["Home", "Slider"],
    }),
  }),
});

export const { useGetHomeSlidersQuery } = sliderApi;
