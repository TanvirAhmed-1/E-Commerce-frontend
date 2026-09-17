"use client";

import React from "react";
import { renderStars } from "@/utils/renderStars";

export const HomeCustomerReviews: React.FC = () => {
  const reviews = [
    {
      name: "Farhana Akter",
      location: "Dhaka",
      rating: 5,
      comment: "Product quality is really good. Delivery was quick. Very satisfied with GhorBazar service.",
      avatar: "FA",
    },
    {
      name: "Rafiq Hasan",
      location: "Chittagong",
      rating: 5,
      comment: "The electric rice cooker works perfectly. Authentic product and solid packaging.",
      avatar: "RH",
    },
    {
      name: "Sumaiya Islam",
      location: "Sylhet",
      rating: 5,
      comment: "Nice collection of durable plastic products and kitchenware. Will definitely shop again!",
      avatar: "SI",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-6 w-full">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white">
          Customer Reviews
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.name}
              className="bg-white dark:bg-[#121320] p-5 rounded-xl border border-slate-200/70 dark:border-slate-800 shadow-xs flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#003820] text-white font-bold flex items-center justify-center text-xs">
                    {rev.avatar}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {rev.name}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {rev.location}
                    </span>
                  </div>
                </div>
                <div className="text-amber-500 text-xs">{renderStars(rev.rating)}</div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeCustomerReviews;
