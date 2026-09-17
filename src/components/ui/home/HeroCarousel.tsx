import React from "react";
import { getHomeSlidersServer } from "@/utils/fetchHelper";
import HeroCarouselClient, { ISlideItem } from "./HeroCarouselClient";

export default async function HeroCarousel() {
  let slides: ISlideItem[] = [];

  try {
    const res = await getHomeSlidersServer();

    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      slides = res.data.map((slider: any) => ({
        _id: slider._id,
        image: slider.image,
        title: slider.title || "",
        link: slider.link || "/products",
        badge: slider.badge || "Featured Offer",
      }));
    }
  } catch (err) {
    console.error("Failed to fetch server-side sliders:", err);
  }

  if (!slides || slides.length === 0) {
    return null;
  }

  return <HeroCarouselClient slides={slides} />;
}